<?php

namespace App\Http\Controllers;

use App\Mail\BillMail;
use App\Models\Bill;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use SebastianBergmann\Type\ObjectType;

class PaymentBuyNowController extends Controller
{
    //

    public function buyNow(Request $request)
    {
        $formData = $request->all();

        Cache::put(
            "app_id_user",
            ["bill_user_id" =>   $formData["bill_user_id"]],
            now()->addMinutes(60)
        );

        Cache::put("formData_{$formData["bill_user_id"]}", [
            "bill_product_id" =>  $formData["bill_product_id"],
            "bill_user_id" => $formData["bill_user_id"],
            "bill_payment_id" => $formData["bill_payment_id"],
            "bill_price_total" => $formData["bill_price_total"],
            "bill_quantity" => $formData["bill_quantity"],
        ], now()->addMinutes(60));


        // Nếu thanh toán bằng VNPAY
        if ($formData["bill_payment_id"] == 2) {
            $vnp_TmnCode   = "ZFVN0GBW";
            $vnp_HashSecret = "XKPWP1CDDREYDSTWKYD2CRQD35DBWT3K";
            $vnp_Url       = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = "http://localhost:5173/result-vnPay";

            // $vnp_TxnRef    = time(); // mã đơn hàng
            $vnp_TxnRef    = uniqid(); // sinh chuỗi duy nhất theo thời gian microsecond
            $vnp_OrderInfo = "Thanh toán hóa đơn";
            $vnp_OrderType = "billpayment";
            $vnp_Amount    = $formData["bill_price_total"] * 100; // nhân 100
            $vnp_IpAddr    = $request->ip();

            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => "vn",
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef
            ];

            ksort($inputData);
            $query = "";
            $hashdata = "";
            $i = 0;
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url = $vnp_Url . "?" . $query . "vnp_SecureHash=" . $vnpSecureHash;

            return response()->json([
                "status" => true,
                "payment_url" => $vnp_Url
            ]);
        } else if ($formData["bill_payment_id"] == 3) {

            $config = [
                "appid"    => 553,
                "key1"     => "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
                "key2"     => "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
                "endpoint" => "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
            ];

            // Dữ liệu đơn hàng
            $order = [
                "appid"       => $config["appid"],
                "appuser"     => "demo",
                "amount"      => $formData["bill_price_total"],
                "apptime"     => round(microtime(true) * 1000),
                "apptransid"  => date("ymd") . "_" . uniqid(),
                "item"        => json_encode([]),
                "embeddata"   => json_encode([
                    "client_name"      => $formData["bill_user_id"],
                    "total_price"      => $formData["bill_price_total"],
                    "product_quantity" => $formData["bill_quantity"],
                    "redirecturl"      => "http://localhost:5173/result-zaloPay"
                ]),
                "description" => "Thanh toán sản phẩm #" . $formData["bill_product_id"],
                "callbackurl" => "http://127.0.0.1:8000/api/zalo/callback"
            ];


            // Tạo MAC
            $data = $order["appid"] . "|" . $order["apptransid"] . "|" . $order["appuser"] . "|" .
                $order["amount"] . "|" . $order["apptime"] . "|" . $order["embeddata"] . "|" . $order["item"];

            $order["mac"] = hash_hmac("sha256", $data, $config["key1"]);

            // Gửi request tới ZaloPay
            $context = stream_context_create([
                "http" => [
                    "header"  => "Content-type: application/x-www-form-urlencoded\r\n",
                    "method"  => "POST",
                    "content" => http_build_query($order)
                ]
            ]);

            $resp   = file_get_contents($config["endpoint"], false, $context);
            $result = json_decode($resp, true);




            return response()->json([
                "status" => true,
                "message" => "Tạo đơn hàng thành công",
                "orderurl" => $result["orderurl"] ?? null,  // link mở cổng ngân hàng

            ]);
        } else if ($formData["bill_payment_id"] == 4) {

            $endpoint    = "https://test-payment.momo.vn/v2/gateway/api/create";
            $partnerCode = 'MOMOBKUN20180529';
            $accessKey   = 'klm05TvNBzhg7h7j';
            $secretKey   = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

            $orderInfo   = "Thanh toán qua ATM MoMo";
            $amount      = $formData["bill_price_total"];
            $orderId     = time() . "";
            $redirectUrl = "http://localhost:5173/result-momo"; // frontend React
            $ipnUrl      = "http://localhost:8000/api/momo/check-momo"; // backend callback
            $extraData   = "";

            $requestId   = time() . "";
            $requestType = "payWithATM";

            // raw data để tạo chữ ký
            $rawHash = "accessKey=" . $accessKey
                . "&amount=" . $amount
                . "&extraData=" . $extraData
                . "&ipnUrl=" . $ipnUrl
                . "&orderId=" . $orderId
                . "&orderInfo=" . $orderInfo
                . "&partnerCode=" . $partnerCode
                . "&redirectUrl=" . $redirectUrl
                . "&requestId=" . $requestId
                . "&requestType=" . $requestType;

            $signature = hash_hmac("sha256", $rawHash, $secretKey);

            $data = [
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId"     => "MomoTestStore",
                'requestId'   => $requestId,
                'amount'      => $amount,
                'orderId'     => $orderId,
                'orderInfo'   => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl'      => $ipnUrl,
                'lang'        => 'vi',
                'extraData'   => $extraData,
                'requestType' => $requestType,
                'signature'   => $signature
            ];

            // gọi API MoMo bằng Laravel Http
            $result = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post($endpoint, $data);

            $jsonResult = $result->json();

            return response()->json([
                "status"  => true,
                "message" => "Tạo đơn hàng thành công",
                "payUrl"  => $jsonResult['payUrl'] ?? null
            ]);
        }

        return response()->json(["status" => false, "message" => "Phương thức không hợp lệ"]);
    }


    public function checkZalo(Request $request)
    {
        $app_trans_id = $request->input("app_id");
        $getCoupon = $request->input("getCoupon") ?? null;
        $user_id = Cache::get("app_id_user");
        $formData = Cache::get("formData_{$user_id["bill_user_id"]}", now()->addMinutes(60));

        $params = [
            "app_id" => env("ZALO_APP_ID"),
            "app_trans_id" => $app_trans_id
        ];

        // Tạo MAC để ký
        $params["mac"] = hash_hmac(
            "sha256",
            $params["app_id"] . "|" . $params["app_trans_id"] . "|" . env("ZALO_KEY1"),
            env("ZALO_KEY1")
        );

        // Gọi API Query của ZaloPay
        $res = Http::post("https://sb-openapi.zalopay.vn/v2/query", $params);

        // Lấy dữ liệu JSON từ response
        $result = $res->json();

        if ($app_trans_id) {
            // Kiểm tra xem bill đã tồn tại cho giao dịch này chưa
            $bill = Bill::where('apptransid', $app_trans_id)->first();


            // Nếu chưa tồn tại, tạo bill mới
            if ($bill) {
                return response()->json([
                    "status" => true,
                    "bill" => $bill,
                    "message" => "client refresh after payment success",
                ]);
            }

            if ($getCoupon != null) {
                CouponUser::where("coupon_user_id", $getCoupon)->delete();
            }


            $bill = Bill::create([
                "product_id" => $formData["bill_product_id"],
                "user_id" => $formData["bill_user_id"],
                "payment_id" => $formData["bill_payment_id"],
                "bill_price_total" => $formData["bill_price_total"],
                "bill_quantity" => $formData["bill_quantity"],
                "apptransid" => $app_trans_id
            ]);

            $getProductQty = Product::where("product_id", $formData["bill_product_id"])->pluck("product_quantity")->first();

            if ($getProductQty >= $formData["bill_quantity"]) {
                Product::where('product_id', $formData["bill_product_id"])
                    ->update(['product_quantity' => DB::raw('product_quantity - ' .  $formData["bill_quantity"])]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "thất bại",
                    "error" => "số lượng bị lỗi"
                ]);
            }

            Cache::forget('formData');
            return response()->json([
                "status" => true,
                "bill" => $bill,
                "message" => "Thành công"
            ]);
        } else {
            Cache::forget('formData');
            return response()->json([
                "status" => false,
                "message" => "Thất bại",
                "error" => $result['return_message'] ?? 'Không có thông tin lỗi'
            ]);
        }
    }

    public function checkVNpay(Request $request)
    {
        $responseCode = $request->input("responseCode");
        $getCoupon = $request->input("getCoupon") ?? null;
        $transactionStatus  = $request->input("transactionStatus");
        $vnp_TransactionNo  = $request->input("vnp_TransactionNo");

        $user_id = Cache::get("app_id_user");
        $formData = Cache::get("formData_{$user_id["bill_user_id"]}", now()->addMinutes(60));

        if ($transactionStatus == "00" && $responseCode == "00") {

            $productExists = Bill::where('apptransid', $vnp_TransactionNo)->first();

            if ($productExists) {
                return response()->json([
                    "status" => true,
                    "message" => "Thanh toán thành công1",
                    "bill" => $formData
                ]);
            }

            $bill = Bill::create([
                "product_id" => $formData["bill_product_id"],
                "user_id" => $formData["bill_user_id"],
                "payment_id" => $formData["bill_payment_id"],
                "bill_price_total" => $formData["bill_price_total"],
                "bill_quantity" => $formData["bill_quantity"],
                "apptransid" => $vnp_TransactionNo
            ]);


            if ($getCoupon != null) {
                CouponUser::where("coupon_user_id", $getCoupon)->delete();
            }

            $getProductQty = Product::where("product_id", $formData["bill_product_id"])->pluck("product_quantity")->first();

            if ($getProductQty >= $formData["bill_quantity"]) {
                Product::where('product_id', $formData["bill_product_id"])
                    ->update(['product_quantity' => DB::raw('product_quantity - ' .  $formData["bill_quantity"])]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "thất bại",
                    "error" => "số lượng bị lỗi"
                ]);
            }

            Cache::forget('formData');

            return response()->json([
                "status" => true,
                "message" => "Thanh toán thành công2",
                "bill" => $bill
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Thất bại",
                "error" => $result['return_message'] ?? 'Không có thông tin lỗi'
            ]);
        }
    }

    public function checkMomo(Request $request)
    {
        $data = $request->all();
        $transId = $request->input("transId");
        $getCoupon = $request->input("getCoupon") ?? null;
        $user_id = Cache::get("app_id_user");
        $formData = Cache::get("formData_" . $user_id['bill_user_id']);


        if ($transId) {

            $bill = Bill::where('apptransid', $transId)->first();

            // Nếu chưa tồn tại, tạo bill mới
            if ($bill) {
                return response()->json([
                    "status" => true,
                    "bill" => $bill,
                    "message" => "client refresh after payment success",
                ]);
            }


            $bill = Bill::create([
                "product_id" => $formData["bill_product_id"],
                "user_id" => $formData["bill_user_id"],
                "payment_id" => $formData["bill_payment_id"],
                "bill_price_total" => $formData["bill_price_total"],
                "bill_quantity" => $formData["bill_quantity"],
                "apptransid" => $transId
            ]);

            if ($getCoupon != null) {
                CouponUser::where("coupon_user_id", $getCoupon)->delete();
            }

            $getProductQty = Product::where("product_id", $formData["bill_product_id"])->pluck("product_quantity")->first();

            if ($getProductQty >= $formData["bill_quantity"]) {
                Product::where('product_id', $formData["bill_product_id"])
                    ->update(['product_quantity' => DB::raw('product_quantity - ' .  $formData["bill_quantity"])]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "thất bại",
                    "error" => "số lượng bị lỗi"
                ]);
            }

            return response()->json([
                "status" => true,
                "bill" => $bill,
                "message" => "Thành công"
            ]);
        }

        return response()->json(['message' => 'fail'], 400);
    }


    public function sendBill(Request $request)
    {
        $email = Auth::user()->email;
        $billData = $request->input('item'); // lấy đúng cái mảng con

        if (!$email) {
            return response()->json([
                'status' => false,
                'message' => 'Email không tồn tại'
            ], 400);
        }

        // gửi mail
        Mail::to($email)->send(new BillMail($billData));


        return response()->json([
            'status' => true,
            'message' => 'Hóa đơn đã được gửi về email ' . $email
        ]);
    }
}