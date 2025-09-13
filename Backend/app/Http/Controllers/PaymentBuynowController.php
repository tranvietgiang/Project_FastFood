<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use SebastianBergmann\Type\ObjectType;

class PaymentBuyNowController extends Controller
{
    //

    public function buyNow(Request $request)
    {
        $formData = $request->all();

        // Nếu thanh toán bằng VNPAY
        if ($formData["bill_payment_id"] == 2) {
            $vnp_TmnCode   = "PR7H47SW";
            $vnp_HashSecret = "WGUPUW7FBTFZHEF52ZPMDZ7IMFWT1Z7K";
            $vnp_Url       = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = "http://localhost:5173/vnpay-return"; // ReactJS nhận kết quả

            $vnp_TxnRef    = time();
            $vnp_OrderInfo = "Thanh toán hóa đơn";
            $vnp_OrderType = "billpayment";
            $vnp_Amount = $formData["bill_price_total"] * 100; // Số tiền phải nhân 100 (VNPAY yêu cầu)
            $vnp_Locale = "vn";
            $vnp_BankCode = "NCB"; // Có thể đổi thành ngân hàng khác nếu cần
            $vnp_IpAddr = $formData["bill_user_id"]; // IP khách hàng

            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $request->ip(),
                "vnp_Locale" => "vn",
                "vnp_OrderInfo" => "Thanh toán hóa đơn",
                "vnp_OrderType" => "billpayment",
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef
            ];




            // Tạo chữ ký bảo mật (checksum)
            ksort($inputData);
            $query = "";
            $i = 0;
            $hashdata = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnp_Url = $vnp_Url . "?" . $query;
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); // Tạo mã bảo mật
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

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

            Cache::put("formData_{$formData["bill_user_id"]}", [
                "bill_product_id" =>  $formData["bill_product_id"],
                "bill_user_id" => $formData["bill_user_id"],
                "bill_payment_id" => $formData["bill_payment_id"],
                "bill_price_total" => $formData["bill_price_total"],
                "bill_quantity" => $formData["bill_quantity"],
            ], now()->addMinutes(now()->addMinutes(60)));

            Cache::put(
                "app_id_user",
                [
                    "bill_user_id" =>   $formData["bill_user_id"]
                ],
                now()->addMinutes(now()->addMinutes(60))
            );
            Cache::put("app_id_pay", [
                "apptransid" =>  $order["apptransid"]
            ], now()->addMinutes(now()->addMinutes(60)));


            return response()->json([
                "status" => true,
                "message" => "Tạo đơn hàng thành công",
                "payment" => [
                    "orderurl" => $result["orderurl"] ?? null,  // link mở cổng ngân hàng
                ]
            ]);
        }
    }


    public function checkStatus()
    {
        $user_id = Cache::get("app_id_user");
        $formData = Cache::get("formData_{$user_id["bill_user_id"]}", now()->addMinutes(60));
        $app_trans_id = Cache::get("app_id_pay");

        $params = [
            "app_id" => env("ZALO_APP_ID"),
            "app_trans_id" => $app_trans_id["apptransid"]
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

        if ($formData && $app_trans_id) {
            // Kiểm tra xem bill đã tồn tại cho giao dịch này chưa
            $bill = Bill::where('apptransid', $app_trans_id['apptransid'])->first();

            // Nếu chưa tồn tại, tạo bill mới
            if (!$bill) {
                $bill = Bill::create([
                    "product_id" => $formData["bill_product_id"],
                    "user_id" => $formData["bill_user_id"],
                    "payment_id" => $formData["bill_payment_id"],
                    "bill_price_total" => $formData["bill_price_total"],
                    "bill_quantity" => $formData["bill_quantity"],
                    "apptransid" => $app_trans_id["apptransid"]
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
            }

            Cache::forget('formData');
            return response()->json([
                "status" => true,
                "bill" => $bill,
                "apptransid" => $app_trans_id["apptransid"],
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
}