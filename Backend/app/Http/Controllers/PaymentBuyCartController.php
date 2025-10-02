<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\CouponUser;
use App\Models\OrderCart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class PaymentBuyCartController extends Controller
{
    public function buyCart(Request $request)
    {
        $formData = $request->all();

        // Validate dữ liệu
        if (!Auth::id()) {
            return response()->json(["message_cart" => "Chưa đăng nhập"], 401);
        }

        if (!isset($formData['cart_ids']) || empty($formData['cart_ids'])) {
            return response()->json(["message_cart" => "Giỏ hàng trống"], 402);
        }

        // Lưu cache cho cart
        Cache::put(
            "app_id_user_cart",
            ["bill_user_id" => $formData["bill_user_id"]],
            now()->addMinutes(60)
        );

        Cache::put("formData_cart_{$formData["bill_user_id"]}", [
            "cart_ids" => $formData["cart_ids"],
            "bill_user_id" => $formData["bill_user_id"],
            "bill_payment_id" => $formData["bill_payment_id"],
            "bill_price_total" => $formData["bill_price_total"],
            "coupon_id" => $formData["coupon_id"] ?? null,
        ], now()->addMinutes(60));

        // Xử lý thanh toán (giống như buyNow)
        if ($formData["bill_payment_id"] == 2) {
            return $this->processVNPay($formData, $request);
        } else if ($formData["bill_payment_id"] == 3) {
            return $this->processZaloPay($formData);
        } else if ($formData["bill_payment_id"] == 4) {
            return $this->processMomo($formData);
        }

        return response()->json(["status" => false, "message" => "Phương thức không hợp lệ"]);
    }

    private function processVNPay($formData, $request)
    {
        $vnp_TmnCode   = "ZFVN0GBW";
        $vnp_HashSecret = "XKPWP1CDDREYDSTWKYD2CRQD35DBWT3K";
        $vnp_Url       = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:5173/result-vnPay-cart";

        $vnp_TxnRef    = uniqid();
        $vnp_OrderInfo = "Thanh toán giỏ hàng";
        $vnp_OrderType = "billpayment";
        $vnp_Amount    = $formData["bill_price_total"] * 100;
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
    }

    private function processZaloPay($formData)
    {
        $config = [
            "appid"    => 553,
            "key1"     => "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
            "key2"     => "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
            "endpoint" => "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        ];

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
                "cart_ids"         => $formData["cart_ids"],
                "redirecturl"      => "http://localhost:5173/result-zaloPay-cart"
            ]),
            "description" => "Thanh toán giỏ hàng",
            "callbackurl" => "http://127.0.0.1:8000/api/zalo/callback-cart"
        ];

        $data = $order["appid"] . "|" . $order["apptransid"] . "|" . $order["appuser"] . "|" .
            $order["amount"] . "|" . $order["apptime"] . "|" . $order["embeddata"] . "|" . $order["item"];

        $order["mac"] = hash_hmac("sha256", $data, $config["key1"]);

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
            "orderurl" => $result["orderurl"] ?? null,
        ]);
    }

    private function processMomo($formData)
    {
        $endpoint    = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey   = 'klm05TvNBzhg7h7j';
        $secretKey   = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

        $orderInfo   = "Thanh toán giỏ hàng MoMo";
        $amount      = $formData["bill_price_total"];
        $orderId     = time() . "";
        $redirectUrl = "http://localhost:5173/result-momo-cart";
        $ipnUrl      = "http://localhost:8000/api/momo/check-momo-cart";
        $extraData   = "";

        $requestId   = time() . "";
        $requestType = "payWithATM";

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

    public function checkZaloCart(Request $request)
    {
        $app_trans_id = $request->input("app_id");
        $user_id = Cache::get("app_id_user_cart");
        $formData = Cache::get("formData_cart_{$user_id["bill_user_id"]}");

        $params = [
            "app_id" => env("ZALO_APP_ID"),
            "app_trans_id" => $app_trans_id
        ];

        $params["mac"] = hash_hmac(
            "sha256",
            $params["app_id"] . "|" . $params["app_trans_id"] . "|" . env("ZALO_KEY1"),
            env("ZALO_KEY1")
        );

        $res = Http::post("https://sb-openapi.zalopay.vn/v2/query", $params);
        $result = $res->json();

        if ($app_trans_id) {
            $bill = Bill::where('apptransid', $app_trans_id)->first();

            if ($bill) {
                return response()->json([
                    "status" => true,
                    "bill" => $bill,
                    "message" => "client refresh after payment success",
                ]);
            }

            // Xóa coupon nếu có
            if ($formData["coupon_id"] != null) {
                CouponUser::where("coupon_user_id", $formData["coupon_id"])->delete();
            }

            // Tạo bill và xử lý cart items - BỎ WITH
            DB::transaction(function () use ($formData, $app_trans_id) {
                foreach ($formData["cart_ids"] as $cart_id) {
                    $cartItem = OrderCart::find($cart_id); // Bỏ with('product')

                    if ($cartItem) {
                        // Lấy thông tin product riêng
                        $product = Product::where('product_id', $cartItem->product_id)->first();

                        if ($product) {
                            // Tạo bill cho từng sản phẩm
                            Bill::create([
                                "product_id" => $cartItem->product_id,
                                "user_id" => $formData["bill_user_id"],
                                "payment_id" => $formData["bill_payment_id"],
                                "bill_price_total" => $cartItem->current_price * $cartItem->cart_quantity,
                                "bill_quantity" => $cartItem->cart_quantity,
                                "apptransid" => $app_trans_id
                            ]);

                            // Cập nhật số lượng sản phẩm
                            if ($product->product_quantity >= $cartItem->cart_quantity) {
                                Product::where('product_id', $cartItem->product_id)
                                    ->update(['product_quantity' => DB::raw('product_quantity - ' . $cartItem->cart_quantity)]);
                            }

                            // Xóa item khỏi giỏ hàng
                            $cartItem->delete();
                        }
                    }
                }
            });

            Cache::forget("formData_cart_{$user_id["bill_user_id"]}");

            return response()->json([
                "status" => true,
                "message" => "Thanh toán giỏ hàng thành công"
            ]);
        }

        Cache::forget("formData_cart_{$user_id["bill_user_id"]}");
        return response()->json([
            "status" => false,
            "message" => "Thất bại",
            "error" => $result['return_message'] ?? 'Không có thông tin lỗi'
        ]);
    }

    public function checkVnPayCart(Request $request)
    {
        $responseCode = $request->input("responseCode");
        $transactionStatus  = $request->input("transactionStatus");
        $vnp_TransactionNo  = $request->input("vnp_TransactionNo");

        $user_id = Cache::get("app_id_user_cart");
        $formData = Cache::get("formData_cart_{$user_id["bill_user_id"]}");

        if ($transactionStatus == "00" && $responseCode == "00") {
            $bill = Bill::where('apptransid', $vnp_TransactionNo)->first();

            if ($bill) {
                return response()->json([
                    "status" => true,
                    "message" => "Thanh toán thành công",
                    "bill" => $formData
                ]);
            }

            // Xử lý cart items - BỎ WITH
            DB::transaction(function () use ($formData, $vnp_TransactionNo) {
                foreach ($formData["cart_ids"] as $cart_id) {
                    $cartItem = OrderCart::find($cart_id); // Bỏ with('product')

                    if ($cartItem) {
                        // Lấy thông tin product riêng
                        $product = Product::where('product_id', $cartItem->product_id)->first();

                        if ($product) {
                            Bill::create([
                                "product_id" => $cartItem->product_id,
                                "user_id" => $formData["bill_user_id"],
                                "payment_id" => $formData["bill_payment_id"],
                                "bill_price_total" => $cartItem->current_price * $cartItem->cart_quantity,
                                "bill_quantity" => $cartItem->cart_quantity,
                                "apptransid" => $vnp_TransactionNo
                            ]);

                            if ($product->product_quantity >= $cartItem->cart_quantity) {
                                Product::where('product_id', $cartItem->product_id)
                                    ->update(['product_quantity' => DB::raw('product_quantity - ' . $cartItem->cart_quantity)]);
                            }

                            $cartItem->delete();
                        }
                    }
                }
            });

            // Xóa coupon nếu có
            if ($formData["coupon_id"] != null) {
                CouponUser::where("coupon_user_id", $formData["coupon_id"])->delete();
            }

            Cache::forget("formData_cart_{$user_id["bill_user_id"]}");

            return response()->json([
                "status" => true,
                "message" => "Thanh toán giỏ hàng thành công"
            ]);
        }

        return response()->json([
            "status" => false,
            "message" => "Thất bại"
        ]);
    }

    public function checkMomoCart(Request $request)
    {
        $transId = $request->input("transId");
        $user_id = Cache::get("app_id_user_cart");
        $formData = Cache::get("formData_cart_{$user_id["bill_user_id"]}");

        if ($transId) {
            $bill = Bill::where('apptransid', $transId)->first();

            if ($bill) {
                return response()->json([
                    "status" => true,
                    "bill" => $bill,
                    "message" => "client refresh after payment success",
                ]);
            }

            DB::transaction(function () use ($formData, $transId) {
                foreach ($formData["cart_ids"] as $cart_id) {
                    $cartItem = OrderCart::find($cart_id); // Bỏ with('product')

                    if ($cartItem) {
                        // Lấy thông tin product riêng
                        $product = Product::where('product_id', $cartItem->product_id)->first();

                        if ($product) {
                            Bill::create([
                                "product_id" => $cartItem->product_id,
                                "user_id" => $formData["bill_user_id"],
                                "payment_id" => $formData["bill_payment_id"],
                                "bill_price_total" => $cartItem->current_price * $cartItem->cart_quantity,
                                "bill_quantity" => $cartItem->cart_quantity,
                                "apptransid" => $transId
                            ]);

                            if ($product->product_quantity >= $cartItem->cart_quantity) {
                                Product::where('product_id', $cartItem->product_id)
                                    ->update(['product_quantity' => DB::raw('product_quantity - ' . $cartItem->cart_quantity)]);
                            }

                            $cartItem->delete();
                        }
                    }
                }
            });

            if ($formData["coupon_id"] != null) {
                CouponUser::where("coupon_user_id", $formData["coupon_id"])->delete();
            }

            return response()->json([
                "status" => true,
                "message" => "Thanh toán giỏ hàng thành công"
            ]);
        }

        return response()->json(['message' => 'fail'], 400);
    }
}
