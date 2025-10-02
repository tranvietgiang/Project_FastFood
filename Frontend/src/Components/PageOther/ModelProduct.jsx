import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { CiStar } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { handleBuyNow } from "../Features/HandleBuyNow/HandleBuyNow";
import { useNavigate } from "react-router-dom";
export function ModelProduct({ productId, isOpen, setIsOpen }) {
  const [getProduct, setGetProduct] = useState([]);
  const [priceDiscount, setPriceDiscount] = useState(null);
  const [priceVariantPrice, setPriceVariantPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectVariants, setSelectVariants] = useState("");
  const [noteOrder, setNoteOrder] = useState(null);
  const [quantityStore, setQuantityStore] = useState(null);

  const navigate = useNavigate();
  const quantityRef = useRef();
  const priceRef = useRef();
  const nameRef = useRef();

  const ClickIncrease = () => {
    setQuantity((pev) => pev + 1);
  };

  const ClickDecrease = () => {
    if (quantity > 1) {
      setQuantity((pev) => pev - 1);
    }
  };

  const reset = () => {
    setSelectVariants("");
    setPriceVariantPrice(null);
  };

  useEffect(() => {
    if (!productId) return;

    const productFirst = localStorage.getItem("cache_productFirst");

    if (productFirst) {
      setGetProduct(JSON.parse(productFirst));
    }

    axios
      .get(`http://localhost:8000/api/products/detail/by-id/${productId}`)
      .then((res) => {
        setGetProduct(res.data);
        localStorage.setItem("cache_productFirst", JSON.stringify(res.data));

        let checkData = res.data?.first ?? res.data?.variants;

        let a =
          checkData?.product_price && checkData?.percent_name
            ? checkData?.product_price * (1 - checkData.percent_name / 100)
            : res.data?.product_price * (1 - res.data?.percent_name / 100);

        setPriceDiscount(a);
        setNoteOrder("");
        setQuantity(1);
        reset();
      })
      .catch((e) => {
        console.log("error", e);
        setGetProduct([]);
      });
  }, [productId]);

  useEffect(() => {
    if (!getProduct?.variants?.length) return;

    let variant = getProduct?.variants?.find(
      (e) => e.product_variant_name == selectVariants
    );
    setQuantity(1);
    setPriceVariantPrice(variant?.product_variant_price ?? null);
  }, [selectVariants, getProduct]);

  const percent = getProduct?.first?.percent_name ?? getProduct?.percent_name;
  const originalPrice =
    getProduct?.first?.product_price ?? getProduct?.product_price;

  const maxQuantity =
    quantityStore ??
    getProduct?.product_quantity ??
    getProduct?.first?.product_quantity;
  const isDisabled = quantity > maxQuantity;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[900] ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              className="md:w-[250px] w-[150px] h-auto object-cover mb-4 mt-8"
              src={`/Images/x/${
                getProduct?.first?.product_image || getProduct.product_image
              }`}
              alt={getProduct?.first?.product_name || getProduct.product_name}
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="md:w-1/2 md:pl-8 flex flex-col gap-4 md:mt-0 mt-[20px]">
            <div>
              <h1 ref={nameRef} className="text-xl font-bold max-w-[400px]">
                {getProduct?.first?.product_name || getProduct.product_name}
              </h1>
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <CiStar key={i} />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  Đã thêm so sánh
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Thương hiệu: <span className="text-blue-600">EGA Food</span> |
                Mã sản phẩm: Đang cập nhật
              </p>
              <p className="text-sm ">
                Trạng thái:
                <span
                  className={`mx-2
                  ${
                    (quantityStore && quantityStore > 0) ||
                    getProduct?.first?.product_quantity > 0 ||
                    getProduct.product_quantity > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                  `}
                >
                  {(quantityStore && quantityStore > 0) ||
                  getProduct?.first?.product_quantity > 0 ||
                  getProduct.product_quantity > 0
                    ? `Sẵn trong kho (
                  ${
                    quantityStore
                      ? quantityStore
                      : getProduct?.product_quantity ||
                        getProduct?.first?.product_quantity
                  } )`
                    : "Hết hàng"}
                </span>
              </p>
            </div>

            {/* Giá */}
            <div className="flex items-center gap-3">
              {priceVariantPrice != null ? (
                // variant
                <span className="text-red-600 text-2xl font-bold">
                  <span ref={priceRef ?? null}>
                    {Number(priceVariantPrice).toLocaleString()}
                  </span>
                  đ
                </span>
              ) : getProduct?.first?.percent_name ||
                getProduct?.percent_name ? (
                // có giảm giá
                <span className="text-red-600 text-2xl font-bold">
                  <span ref={priceRef ?? null}>
                    {Number(priceDiscount).toLocaleString()}
                  </span>
                  đ
                </span>
              ) : (
                // giá gốc
                <span className="text-red-600 text-2xl font-bold">
                  <span ref={priceRef ?? null}>
                    {Number(
                      getProduct?.first?.product_price ||
                        getProduct?.product_price
                    ).toLocaleString()}
                  </span>
                  đ
                </span>
              )}

              {!selectVariants && percent && (
                <>
                  <span className="line-through text-gray-400">
                    {Number(originalPrice).toLocaleString()}đ
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -{percent}%
                  </span>
                </>
              )}
            </div>

            {/*các sự lựa chon khác*/}
            {getProduct?.variants?.length ? (
              <p>
                <div className="flex gap-x-3 items-center">
                  <h3 className="font-bold text-lg mb-2">Các lựa chọn khác</h3>
                  <button
                    className={`mt-[-5px] ${
                      selectVariants ? "hover:text-red-500 " : ""
                    }`}
                    onClick={() => {
                      setSelectVariants("");
                      setQuantityStore(null);
                    }}
                  >
                    <AiOutlineCloseCircle className="text-md" />
                  </button>
                </div>
                <div className="flex gap-x-3">
                  {getProduct?.variants?.map((e, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectVariants(e.product_variant_name);
                        setQuantityStore(e.product_variant_quantity);
                      }}
                      className={`border p-2 rounded-lg  text-sm ${
                        selectVariants === e?.product_variant_name
                          ? "border-2 border-red-600"
                          : "border-gray-500"
                      }`}
                    >
                      {e?.product_variant_name}
                    </button>
                  ))}
                </div>
              </p>
            ) : null}

            <div>
              <label className="text-sm font-medium">Ghi chú món ăn:</label>
              <input
                type="text"
                value={noteOrder}
                onChange={(e) => setNoteOrder(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-red-500"
                placeholder="Nhập ghi chú..."
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Số lượng:</span>
              <button
                onClick={ClickDecrease}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                -
              </button>
              <span ref={quantityRef}>{quantity ?? null}</span>
              <button
                onClick={ClickIncrease}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Thêm vào giỏ
              </button>

              <button
                onClick={() =>
                  handleBuyNow({
                    getProduct,
                    priceDiscount,
                    priceVariantPrice,
                    quantity,
                    selectVariants,
                    noteOrder,
                    quantityRef,
                    priceRef,
                    nameRef,
                    navigate,
                  })
                }
                disabled={isDisabled}
                className={`${
                  isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }
                text-white px-4 py-2 rounded`}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>
      </div>
    </div>
  );
}
