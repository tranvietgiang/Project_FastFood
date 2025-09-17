import { AiFillThunderbolt } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import HandleIconEffect from "../Features/Handle/HandleIconEffect";
import { ModelProduct } from "../PageOther/ModelProduct";
import HandleCompare from "../Features/Handle/HandleCompare";
import { HandleHeart } from "../Features/Handle/HandleHeart";

export default function Section_2() {
  const [getProduct, setGetProduct] = useState([]);
  const [error, setError] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const [modelOpen, setModelOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < getProduct.length) {
      setStartIndex((prev) => prev + itemsPerPage);
    }
  };

  useEffect(() => {
    const cacheProducts = localStorage.getItem("cache_products2");
    if (cacheProducts) {
      setGetProduct(JSON.parse(cacheProducts));
    }

    axios
      .get("http://localhost:8000/api/getProduct")
      .then((res) => {
        setGetProduct(res.data);
        localStorage.setItem("cache_products2", JSON.stringify(res.data));
      })
      .catch((e) => {
        setGetProduct([]);
        setError("Lỗi phía serve!");
        console.log("error", e);
      });
  }, []);

  return (
    <>
      <section className="md:w-[1400px] mx-auto mt-4 px-4">
        <h2 className="text-4xl flex space-x-5  items-center font-bold">
          <AiFillThunderbolt className="text-yellow-500 opacity-50" /> Khuyến
          mãi Online
        </h2>
        <div className="flex gap-2 mb-3 mt-4">
          <button className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100">
            Tất cả Khuyến mãi
          </button>
        </div>
        <div className="relative mt-3 mb-4">
          <ul className="bg-white rounded-md p-4 grid grid-cols-2 sm:grid-cols-3 md:w-full md:px-4 md:mt-4 md:grid-cols-4 gap-y-5 place-items-center relative">
            {error && <div>{error}</div>}

            {getProduct
              .filter(
                (item, index, arr) =>
                  index ===
                  arr.findIndex((p) => p.product_id === item.product_id)
              )
              .slice(startIndex, startIndex + itemsPerPage)
              .map((e, i) => {
                const priceNew = e.product_price * (1 - e.percent_name / 100);
                return (
                  <>
                    <li
                      key={i}
                      className="w-[250px] h-[300px] md:h-auto text-center relative group mb-3"
                    >
                      {/* Action Buttons */}
                      <div
                        className="absolute top-4 right-4 flex flex-col gap-2 
                        transform translate-x-full opacity-0 
                        group-hover:translate-x-0 group-hover:opacity-100 
                        transition-all duration-300 ease-out z-10 overflow-visible"
                      >
                        <span onClick={() => HandleHeart(e.product_id ?? null)}>
                          <HandleIconEffect
                            icon={FiHeart}
                            tooltip="Yêu thích"
                            gradientFrom="from-red-500"
                            gradientTo="to-pink-500"
                            groupName="group/heart"
                          />
                        </span>
                        <span
                          onClick={() => {
                            setSelectedId(e.product_id ?? null);
                            setModelOpen(!modelOpen);
                          }}
                        >
                          <HandleIconEffect
                            icon={AiOutlineEye}
                            tooltip="Xem nhanh"
                            gradientFrom="from-blue-500"
                            gradientTo="to-cyan-500"
                            groupName="group/eye"
                          />
                        </span>
                        <span
                          onClick={() => {
                            setSelectedId(e.product_id ?? null);
                            setCompareOpen(!modelOpen);
                          }}
                        >
                          <HandleIconEffect
                            icon={IoIosGitCompare}
                            tooltip="So sánh"
                            gradientFrom="from-green-500"
                            gradientTo="to-emerald-500"
                            groupName="group/compare"
                          />
                        </span>
                      </div>

                      <Link
                        className="relative"
                        to={`/item/detail/${encodeURIComponent(e.slug)}`}
                        state={{ id: e.product_id }}
                      >
                        <img
                          className="mx-auto w-[100px] sm:w-[150px] md:h-[250px] lg:w-[250px] gap-y-3 gap-x-4 h-auto object-cover rounded-sm"
                          src={`/Images/x/${e.product_image}`}
                          alt="foods"
                        />

                        <span className="absolute bg-red-500 rounded-md sm:text-base  p-1 px-1 text-white/100 text-sm top-0 right-[40%] -mx-[20px]">
                          -{e.percent_name}%
                        </span>

                        <strong className="text-red-500 truncate md:max-w-[250px] sm:max-w-[250px] md:text-[17px] text-sm max-w-[150px] inline-block">
                          {e.product_name}
                        </strong>
                        <span className="text-[20px]">
                          <CiStar className="mx-auto text-yellow-500 " />
                          <FaStar className="mx-auto text-yellow-500 " />
                        </span>
                        <p className="text-red-500">
                          {e.percent_name ? (
                            <span>
                              {priceNew.toLocaleString()}
                              <sub>
                                <u>đ</u>
                              </sub>
                            </span>
                          ) : (
                            ""
                          )}
                          <span className="text-black opacity-45 block text-sm">
                            <del>
                              {Number(e.product_price).toLocaleString() ?? ""}
                              <sub>đ</sub>
                            </del>
                          </span>
                        </p>
                        <p className="relative z-[500]  mt-3">
                          {e.product_variant_name ? (
                            <button
                              onClick={(a) => {
                                a.preventDefault();
                                a.stopPropagation();
                                setModelOpen(!modelOpen);
                                setSelectedId(e.product_id);
                              }}
                              className="flex items-center gap-1 rounded-md border-2 border-red-600 p-1 px-3 mx-auto  hover:bg-red-600 duration-300 transition-color"
                            >
                              Tùy chọn <IoIosOptions />
                            </button>
                          ) : (
                            <button className="bg-red-500 text-white p-1 px-3 rounded-md  hover:bg-red-700">
                              <span className="flex items-center justify-center gap-2">
                                Đặt Ngay
                                <IoIosOptions className="w-4 h-4" />
                              </span>
                            </button>
                          )}
                        </p>
                      </Link>
                    </li>
                  </>
                );
              })}
          </ul>

          <div>
            <ModelProduct
              productId={selectedId}
              setIsOpen={setModelOpen}
              isOpen={modelOpen}
            />
          </div>

          <div>
            <HandleCompare
              isOpen={compareOpen}
              setOpen={setCompareOpen}
              productId={selectedId}
            />
          </div>

          {/*Click để move img */}
          <div className="absolute w-[95%] top-[45%] sm:-top-[400px] md:top-[45%] md:w-[100%] flex justify-between px-4">
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
        <div>
          <img
            className="w-full h-full object-cover mb-[100px]"
            src="/Images/index/index_slider_2.webp"
            alt=""
          />
        </div>
      </section>
    </>
  );
}
