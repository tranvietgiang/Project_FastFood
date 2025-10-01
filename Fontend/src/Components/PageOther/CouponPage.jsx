import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import HandleMessage from "../Features/Handle/HandleMessage";
import { RiErrorWarningLine } from "react-icons/ri";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function CouponPage() {
  const [getCouponList, setProduct] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageHeart, setMessageHeart] = useState("");
  const [openMessageHeart, setOpenMessageHeart] = useState(false);
  const [severity, setSeverity] = useState("error");

  const users = JSON.parse(localStorage.getItem("user")) ?? null;
  const token = localStorage.getItem("token");
  const user_id = users?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user_id) {
      navigate("/auth/login");
      return;
    }

    const cache_heart = JSON.parse(localStorage.getItem("list_coupon"));
    if (cache_heart) setProduct(cache_heart);

    const fetchGetHeartList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get-list-coupon/${user_id}`
        );
        setProduct(res.data.data ?? []);
        localStorage.setItem("list_coupon", JSON.stringify(res.data.data));
      } catch (e) {
        setProduct([]);
        if (e.response?.status === 421) {
          navigate("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGetHeartList();
  }, [token, user_id, navigate]);

  const handleDelete = async (coupon_user_id) => {
    if (!token || !user_id || !coupon_user_id) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/delete/coupon`,
        { coupon_user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProduct(res.data.original.data ?? []);
      localStorage.setItem(
        "list_coupon",
        JSON.stringify(res.data.original.data ?? [])
      );

      setOpenMessageHeart(true);
      setMessageHeart("Mã giảm giá đã được xóa");
      setSeverity("success");
    } catch (error) {
      setOpenMessageHeart(true);
      setSeverity("error");
      if ([409, 410, 422].includes(error.response?.status)) {
        setMessageHeart(error.response.data.message_delete);
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đến item tiếp theo
  const nextItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === getCouponList.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Hàm chuyển đến item trước đó
  const prevItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? getCouponList.length - 1 : prevIndex - 1
    );
  };

  // Lấy item hiện tại để hiển thị trên mobile
  const currentItem = getCouponList[currentIndex];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
          <ClipLoader size={30} color="#36d7b7" loading={loading} />
        </div>
      ) : getCouponList?.length ? (
        <>
          {/* Desktop view - hiển thị grid */}
          <ul className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {getCouponList.map((e) => {
              const expiredDate = new Date(e.updated_at);
              const dayPresent = new Date();
              const displayDate = expiredDate.toISOString().split("T")[0];
              const isValid = expiredDate >= dayPresent;

              return (
                <li
                  key={e.coupon_user_id}
                  className="relative bg-red-100 rounded-lg shadow-md p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-red-200 px-2 py-1 rounded font-bold text-gray-800">
                      RTL{e.coupon_user_id}
                    </span>
                    <span className="text-xs text-gray-600">{displayDate}</span>
                  </div>

                  <p className="text-sm text-gray-800 font-medium">
                    {e.coupon_user_name ?? ""}
                  </p>

                  <p className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-2">
                    <RiErrorWarningLine /> Điều kiện
                  </p>

                  <p className="mt-2 text-sm font-semibold text-green-700">
                    {isValid ? "Còn hợp lệ" : "Hết hạn"}
                  </p>

                  <div
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                    role="button"
                    onClick={() => handleDelete(e.coupon_user_id)}
                  >
                    <DeleteIcon />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Mobile view - hiển thị carousel */}
          <div className="sm:hidden">
            {currentItem && (
              <div className="relative bg-red-100 rounded-lg shadow-md p-4 flex flex-col justify-between mx-auto max-w-[300px]">
                {/* Navigation arrows */}
                {getCouponList.length > 1 && (
                  <>
                    <button
                      onClick={prevItem}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={nextItem}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-200 px-2 py-1 rounded font-bold text-gray-800">
                    RTL{currentItem.coupon_user_id}
                  </span>
                  <span className="text-xs text-gray-600">
                    {
                      new Date(currentItem.updated_at)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                </div>

                <p className="text-sm text-gray-800 font-medium">
                  {currentItem.coupon_user_name ?? ""}
                </p>

                <p className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-2">
                  <RiErrorWarningLine /> Điều kiện
                </p>

                <p className="mt-2 text-sm font-semibold text-green-700">
                  {new Date(currentItem.updated_at) >= new Date()
                    ? "Còn hợp lệ"
                    : "Hết hạn"}
                </p>

                <div
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  onClick={() => handleDelete(currentItem.coupon_user_id)}
                >
                  <DeleteIcon />
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {getCouponList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full ${
                        currentIndex === i ? "bg-red-500" : "bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Không có mã giảm giá nào
        </p>
      )}

      <HandleMessage
        message={messageHeart}
        open={openMessageHeart}
        severity={severity}
        onClose={() => setOpenMessageHeart(false)}
      />
    </section>
  );
}
