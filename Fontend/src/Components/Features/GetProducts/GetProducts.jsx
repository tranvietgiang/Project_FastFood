import { useState } from "react";
import { CiStar, CiShoppingCart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import HandleIconEffect from "../Handle/HandleIconEffect";
import { ModelProduct } from "../../PageOther/ModelProduct";
import HandleCompare from "../Handle/HandleCompare";
import { HandleHeart } from "../Handle/HandleHeart";
export default function GetProducts({ products }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      {products
        .filter(
          (item, index, arr) =>
            index === arr.findIndex((p) => p.product_id === item.product_id)
        )
        .map((product, index) => (
          <li
            key={product.product_id || index}
            className="bg-gradient-to-br from-white to-gray-50 md:w-[270px] md:h-[400px] w-[220px] h-[380px] 
                   text-center relative group p-6 rounded-2xl shadow-lg "
          >
            {/* Action Buttons */}
            <div
              className="absolute top-4 right-4 flex flex-col gap-2 
             transform translate-x-full opacity-0 
             group-hover:translate-x-0 group-hover:opacity-100 
             transition-all duration-300 ease-out z-10 overflow-visible"
            >
              <span onClick={() => HandleHeart(product?.product_id ?? null)}>
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
                  setSelectedId(product?.product_id);
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
                  setSelectedId(product?.product_id ?? null);
                  setCompareOpen(true);
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
              to={`/item/detail/${encodeURIComponent(product.slug)}`}
              state={{ id: product.product_id }}
              className="h-full flex flex-col"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  className="mx-auto mb-2 w-[120px] sm:w-[160px] md:w-[180px] h-auto"
                  src={`/Images/x/${product.product_image}`}
                  alt={product.product_name}
                />

                {/* Discount Badge */}
                {product.percent_name > 0 && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                    -{product.percent_name}%
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h3 className="text-gray-800 font-semibold text-base md:max-w-[240px] max-w-[180px] truncate mx-auto">
                {product.product_name}
              </h3>

              {/* Star Rating */}
              <div className="flex justify-center items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} className="w-4 text-yellow-400 " />
                ))}
                <CiStar />
              </div>

              {/* Price */}
              <div className="flex-grow flex flex-col">
                {product.percent_name ? (
                  <>
                    <span className="text-red-500 font-bold text-lg">
                      {Number(
                        product.product_price * (1 - product.percent_name / 100)
                      ).toLocaleString()}
                      <sub className="text-xs ">đ</sub>
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

              <p className="relative z-[500] mt-3">
                {product.product_variant_name ? (
                  <button
                    onClick={(a) => {
                      a.preventDefault();
                      a.stopPropagation();
                      setModelOpen(!modelOpen);
                      setSelectedId(product?.product_id ?? null);
                    }}
                    className="flex items-center gap-1 rounded-md border-2 border-red-600 p-1 px-3 mx-auto  hover:bg-red-600 duration-300 transition-color"
                  >
                    Tùy chọn <IoIosOptions />
                  </button>
                ) : (
                  <div className="md:flex place-content-center justify-between">
                    <button className="justify-around bg-red-500 text-white p-1 px-3 rounded-md  hover:bg-red-700 md:mb-0 mb-2">
                      <span className="flex items-center justify-center gap-2">
                        Đặt Ngay
                        <MdOutlineShoppingCartCheckout className="w-4 h-4" />
                      </span>
                    </button>
                    <button className="justify-around bg-green-500 text-white p-1 px-3 rounded-md  hover:bg-green-600">
                      <span className="flex items-center justify-center gap-2">
                        Cart
                        <CiShoppingCart className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                )}
              </p>
            </Link>
          </li>
        ))}

      <div>
        <ModelProduct
          productId={selectedId}
          isOpen={modelOpen}
          setIsOpen={setModelOpen}
        />
      </div>

      <div>
        <HandleCompare
          isOpen={compareOpen}
          setOpen={setCompareOpen}
          productId={selectedId}
        />
      </div>
    </>
  );
}
