import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
export default function BillResultBuyNow({ item, loading, status }) {
  const token = localStorage.getItem("token");
  const handleSendEmail = () => {
    axios
      .post(
        "http://localhost:8000/api/send-bill",
        { item },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ) // gửi dữ liệu bill
      .then((res) => {
        alert(res.data.message);
      })
      .catch((e) => {
        console.log("error", e);
        alert("Gửi email thất bại!");
      });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
            Kết quả thanh toán
          </h1>

          {loading ? (
            <div className="flex justify-center items-center fixed inset-0 bg-black opacity-50">
              <ClipLoader size={30} color="#36d7b7" loading={loading} />
            </div>
          ) : status ? (
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-green-600 text-center">
                Thanh toán thành công ✅
              </h2>

              <div className="flex justify-between">
                <span>Số lượng:</span>
                <span>{item.bill_quantity ?? 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Tổng tiền:</span>
                <span className="font-semibold text-red-500">
                  {Number(item.bill_price_total).toLocaleString()} đ
                </span>
              </div>

              <div className="flex justify-between">
                <span>Phương thức thanh toán:</span>
                <span>
                  {(item.bill_payment_id ?? item.payment_id === 2)
                    ? "VN-PAY"
                    : (item.bill_payment_id ?? item.payment_id === 3)
                      ? "ZALO-PAY"
                      : (item.bill_payment_id ?? item.payment_id === 4)
                        ? "MoMo"
                        : "COD"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Xuất bills về email:</span>
                <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  <MdOutlineMail onClick={handleSendEmail} size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">Thanh toán thất bại</div>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/fast-foods"
              className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
