import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ZaloPayCart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const appTransId = searchParams.get("apptransid");

    if (appTransId) {
      checkPaymentStatus(appTransId);
    } else {
      setLoading(false);
      setMessage("Không tìm thấy thông tin giao dịch");
    }
  }, [searchParams]);

  const checkPaymentStatus = async (appTransId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/zalo/callback-cart",
        { app_id: appTransId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status) {
        setMessage("Thanh toán giỏ hàng thành công!");
        localStorage.removeItem("orderCartData");
      } else {
        setMessage("Thanh toán thất bại: " + (res.data.error || ""));
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra khi kiểm tra thanh toán");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang kiểm tra thanh toán...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <button
          onClick={() => navigate("/fast-foods")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
