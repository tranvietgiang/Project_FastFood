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
import HandleMessage from "../Handle/HandleMessage";

// Thêm className prop
export default function GetProducts({ products, className = "" }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [messageHeart, setMessageHeart] = useState("");
  const [openMessageHeart, setOpenMessageHeart] = useState(false);
  const [severity, setSeverity] = useState("error");

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
            // Thêm className prop vào đây với responsive design
            className={`bg-gradient-to-br from-white to-gray-50 w-full max-w-[300px] sm:max-w-[280px] h-[400px] sm:h-[420px] 
                     text-center relative group p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-xl 
                     transition-all duration-300 flex flex-col ${className}`}
          >
            {/* Icon Actions */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <span
                onClick={async () => {
                  const awaitMessage = await HandleHeart(
                    product?.product_id ?? null
                  );
                  if (awaitMessage) {
                    setMessageHeart(awaitMessage.message);
                    setSeverity(awaitMessage.success ? "success" : "error");
                    setOpenMessageHeart(true);
                  }
                }}
              >
                <HandleIconEffect
                  icon={FiHeart}
                  tooltip="Yêu thích"
                  gradientFrom="from-red-500"
                  gradientTo="to-pink-500"
                  groupName="group/heart"
                  size="text-sm sm:text-base"
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
                  size="text-sm sm:text-base"
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
                  size="text-sm sm:text-base"
                />
              </span>
            </div>

            <Link
              to={`/item/detail/${encodeURIComponent(product.slug)}`}
              state={{ id: product.product_id }}
              className="h-full flex flex-col"
            >
              {/* Image Container */}
              <div className="relative flex-1 mb-2 sm:mb-3 flex items-center justify-center">
                <div className="relative w-full h-32 sm:h-40 flex items-center justify-center p-2">
                  <img
                    className="max-w-full max-h-28 sm:max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                    src={`/Images/x/${product.product_image}`}
                    alt={product.product_name}
                    loading="lazy"
                  />

                  {product.percent_name > 0 && (
                    <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      -{product.percent_name}%
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-grow flex flex-col justify-between space-y-2 sm:space-y-3">
                {/* Product Name */}
                <h3 className="text-gray-800 font-semibold text-sm sm:text-base leading-tight h-12 overflow-hidden line-clamp-2">
                  {product.product_name}
                </h3>

                {/* Rating Stars */}
                <div className="flex justify-center items-center gap-0.5 sm:gap-1">
                  {[...Array(4)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                    />
                  ))}
                  <CiStar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  {product.percent_name > 0 ? (
                    <>
                      <span className="text-red-500 font-bold text-lg sm:text-xl block">
                        {Number(
                          product.product_price *
                            (1 - product.percent_name / 100)
                        ).toLocaleString()}
                        đ
                      </span>
                      <span className="text-gray-500 text-sm sm:text-base line-through">
                        {Number(product.product_price).toLocaleString()}đ
                      </span>
                    </>
                  ) : (
                    <span className="text-red-500 font-bold text-lg sm:text-xl">
                      {Number(product.product_price).toLocaleString()}đ
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  {product.product_variant_name ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModelOpen(!modelOpen);
                        setSelectedId(product?.product_id ?? null);
                      }}
                      className="w-full flex items-center justify-center gap-1 sm:gap-2 rounded-lg border-2 border-red-500 py-2 px-1 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm sm:text-base font-medium"
                    >
                      Tùy chọn <IoIosOptions className="text-base sm:text-lg" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm font-medium">
                        Đặt Ngay
                      </button>
                      <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-xs sm:text-sm font-medium">
                        Thêm Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}

      <ModelProduct
        productId={selectedId}
        isOpen={modelOpen}
        setIsOpen={setModelOpen}
      />

      <HandleCompare
        isOpen={compareOpen}
        setOpen={setCompareOpen}
        productId={selectedId}
      />

      <HandleMessage
        message={messageHeart}
        open={openMessageHeart}
        severity={severity}
        onClose={() => setOpenMessageHeart(false)}
      />
    </>
  );
}
