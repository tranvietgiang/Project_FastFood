import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import HandleMessage from "../Features/Handle/HandleMessage";

export default function HeartPage() {
  const [getProduct, setProduct] = useState([]);
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

    const cache_heart = JSON.parse(localStorage.getItem("list_heart"));
    if (cache_heart) {
      setProduct(cache_heart);
    }

    setLoading(true);
    const FetchGetHeartList = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get-list-heart/${user_id}`
        );
        setLoading(false);
        setProduct(res.data.data ?? []);
        console.log(res);
        localStorage.setItem("list_heart", JSON.stringify(res.data.data));
      } catch {
        setLoading(false);
        setProduct([]);
      }
    };
    FetchGetHeartList();
  }, []);

  const handleDelete = async (productId) => {
    if (!token || !user_id || !productId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/delete/heart`,
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setOpenMessageHeart(true);
      setMessageHeart("Sản phẩm đã được xóa");
      setSeverity("success");
      setProduct(res.data.original.data ?? []);
    } catch (error) {
      setOpenMessageHeart(true);
      setSeverity("error");
      setLoading(false);
      if ([409, 410, 422].includes(error?.response?.status)) {
        setMessageHeart(error.response.data.message_delete);
      }
    }
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 overflow-hidden md:overflow-visible">
      <ul
        className={`
          flex transition-transform duration-500 ease-in-out
          sm:grid sm:grid-cols-2  lg:grid-cols-4 gap-4 mb-10  md:grid md:grid-cols-4 mt-[50px]
        `}
        style={{
          transform:
            window.innerWidth < 650
              ? `translateX(-${currentIndex * 100}%)`
              : "translateX(0%)",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center fixed inset-0 bg-black opacity-50">
            <ClipLoader size={30} color="#36d7b7" loading={loading} />
          </div>
        ) : getProduct.length > 0 ? (
          getProduct.map((product, i) => (
            <li
              key={product.product_id || i}
              className="min-w-[98%] sm:min-w-0 bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              <Link
                to={`/item/detail/${encodeURIComponent(product.slug)}`}
                state={{ id: product.product_id }}
                className="h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    className="mx-auto mb-2 w-[120px] sm:w-[160px] md:w-[180px] h-auto"
                    src={`/Images/x/${product.product_image}`}
                    alt={product.product_name}
                  />
                  {product.percent_name > 0 && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                      -{product.percent_name}%
                    </span>
                  )}
                  <div
                    className="absolute top-0 right-0 rounded-full text-red-500 hover:text-red-700 cursor-pointer"
                    role="button"
                    onClickCapture={(e) => {
                      e.preventDefault(); // chặn hành vi mặc định
                      handleDelete(product?.product_id ?? null);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-gray-800 font-semibold text-base md:max-w-[240px] max-w-[180px] truncate mx-auto">
                  {product.product_name}
                </h3>

                {/* Price */}
                <div className="flex-grow flex flex-col">
                  {product.percent_name ? (
                    <>
                      <div className="flex items-center gap-x-5">
                        <span className="text-red-500 font-bold text-lg">
                          {Number(
                            product.product_price *
                              (1 - product.percent_name / 100)
                          ).toLocaleString()}
                          <sub className="text-xs">đ</sub>
                        </span>
                        <p className="text-gray-500 text-sm">
                          <del>
                            {Number(product.product_price).toLocaleString()}
                            <sub>đ</sub>
                          </del>
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-red-500 font-bold text-lg">
                      {Number(product.product_price).toLocaleString()}
                      <sub>đ</sub>
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p>không có sản phẩm yêu thích nào</p>
        )}
      </ul>

      {/* Dot chỉ carousel (mobile) */}
      <div className="flex justify-center gap-2 mt-2 sm:hidden">
        {getProduct.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === i ? "bg-red-500" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>

      <HandleMessage
        message={messageHeart}
        open={openMessageHeart}
        severity={severity}
        onClose={() => setOpenMessageHeart(false)}
      />
    </section>
  );
}
