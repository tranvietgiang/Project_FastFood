import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [getCoupon, setCoupon] = useState([]);
  const [getCouponCount, setCouponCount] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      navigate("/auth/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/get-coupon-user")
      .then((res) => {
        setCoupon(res.data);
        console.log(res.data.count);
        setCouponCount(res.data.count);
      })
      .catch((e) => {
        console.log(e);
        setCoupon([]);
        setCouponCount(0);
      });

    if (user) {
      setData(JSON.parse(user));
    }
  }, [navigate]);

  console.log(getCoupon);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5 flex bg-[#d3d0c8] min-h-[400px] rounded-lg md:mt-[50px] md:mb-[100px]">
      {/* Sidebar */}
      <aside className="w-[250px] border-r pr-5">
        <h2 className="font-bold text-lg mb-2">Trang tài khoản</h2>
        <p className="mb-5">
          Xin chào, <span className="font-semibold">{data.fullname}</span>!
        </p>
        <ul className="space-y-2">
          <li className="text-orange-600 font-semibold cursor-pointer">
            Thông tin tài khoản
          </li>
          <li className="cursor-pointer hover:text-orange-500">
            Đơn hàng của bạn
          </li>
          <li className="cursor-pointer hover:text-orange-500">Đổi mật khẩu</li>
          <li className="cursor-pointer hover:text-orange-500">
            Sổ địa chỉ (0)
          </li>
          <li className="cursor-pointer hover:text-orange-500">
            Mã giảm giá ({getCouponCount ?? 0})
          </li>
          <li
            onClick={handleLogout}
            className="text-red-600 cursor-pointer hover:underline"
          >
            Đăng xuất
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-5">
        <h1 className="text-2xl font-bold mb-5">Thông tin tài khoản</h1>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Họ tên:</span> {data.fullname}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {data.email}
          </p>
        </div>
      </main>
    </div>
  );
}
