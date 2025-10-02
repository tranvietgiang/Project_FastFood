import Echo from "laravel-echo";
import Pusher from "pusher-js";
const echo = new Echo({
  broadcaster: "reverb",
  key: "reverb_key", // Phải khớp với REVERB_APP_KEY trong .env
  wsHost: "localhost",
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false, // Phải là false nếu dùng http
  enabledTransports: ["ws", "wss"],
});
export default echo;
