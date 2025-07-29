import { AiFillThunderbolt } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Section_2() {
  const [getProduct, setGetProduct] = useState([]);
  const [error, setError] = useState("");
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 4;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < getProduct.length) {
      setStartIndex((prev) => prev + itemsPerPage);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/getProduct")
      .then((res) => {
        setGetProduct(res.data || []);
      })
      .catch((e) => {
        setError("Lỗi phía serve!");
        console.log("error", e);
      });
  }, []);
  return (
    <>
      <section className="container mx-auto mt-4 px-4">
        <h2 className="text-4xl flex space-x-5  items-center font-bold">
          <AiFillThunderbolt className="text-yellow-500 opacity-50" /> Khuyến
          mãi Online
        </h2>
        <div className="mt-3 mb-4">
          <div className="flex gap-2 mb-3">
            <button className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100">
              Tất cả Khuyến mãi
            </button>
          </div>
          <ul className="bg-white p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5 place-items-center relative">
            {error && <div>{error}</div>}

            {getProduct
              .slice(startIndex, startIndex + itemsPerPage)
              .map((e) => {
                const priceNew = e.product_price * (1 - e.percent_name / 100);
                return (
                  <>
                    <li className="w-[250px] text-center relative ">
                      <Link to="#">
                        <img
                          className="mx-auto w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] gap-y-3 gap-x-4 h-auto object-cover rounded-sm border-2"
                          src={`/Images/MiY/product-image-1.jpg`}
                          alt="foods"
                        />

                        <span className="absolute bg-red-500 rounded-md sm:text-base  p-1 px-1 text-white/100 text-sm top-[20px] right-[80%]  -mx-[20px]">
                          -{e.percent_name}%
                        </span>

                        <strong className="text-red-500">
                          {e.product_name}
                        </strong>
                        <span className="text-[20px]">
                          <CiStar className="mx-auto text-yellow-500 " />
                          <FaStar className="mx-auto text-yellow-500 " />
                        </span>
                        <p className="text-red-500">
                          <span>
                            {priceNew.toLocaleString()}
                            <sub>
                              <u>đ</u>
                            </sub>
                          </span>
                          <span className="text-black opacity-45 block text-sm">
                            <del>
                              {e.product_price} <sub>đ</sub>
                            </del>
                          </span>
                        </p>
                        <button className="flex items-center gap-1 rounded-md border-2 border-red-600 p-1 px-3 mx-auto mt-3 hover:bg-red-600 duration-300 transition-color">
                          Tùy chọn <IoIosOptions />
                        </button>
                      </Link>
                    </li>
                  </>
                );
              })}
          </ul>
          <div className="relative -top-[350px] sm:-top-[400px] md:-top-[250px] flex justify-between px-4">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="text-xl p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= getProduct.length}
              className="text-xl p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
