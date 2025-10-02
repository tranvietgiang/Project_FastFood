<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use App\Models\CustomerCare;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function index()
    {
        try {
            $currentUserId = Auth::id();

            $messages = Message::with('user')
                ->where(function ($query) use ($currentUserId) {
                    $query->where('user_id', $currentUserId)
                        ->orWhere('receiver_id', $currentUserId);
                })
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'message' => $message->message,
                        'user_id' => $message->user_id,
                        'receiver_id' => $message->receiver_id,
                        'fullname' => $message->user->fullname,
                        'created_at' => $message->created_at,
                    ];
                });

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error loading messages: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'receiver_id' => 'required|integer',
                'cv' => 'sometimes|string' // Giữ lại cv để phân biệt
            ]);

            // XỬ LÝ LOGIC 2 CHIỀU
            if (isset($validated['cv']) && $validated['cv'] === 'cv') {
                // Customer Care gửi tin nhắn: user_id = 999, receiver_id = user_id
                $user_id = 999;
                $receiver_id = $validated['receiver_id'];
            } else {
                // User gửi tin nhắn: user_id = Auth::id(), receiver_id = customer_care_id
                $user_id = Auth::id();
                $receiver_id = $validated['receiver_id'];
            }

            $message = Message::create([
                'message' => $validated['message'],
                'user_id' => $user_id,
                'receiver_id' => $receiver_id,
            ]);

            $message->load('user');
            broadcast(new MessageSent($message, $message->user))->toOthers();

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getCustomerCare()
    {
        $customer_care = CustomerCare::first();
        if ($customer_care) {

            return response()->json($customer_care);
        }
        return response()->json([], 404);
    }
}