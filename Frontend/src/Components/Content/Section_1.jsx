import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DateCoupon from "../Features/DateCoupon/DateCoupon";

const section_1 = [
  { img: "chicken_1.png", name: "Gà rán" },
  { img: "MiY.webp", name: "Mì ý" },
  { img: "Pizza.webp", name: "Pizza" },
  { img: "rice.webp", name: "Cơm" },
  { img: "salad.webp", name: "Salad" },
  { img: "cake.png", name: "Bánh" },
];

export default function Section_1() {
  const [getCoupon, setCoupon] = useState([]);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [copiedText, setCopiedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [couponExistUser, setCouponExistUser] = useState([]);

  useEffect(() => {
    const cache_coupons = localStorage.getItem("cache_coupons");

    if (cache_coupons) {
      setCoupon(JSON.parse(cache_coupons));
    }

    axios
      .get("http://localhost:8000/api/getCoupon")
      .then((res) => {
        setCoupon(res.data);
        localStorage.setItem("cache_coupons", JSON.stringify(res.data));
        setError("");
      })
      .catch((e) => {
        setCoupon([]);
        console.log("error", e);
        setError("Phiếu giảm giá đang bị lỗi, xin lỗi bạn");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get-coupon-user")
      .then((res) => {
        setCouponExistUser(res.data.list);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  return (
    <>
      <section className="md:w-[1400px] mx-auto mt-4 px-4 ">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl">
          Lựa chọn thực đơn
        </h1>

        <div
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
          className="flex overflow-x-auto sm:grid-cols-3 md:grid md:grid-cols-6 gap-y-8 gap-x-8 place-items-center mt-12 mb-16"
        >
          {section_1.map((e, i) => (
            <a className="group" href="#" key={i}>
              <div className="text-center">
                <span className="relative inline-block md:w-[160px] md:h-[160px] w-[100px] h-auto">
                  <div className="absolute inset-0 border-[3px] border-dashed border-gray-300 rounded-full group-hover:border-orange-400 group-hover:animate-spin group-hover:[animation-duration:6s] group-hover:[animation-timing-function:linear]"></div>
                  <img
                    className="relative md:w-full md:h-full object-cover rounded-full p-4"
                    src={`/Images/Section1/${e.img}`}
                    alt={e.name}
                  />
                </span>
                <br />
                <span className="mt-4 inline-block font-semibold group-hover:text-orange-400 duration-300 transition-colors">
                  {e.name}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/*Coupon*/}
        <div className="Coupon relative w-full overflow-hidden md:overflow-visible">
          {/* Breakpoint	Áp dụng class
              Mobile (<640px)	grid-cols-2
              sm (≥640px)	grid-cols-3
              md (≥768px)	grid-cols-4
              lg (≥1024px)	grid-cols-6 */}
          <ul
            className="flex transition-transform duration-500 ease-in-out
             md:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 md:gap-4 mb-10"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {error && <h2 className="text-center">{error}</h2>}

            {copiedText && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 mt-[300px] py-2 rounded-md shadow-md z-[9999] text-center text-sm">
                {copiedText}
              </div>
            )}

            <DateCoupon
              getCouponList={couponExistUser}
              getCoupon={getCoupon}
              copiedId={copiedId}
              setCopiedText={setCopiedText}
              setCopiedId={setCopiedId}
            />
            <Link
              className="bg-gray-500 hover:bg-gray-700 text-white"
              to="/user"
            >
              Mã giảm giá của tôi
            </Link>
          </ul>
          {/* Tab indicator */}
          <div className="flex justify-center gap-2 mt-2 md:hidden">
            {getCoupon.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === i ? "bg-red-500" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
