<?php

namespace App\Http\Controllers;

use App\Models\OrderCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeatureUpdateController extends Controller
{
    //
    public function updateCarts(Request $request)
    {
        $productId = $request->input('product_id');
        $cartId = $request->input('cart_id');
        $newQuantity = $request->input('quantity');

        if (!Auth::id()) {
            return response()->json([
                "message_cart" => "Chưa đăng nhập"
            ]);
        }

        if (!$productId || !$cartId || !$newQuantity) {
            return response()->json([
                "message_cart" => "Dữ liệu bị lỗi"
            ]);
        }

        $check = OrderCart::where("user_id", Auth::id())
            ->where("product_id", $productId)
            ->where("cart_id", $cartId)
            ->first();

        if (!$check) {
            return response()->json([
                "message_cart" => "Sản phẩm không tồn tại trong giỏ hàng"
            ]);
        }

        // Cập nhật số lượng
        $check->cart_quantity = $newQuantity;

        $check->save();

        return response()->json([
            "success" => "Cập nhật thành công",
            "cart_item" => $check
        ]);
    }
}