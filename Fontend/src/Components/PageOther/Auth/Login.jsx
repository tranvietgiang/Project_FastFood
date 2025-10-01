import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user");
      return;
    }
  }, []);

  useEffect(() => {
    const message = location.state?.message ?? "";
    if (message) {
      setFlashMessage(message);
      const timer = setTimeout(() => {
        setFlashMessage("");
      }, 5000);

      navigate(location.pathname, { replace: true });
      return () => clearTimeout(timer);
    }
  }, [location.state?.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    if (email === "" || password === "") {
      setError("Vui lòng nhập đầy đủ");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setLoading(false);
      navigate("/fast-foods");
    } catch (error) {
      console.log("Error", error);
      if (error.response.status === 400) {
        setError(error.response.data.message);
        setLoading(false);
      }
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const EnterLogin = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFacebookLogin = () => {
    console.log("Đăng nhập bằng Facebook");
  };

  const handleGoogleLogin = () => {
    console.log("Đăng nhập bằng Google");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng nhập tài khoản
          </h1>
          <p className="text-gray-600 text-sm">
            Bạn chưa có tài khoản ?
            <Link
              to="/auth/register"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Đăng ký tại đây
            </Link>
          </p>
        </div>

        {message && (
          <p className="whitespace-pre-line text-black bg-green-500/20 rounded-md p-5 text-center mb-3 lg:max-w-[385px] ">
            {message}
          </p>
        )}

        {error && (
          <p className="whitespace-pre-line text-red-500 bg-red-500/20 rounded-md p-5 text-center mb-3 lg:max-w-[385px] ">
            {error}
          </p>
        )}

        {loading && (
          <div className="flex justify-center items-center fixed inset-0 bg-black opacity-50">
            <ClipLoader size={30} color="#36d7b7" loading={loading} />
          </div>
        )}

        <form onSubmit={handleSubmit} method="post">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Quên mật khẩu?
              <a
                href="#"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Nhấn vào đây
              </a>
            </p>
          </div>

          <button
            onKeyDown={EnterLogin}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-8">
          <p className="text-center text-orange-500 font-medium mb-4">
            Hoặc đăng nhập bằng
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleFacebookLogin}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
