<?php

namespace App\Http\Controllers;

use App\Mail\OTPMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    //
    public function login(Request $req)
    {
        $check = $req->all();

        if (!$check) {
            return response()->json(["message" => "Đăng nhập đã bị lỗi, reset lại(f5)"], 400);
        }

        if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $check["email"])) {
            return response()->json(["message" => "Email không đúng định dạng"], 400);
        }

        if (!User::where("email", $check["email"])->exists()) {
            return response()->json(["message" => "Email chưa đăng ký tài khoản"], 400);
        }


        $user = User::where('email', $check['email'])->first();

        if (!$user || !Hash::check($check["password"], $user->password)) {
            return response()->json(['message' => 'Tài khoản or password không đúng'], 400);
        }

        // Tạo token (sanctum / personal token)
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function register(Request $req)
    {
        $user = $req->all();

        if (!preg_match('/^[a-zA-ZÀ-ỹ\s]+$/u', $user["fullname"])) {
            return;
        }


        if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $user["email"])) {
            return;
        }

        if (User::where("email", $user["email"])->exists()) {
            return response()->json([
                "email" => "email đã được sử dụng"
            ], 424);
        }


        if (!preg_match('/^0[35789][0-9]{8}$/', $user["phone"])) {
            return;
        }

        if (User::where("phone", $user["phone"])->exists()) {
            return response()->json([
                "phone" => "Số điện thoại đã tồn tại"
            ], 423);
        }

        if (!preg_match('/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,72}$/', $user["password"])) {
            return;
        }


        Cache::put('user_account_otp', [
            'fullname' => $user["fullname"],
            'email' => $user["email"],
            'phone' => $user["phone"],
            'password' => Hash::make($user["password"])
        ]);



        // Tạo OTP
        $otp = rand(100000, 999999);

        Cache::put('otp_' . $user["email"], [
            'otp' => $otp,
            'expires_at' => now()->addMinutes(3)
        ], now()->addMinutes(5));


        try {
            Mail::to($user["email"])->send(new OTPMail($otp, $user["email"]));
        } catch (\Exception $e) {
            return back()->with('email_send_error', 'Gửi OTP thất bại. Vui lòng thử lại sau.');
        }


        return response()->json([
            'check_otp' => true,
            "email" => $user["email"]
        ], 200);
    }


    public function verifyOtp(Request $request)
    {
        $check = $request->all();

        $data = Cache::get('otp_' . $check["email"]);

        if (!$check) {
            return response()->json(['message' => 'OTP đã bị lỗi'], 400);
        }

        if (!$data) {
            return response()->json(['message' => 'OTP không tồn tại hoặc đã hết hạn'], 400);
        }

        if (now()->greaterThan($data['expires_at'])) {
            return response()->json(['message' => 'OTP đã hết hạn'], 400);
        }

        if ($check["otp"] != $data['otp']) {
            return response()->json(['message' => 'OTP không chính xác'], 400);
        }

        $userData = Cache::get('user_account_otp');

        User::create([
            'fullname' => $userData['fullname'],
            'phone' => $userData['phone'],
            'email' => $userData['email'],
            'password' => $userData['password'],
        ]);

        // Xóa OTP sau khi dùng
        Cache::forget('otp');
        Cache::forget('user_account_otp');

        return response()->json([
            'message' => 'Đăng ký thành công!',
        ], 200);
    }
}