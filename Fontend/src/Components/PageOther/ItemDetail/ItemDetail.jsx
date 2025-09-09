import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Paginate } from "../../Features/Paginate/Paginate";
import ProductRelated from "./ProductRelated";
import RecentlyViews from "./RecentlyViews";

export default function ItemDetail() {
  const location = useLocation();
  const id = location.state?.id ?? null;
  const [getProduct, setProduct] = useState([]);
  const [error, setError] = useState("");
  const [priceDiscount, setPriceDiscount] = useState(null);
  const [priceVariantPrice, setPriceVariantPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [drinkTogether, setDrinkTogether] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectVariants, setSelectVariants] = useState("");

  const itemsPerPage = 3;
  const pageFirst = currentPage * itemsPerPage;
  const pageLast = pageFirst - itemsPerPage;
  const lastPage = Math.ceil(drinkTogether.length / itemsPerPage);
  const navigate = useNavigate();

  const ClickIncrease = () => {
    setQuantity((pev) => pev + 1);
  };

  const ClickDecrease = () => {
    if (quantity > 1) {
      setQuantity((pev) => pev - 1);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/api/products/detail/by-id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data?.first?.percent_name) {
          setPriceDiscount(
            data?.first?.product_price * (1 - data.first?.percent_name / 100)
          );
        }

        setSelectVariants("");
        setPriceVariantPrice(null);
        // data?.variants?.some(v => v.product_variant_name
      })
      .catch((e) => {
        console.error("Error", e);
        setProduct([]);
        setError("Lỗi phía server");
      });
  }, [id]);

  useEffect(() => {
    if (!getProduct?.variants?.length) return;

    let variant = getProduct?.variants?.find(
      (e) => e.product_variant_name == selectVariants
    );

    setPriceVariantPrice(variant?.product_variant_price ?? null);
  }, [selectVariants, getProduct]);

  // console.log();

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
        <span className="text-gray-700">
          {getProduct?.first?.product_name || getProduct.product_name}
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
                    <li key={index}>
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
                            {e.product_name}
                          </strong>
                          <br />
                          <span className="text-red-500 font-bold text-lg">
                            {Number(e.product_price).toLocaleString()}
                            <sub>đ</sub>
                          </span>
                          {e.percent_name && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
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

          <span className="md:mt-[-30px] mb-10 md:block hidden">
            <Paginate
              currentPage={currentPage}
              lastPage={lastPage}
              setCurrentPage={setCurrentPage}
            />
          </span>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2 md:pl-8 flex flex-col gap-4 md:mt-0 mt-[20px]">
          <div>
            <h1 className="text-xl font-bold max-w-[400px]">
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
                    getProduct?.first?.product_quantity > 0 ||
                    getProduct.product_quantity > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                  `}
              >
                {getProduct?.first?.product_quantity > 0 ||
                getProduct.product_quantity > 0
                  ? "Sẵn trong kho"
                  : "Hết hàng"}
              </span>
            </p>
          </div>

          {/* Giá */}
          <div className="flex items-center gap-3">
            {priceVariantPrice ? (
              <span className="text-red-600 text-2xl font-bold">
                {Number(priceVariantPrice).toLocaleString() ?? null}
              </span>
            ) : getProduct?.first?.percent_name || getProduct.percent_name ? (
              <span className="text-red-600 text-2xl font-bold">
                {Number(priceDiscount).toLocaleString()}đ
              </span>
            ) : (
              <span className="text-red-600 text-2xl font-bold">
                {Number(
                  getProduct?.first?.product_price || getProduct.product_price
                ).toLocaleString()}
                đ
              </span>
            )}

            {/*Percent*/}
            {(getProduct?.first?.percent_name || getProduct.percent_name) && (
              <span className="line-through text-gray-400">
                {Number(
                  getProduct?.first?.product_price || getProduct.product_price
                ).toLocaleString()}
                đ
              </span>
            )}
            {(getProduct?.first?.percent_name || getProduct?.percent_name) && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                -{getProduct?.first?.percent_name || getProduct?.percent_name}%
              </span>
            )}
          </div>

          {/* Khuyến mãi */}
          <div className="border border-green-200 bg-green-50 rounded p-3 text-sm">
            <strong className="block mb-1">🎁 Quà tặng khuyến mãi</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Nhập mã EGANY thêm 5% đơn hàng</li>
              <li>Giảm giá 10% khi mua từ 5 sản phẩm</li>
              <li>Giảm giá 10% khi mua từ 5 sản phẩm</li>
              <li>Tặng phiếu mua hàng khi mua từ 500k</li>
            </ul>
          </div>

          {/* Mã giảm giá */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Mã giảm giá:</span>
            <span className="bg-yellow-100 text-orange-600 px-2 py-1 rounded">
              EGA15
            </span>
            <span className="bg-yellow-100 text-orange-600 px-2 py-1 rounded">
              EGA30
            </span>
            <FaAngleRight className="text-gray-400" />
          </div>

          {/*các sự lựa chon khác*/}
          {getProduct?.variants?.length ? (
            <p>
              <h3 className="font-bold text-lg mb-2">Các lựa chọn khác</h3>
              <div className="flex gap-x-3">
                {getProduct?.variants?.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectVariants(e.product_variant_name)}
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
            <span>{quantity}</span>
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

            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
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
