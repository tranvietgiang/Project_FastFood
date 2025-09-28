<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $messageUser = Message::select("users.*", "messages.*")
            ->join("users", "messages.user_id", "=", "users.id")
            ->orderBy("messages.created_at", "asc")
            ->get();

        return response()->json($messageUser);
    }

    public function store(Request $request)
    {
        $message = Message::create([
            'message' => $request->content,
            'user_id' => Auth::id(),
            'receiver_id' => 1
        ]);

        $message->load('user');
        broadcast(new MessageSent($message, $message->user))->toOthers();
        return response()->json($message);
    }
}