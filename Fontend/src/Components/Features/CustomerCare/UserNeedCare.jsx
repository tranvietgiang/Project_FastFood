import { useState, useEffect, useRef } from "react";
import axios from "axios";
import echo from "../../../Config/echo";

const UserNeedCare = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;
  const CUSTOMER_CARE = 999;
  const setCustomerCare = JSON.parse(localStorage.getItem("setCustomerCare"));

  useEffect(() => {
    loadMessages();
    setupWebSocket();
    return () => echo.leave("chat");
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredMessages = response.data.filter(
        (msg) =>
          (msg.user_id === user_id && msg.receiver_id === CUSTOMER_CARE) ||
          (msg.user_id === CUSTOMER_CARE && msg.receiver_id === user_id)
      );

      setMessages(filteredMessages);
    } catch (error) {
      console.error("❌ Lỗi load tin nhắn:", error);
    }
  };

  const setupWebSocket = () => {
    echo.channel("chat").listen(".message.sent", (e) => {
      const newMsg = {
        id: e.message.id,
        message: e.message.message,
        user_id: e.message.user_id,
        receiver_id: e.message.receiver_id,
        fullname: e.user.fullname,
        created_at: e.message.created_at,
      };

      if (
        (newMsg.user_id === user_id && newMsg.receiver_id === CUSTOMER_CARE) ||
        (newMsg.user_id === CUSTOMER_CARE && newMsg.receiver_id === user_id)
      ) {
        console.log("✅ Thêm tin nhắn real-time");
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        "http://localhost:8000/api/messages",
        {
          message: newMessage,
          receiver_id: CUSTOMER_CARE,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNewMessage("");
    } catch (error) {
      console.error("❌ Lỗi gửi tin nhắn:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Trung tâm hỗ trợ
                </h2>
                <p className="text-green-100 text-sm flex items-center">
                  <span className="bg-green-300 w-2 h-2 rounded-full mr-2"></span>
                  {setCustomerCare?.fullname}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-lg flex items-center justify-center">
                <h2>Xin chào, {user?.fullname}</h2>
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-green-100 rounded-full p-6 mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                Bắt đầu cuộc trò chuyện
              </p>
              <p className="text-gray-400 text-sm">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div
                  className={`flex ${
                    message.user_id === user_id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md ${
                      message.user_id === user_id ? "order-2" : "order-1"
                    }`}
                  >
                    <div className="flex items-end space-x-2">
                      {message.user_id !== user_id && (
                        <div className="bg-green-500 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 shadow-md">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.user_id === user_id
                              ? "bg-green-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1 opacity-80">
                            {message.user_id === user_id
                              ? "Bạn"
                              : `${setCustomerCare?.fullname || "Hỗ trợ viên"}`}
                          </div>
                          <div className="text-sm leading-relaxed">
                            {message.message}
                          </div>
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 px-2 ${
                            message.user_id === user_id
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      {message.user_id === user_id && (
                        <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-700 text-sm font-semibold">
                            {user?.fullname?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage}>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder="Nhập câu hỏi hoặc thắc mắc của bạn..."
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Chúng tôi sẽ phản hồi trong vài phút
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>Gửi</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help Tips */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-semibold text-sm mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Mẹo hữu ích
        </h3>
        <ul className="text-xs text-green-700 space-y-1">
          <li>
            • Mô tả vấn đề của bạn một cách chi tiết để nhận được hỗ trợ nhanh
            nhất
          </li>
          <li>• Bạn có thể gửi nhiều tin nhắn liên tiếp nếu cần</li>
          <li>• Thời gian phản hồi trung bình: 2-5 phút</li>
        </ul>
      </div>
    </div>
  );
};

export default UserNeedCare;
