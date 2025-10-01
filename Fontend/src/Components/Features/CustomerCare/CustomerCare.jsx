import { useState, useEffect, useRef } from "react";
import axios from "axios";
import echo from "../../../Config/echo";

const CustomerCare = () => {
  const [messages, setMessages] = useState([]);
  const [customerCare, setCustomerCare] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = userData.id;

  useEffect(() => {
    console.log(customerCare.fullname);
    axios
      .get("http://localhost:8000/api/get-customer-care", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerCare(res.data);
        localStorage.setItem("setCustomerCare", JSON.stringify(res.data));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMessages();
    setupWebSocket();

    return () => {
      echo.leave("chat");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userData) {
        const filteredMessages = response.data.filter(
          (msg) =>
            (msg.user_id === user_id && msg.receiver_id === 999) ||
            (msg.user_id === 999 && msg.receiver_id === user_id)
        );

        console.log(`💬 Tin nhắn với ${userData.fullname}:`, filteredMessages);
        setMessages(filteredMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const setupWebSocket = () => {
    echo.channel("chat").listen(".message.sent", (e) => {
      console.log("🔔 Nhận tin nhắn mới:", e);
      const newMsg = {
        id: e.message.id,
        message: e.message.message,
        user_id: e.message.user_id,
        receiver_id: e.message.receiver_id,
        fullname: e.user.fullname,
        created_at: e.message.created_at,
      };

      if (
        userData &&
        ((newMsg.user_id === user_id && newMsg.receiver_id === 999) ||
          (newMsg.user_id === 999 && newMsg.receiver_id === user_id))
      ) {
        console.log("✅ Thêm tin nhắn vào cuộc trò chuyện");
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userData) return;

    try {
      console.log(`📤 Gửi tin nhắn cho ${userData.fullname}:`, newMessage);

      const cv = "cv";
      await axios.post(
        "http://localhost:8000/api/messages",
        {
          message: newMessage,
          receiver_id: user_id,
          cv,
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
      console.log(error.response);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div>
                <h2 className="text-xl font-bold text-white">
                  Hỗ trợ khách hàng
                </h2>
                <p className="text-blue-100 text-sm">
                  {userData ? userData.fullname : "Đang tải..."}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-400 w-3 h-3 rounded-full"></span>
              <span className="text-white text-sm font-medium">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg
                className="w-16 h-16 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg">Chưa có tin nhắn nào</p>
            </div>
          ) : (
            messages.map((item) => (
              <div key={item.id} className="mb-4">
                <div
                  className={`flex ${
                    item.user_id === 999 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md ${
                      item.user_id === 999 ? "order-2" : "order-1"
                    }`}
                  >
                    <div className="flex items-end space-x-2">
                      {item.user_id !== 999 && (
                        <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm font-medium">
                            {userData.fullname?.charAt(0) || "K"}
                          </span>
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            item.user_id === 999
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1 opacity-90">
                            {item.user_id === 999
                              ? "Bạn (Nhân viên CSKH)"
                              : userData.fullname}
                          </div>
                          <div className="text-sm leading-relaxed">
                            {item.message}
                          </div>
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 px-2 ${
                            item.user_id === 999 ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(item.created_at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      {item.user_id === 999 && (
                        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
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
        {userData && (
          <div className="bg-white border-t border-gray-200 p-4 ">
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
                    placeholder="Nhập tin nhắn hỗ trợ khách hàng..."
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-sm"
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
        )}
      </div>
    </div>
  );
};

export default CustomerCare;
