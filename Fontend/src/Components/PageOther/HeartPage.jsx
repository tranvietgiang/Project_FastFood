import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function HeartPage() {
  const [getProduct, setProduct] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  const users = JSON.parse(localStorage.getItem("user")) ?? null;
  const token = localStorage.getItem("token");
  const user_id = users?.id;

  useEffect(() => {
    if (!token || !user_id) return;

    const FetchGetHeartList = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get-list-heart/${user_id}`
        );
        setProduct(res.data.data ?? res.data); // nếu paginate thì lấy data.data
      } catch {
        setProduct([]);
        setError("Không có sản phẩm yêu thích");
      }
    };
    FetchGetHeartList();
  }, [token, user_id]);

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
        {error && <h2 className="text-center">{error}</h2>}

        {getProduct.map((product, i) => (
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
              </div>

              {/* Title */}
              <h3 className="text-gray-800 font-semibold text-base md:max-w-[240px] max-w-[180px] truncate mx-auto">
                {product.product_name}
              </h3>

              {/* Price */}
              <div className="flex-grow flex flex-col">
                {product.percent_name ? (
                  <>
                    <span className="text-red-500 font-bold text-lg">
                      {Number(
                        product.product_price * (1 - product.percent_name / 100)
                      ).toLocaleString()}
                      <sub className="text-xs">đ</sub>
                    </span>
                    <p className="text-gray-500 text-sm">
                      <del>
                        {Number(product.product_price).toLocaleString()}
                        <sub>đ</sub>
                      </del>
                    </p>
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
        ))}
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
    </section>
  );
}
