import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errorField, setErrorField] = useState("");
  const [errorsEmail, setErrorsEmail] = useState("");
  const [errorsPhone, setErrorsPhone] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorsPhone("");
    setErrorsEmail("");
    setLoading(true);

    if (Object.values(formData).some((v) => v.trim() === "")) {
      setErrorField("Vui lòng điền đầy đủ thông tin của bạn!");
      setLoading(false);
      return;
    }

    if (hasSpecialChar(formData.fullname)) {
      setLoading(false);
      setErrorField("Tên không được chứa ký tự đặc biệt, vd: giang");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setLoading(false);
      setErrorField("Vui lòng nhập đúng số điện thoại! vd:0336844862");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setLoading(false);
      setErrorField(
        "Vui lòng nhập email đúng yêu cầu! vd:tranvetgiang@gmail.com"
      );
    }

    if (!isValidPassword(formData.password)) {
      setLoading(false);
      setErrorField(
        "Password không đúng yêu cầu:\n- Ít nhất 1 số\n- Ít nhất 1 chữ hoa\n- Ít nhất 1 chữ thường\n- Ít nhất 1 ký tự đặc biệt\n- Độ dài 8-72 ký tự"
      );

      return;
    }

    setErrorField("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );

      setFormData({ fullname: "", phone: "", email: "", password: "" });
      if (res.data.check_otp) {
        setLoading(false);
        navigate("/auth/otp", { state: { email: res.data.email } });
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 424) {
        setErrorsEmail(error.response.data.email);
      }
      if (error.response && error.response.status === 423) {
        setErrorsPhone(error.response.data.phone);
      }
    }
  };

  const hasSpecialChar = (str) => /[^a-zA-ZÀ-ỹ\s]/.test(str);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phone) => {
    return validator.isMobilePhone(phone, "vi-VN");
  };
  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,72}$/;
    return regex.test(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-600 text-sm">
            Bạn đã có tài khoản ?
            <Link
              to="/auth/login"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Thông tin cá nhân
          </h2>

          {errorField && (
            <p className="whitespace-pre-line text-red-500 bg-red-500/20 rounded-md p-5 text-center mb-3 lg:max-w-[385px] ">
              {errorField}
            </p>
          )}
          {loading && (
            <div className="flex justify-center items-center fixed inset-0 bg-black opacity-50">
              <ClipLoader size={30} color="#36d7b7" loading={loading} />
            </div>
          )}
          <form onSubmit={handleSubmit} method="post">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên *
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                className={`${
                  formData.fullname.length === 0
                    ? "bg-white"
                    : hasSpecialChar(formData.fullname)
                      ? "bg-red-400"
                      : "bg-[rgb(232,240,254)]"
                } w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Tên"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`${
                  formData.email.length === 0
                    ? "bg-white"
                    : !isValidEmail(formData.email)
                      ? "bg-red-400"
                      : "bg-[rgb(232,240,254)]"
                } w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errorsEmail ? <p className="text-red-600">{errorsEmail}</p> : ""}
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Số điện thoại *
              </label>
              <input
                id="phone"
                name="phone"
                type="phone"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className={`${
                  formData.phone.length === 0
                    ? "bg-white"
                    : !validatePhoneNumber(formData.phone)
                      ? "bg-red-400"
                      : "bg-[rgb(232,240,254)]"
                } w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errorsPhone ? <p className="text-red-600">{errorsPhone}</p> : ""}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className={`${
                  formData.password.length === 0
                    ? "bg-white"
                    : !isValidPassword(formData.password)
                      ? "bg-red-400"
                      : "bg-[rgb(232,240,254)]"
                } w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
