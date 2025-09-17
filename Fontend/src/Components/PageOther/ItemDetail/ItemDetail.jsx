import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { Paginate } from "../../Features/Paginate/Paginate";
import { RiCoupon2Line } from "react-icons/ri";
import ProductRelated from "./ProductRelated";
import RecentlyViews from "./RecentlyViews";
import { useMemo } from "react";
import axios from "axios";
import DateCoupon from "../../Features/DateCoupon/DateCoupon";

export default function ItemDetail() {
  const location = useLocation();
  const id = location.state?.id ?? null;
  const [getProduct, setProduct] = useState([]);
  const [error, setError] = useState("");
  const [priceDiscount, setPriceDiscount] = useState(null);
  // const [priceVariantPrice, setPriceVariantPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [drinkTogether, setDrinkTogether] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectVariants, setSelectVariants] = useState("");

  const itemsPerPage = 3;
  const pageFirst = currentPage * itemsPerPage;
  const pageLast = pageFirst - itemsPerPage;
  const lastPage = Math.ceil(drinkTogether.length / itemsPerPage);
  const navigate = useNavigate();
  const [getDiscount, setDiscount] = useState([]);
  const [turnDiscount, setTurnDiscount] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedText, setCopiedText] = useState("");
  const [quantityStore, setQuantityStore] = useState(null);
  const [couponExistUser, setCouponExistUser] = useState([]);

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
    // setPriceVariantPrice(null);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get-coupon-user")
      .then((res) => {
        setCouponExistUser(res.data.list);
        // console.log(res.data.list);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/api/products/detail/by-id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let products = data?.first ?? data;
        setProduct(data);

        let a =
          products?.product_price && products?.percent_name
            ? products.product_price * (1 - products.percent_name / 100)
            : null;
        setQuantity(1);
        setNoteOrder("");
        setPriceDiscount(a);
        setQuantityStore(null);
        reset();
        // data?.variants?.some(v => v.product_variant_name
      })
      .catch((e) => {
        console.error("Error", e);
        setProduct([]);
        setError("Lỗi phía server");
      });
  }, [id]);

  // useEffect(() => {
  //   if (!getProduct?.variants?.length) return;

  //   let variant = getProduct?.variants?.find(
  //     (e) => e.product_variant_name == selectVariants
  //   );

  //   setPriceVariantPrice(variant?.product_variant_price ?? null);
  // }, [selectVariants, getProduct]);

  const selectedVariant = useMemo(() => {
    setQuantity(1);
    return getProduct?.variants?.find(
      (e) => e.product_variant_name === selectVariants
    );
  }, [selectVariants, getProduct]);

  const priceVariantPrice = selectedVariant?.product_variant_price ?? null;

  useEffect(() => {
    const cache_drink_products = localStorage.getItem("cache_drink_products");
    if (cache_drink_products) {
      setDrinkTogether(JSON.parse(cache_drink_products));
    }

    fetch("http://localhost:8000/api/products/drink-together")
      .then((res) => {
        if (res.status === 500) {
          setDrinkTogether({});
        }
        return res.json();
      })
      .then((data) => {
        setDrinkTogether(data);
        localStorage.setItem("cache_drink_products", JSON.stringify(data));
      })
      .catch((e) => {
        console.log("Error", e);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/getDiscount`)
      .then((res) => {
        setDiscount(res.data);
      })
      .catch((e) => {
        setDiscount([]);
        console.log("error-discount", e);
      });
  }, []);

  const [noteOrder, setNoteOrder] = useState(null);

  const quantityRef = useRef();
  const priceRef = useRef();
  const nameRef = useRef();

  const handleBuyNow = async () => {
    if (quantityRef.current?.innerText != quantity) {
      navigate("/notFile");
      return;
    }

    let finalName = getProduct?.first?.product_name || getProduct?.product_name;
    let finalPrice = priceDiscount || getProduct?.product_price;

    if (nameRef.current?.innerText.trim() !== finalName.trim()) {
      navigate("/notFile");
      return;
    }

    if (selectVariants != "") {
      finalName = selectVariants;
      finalPrice = priceVariantPrice || finalPrice;
    }

    if (priceRef.current.textContent != Number(finalPrice).toLocaleString()) {
      navigate("/notFile");
      return;
    }

    const newPackage = {
      idOrder: getProduct?.first?.product_id || getProduct?.product_id,
      nameOrder: finalName,
      priceOrder: Number(finalPrice).toFixed(2),
      quantityOrder: quantity,
      noteOrder: noteOrder || "",
      imageOrder: getProduct?.product_image || getProduct?.first?.product_image,
    };

    localStorage.setItem("packageOrder", JSON.stringify(newPackage));
    navigate("/information-orders");
  };

  const percent = getProduct?.first?.percent_name ?? getProduct?.percent_name;
  const originalPrice =
    getProduct?.first?.product_price ?? getProduct?.product_price;

  const maxQuantity =
    quantityStore ??
    getProduct?.product_quantity ??
    getProduct?.first?.product_quantity;
  const isDisabled = quantity > maxQuantity;

  return (
    <section className="md:w-[1400px] mx-auto p-4 mt-3">
      <p className="flex gap-x-2 text-sm text-gray-500 mb-4">
        <Link onClick={() => navigate(-1)} className="hover:underline">
          Quay lại
        </Link>
        /
        <Link to="#" className="hover:underline">
          Sản phẩm nổi bật
        </Link>
        /
        <span ref={nameRef} className="text-gray-700">
          {getProduct?.first?.product_name ?? getProduct.product_name}
        </span>
      </p>

      {error && <div>{error}</div>}
      <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow">
        <div className="md:w-1/2 flex flex-col items-center">
          <img
            className="md:w-[250px] w-[150px] h-auto object-cover mb-4 mt-8"
            src={`/Images/x/${
              getProduct?.first?.product_image || getProduct.product_image
            }`}
            alt={getProduct?.first?.product_name || getProduct.product_name}
          />
          <div className="flex gap-2">
            <img
              className="md:w-16 h-16   border rounded cursor-pointer md:p-1 p-2"
              src={`/Images/x/${
                getProduct?.first?.product_image || getProduct.product_image
              }`}
              alt="thumbnail"
            />
            <div className="w-16 h-16 border rounded flex items-center justify-center">
              ...
            </div>
          </div>
          <h1 className="font-bold md:text-2xl text-md mb-8 mt-[100px] md:block hidden">
            Sản phẩm thường được mua cùng
          </h1>

          <div className="">
            {/*drinkTogether */}
            <div className="mb-[50px] md:block hidden">
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-10 sm:grid-cols-2 ">
                {drinkTogether
                  .filter(
                    (item) =>
                      item.product_id != getProduct?.first?.product_id &&
                      item.product_id != getProduct.product_id
                  )
                  .slice(pageLast, pageFirst)
                  .map((e, index) => (
                    <li className="relative" key={index}>
                      <Link
                        to={`/item/detail/${encodeURIComponent(e.slug)}`}
                        state={{ id: e.product_id }}
                      >
                        <span>
                          <img
                            className="md:w-[110px] mx-auto h-auto object-cover mb-4 w-[110px]"
                            src={`/Images/x/${e.product_image}`}
                            alt=""
                          />
                        </span>
                        <p className="text-center">
                          <strong className="font-semibold text-1xl md:text-1xl">
                            {e.product_name ?? null}
                          </strong>
                          <br />
                          <span className="text-red-500 font-bold text-lg">
                            {Number(e.product_price).toLocaleString()}
                            <sub>đ</sub>
                          </span>
                          {e.percent_name && (
                            <span className=" text-red-600 font-bold  rounded text-sm absolute top-0">
                              -{e.percent_name}%
                            </span>
                          )}
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {lastPage && (
            <span className="md:mt-[-30px] mb-10 md:block hidden">
              <Paginate
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={setCurrentPage}
              />
            </span>
          )}
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
              Thương hiệu: <span className="text-blue-600">EGA Food</span> | Mã
              sản phẩm: Đang cập nhật
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
            ) : getProduct?.first?.percent_name || getProduct?.percent_name ? (
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

          {/* Mã giảm giá */}
          <div className="cursor-pointer">
            <span className="text-sm mb-3 inline-block">Mã giảm giá:</span>
            <br />
            <p className="flex items-center gap-x-3 ">
              {getDiscount.slice(0, 2).map((e, index) => (
                <span
                  key={index}
                  className="flex  items-center gap-x-2 bg-yellow-100 text-orange-600 px-2 py-1 rounded"
                >
                  <RiCoupon2Line /> RT{e.coupon_id ?? ""}
                </span>
              ))}
              <FaAngleRight
                onClick={() => setTurnDiscount(!turnDiscount)}
                className="text-gray-400"
              />
            </p>
          </div>

          {turnDiscount && (
            <div
              onClick={() => setTurnDiscount(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
            ></div>
          )}

          <div
            className={`fixed top-0 bg-white p-4 right-0 grid grid-cols-1 z-[999] gap-y-5 max-h-[100%] overflow-y-auto space-y-3 ${turnDiscount ? "block" : "hidden"}`}
          >
            {copiedText && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 mt-[300px] py-2 rounded-md shadow-md z-[999] text-center text-sm">
                {copiedText}
              </div>
            )}
            <p>Mã giảm giá</p>
            <Link
              className="bg-gray-500 hover:bg-gray-700 text-white"
              to="/user"
            >
              Mã giảm giá của tôi
            </Link>
            <DateCoupon
              getCouponList={couponExistUser}
              getCoupon={getDiscount}
              copiedId={copiedId}
              setCopiedText={setCopiedText}
              setCopiedId={setCopiedId}
            />
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
              onClick={handleBuyNow}
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

      {/*Display product related*/}
      <ProductRelated idDetailRelated={id} />

      {/*Display product user viewed*/}
      <RecentlyViews idViewRecently={id} />
    </section>
  );
}
