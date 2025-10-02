// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import echo from "../../Config/echo";

// axios.defaults.withCredentials = true;

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     loadMessages();
//     setupWebSocket();

//     return () => {
//       echo.leaveChannel("chat");
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const loadMessages = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/messages", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setMessages(response.data);
//     } catch (error) {
//       console.error("Error loading messages:", error);
//     }
//   };

//   const setupWebSocket = () => {
//     const channel = echo.channel("chat");

//     channel.listen(".message.sent", (e) => {
//       const newMsg = {
//         id: e.message.id,
//         message: e.message.message,
//         fullname: e.message.user.fullname,
//         user_id: e.message.user_id,
//         created_at: e.message.created_at,
//       };

//       setMessages((prev) => [...prev, newMsg]);
//     });
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       await axios.post(
//         "http://localhost:8000/api/messages",
//         {
//           content: newMessage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8">
//       <div className="bg-white rounded-lg shadow-lg">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Chat Room</h2>
//         </div>

//         <div className="h-64 overflow-y-auto p-4">
//           {messages.map((message) => (
//             <div key={message.id} className="mb-2">
//               <div className="flex justify-between">
//                 <strong>{message.fullname}:</strong>
//                 <span className="text-xs text-gray-500">
//                   {new Date(message.created_at).toLocaleTimeString()}
//                 </span>
//               </div>
//               <div>{message.message}</div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <form onSubmit={sendMessage} className="p-4 border-t">
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//             >
//               Send
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Chat;
