import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";

const colors = [
  { id: 1, name: "Trắng" },
  { id: 2, name: "Đen" },
  { id: 3, name: "Xám" },
  { id: 4, name: "Xanh dương" },
  { id: 5, name: "Xanh 2" },
  { id: 6, name: "Xanh 1" },
];

const prices = [
  { id: 1, price: 1000000 },
  { id: 2, price: 2000000 },
  { id: 3, price: 3000000 },
  { id: 4, price: 4000000 },
  { id: 5, price: 5000000 },
];

export default function ShowAllSection_3() {
  const [getProducts, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [sendTerm, setSendTerm] = useState("default");
  const [stateColor, setStateColor] = useState(false);
  const [last, setLast] = useState(4);
  const [option, setOption] = useState(null);
  const location = useLocation();
  const getLocation = location.state?.termData;
  const navigate = useNavigate();

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    if (!option || !getLocation) {
      return;
    }

    fetch(
      `http://localhost:8000/api/showAll/section/option?priceOption=${encodeURIComponent(
        option
      )}&getLocation=${encodeURIComponent(getLocation)}`
    )
      .then(async (res) => {
        if (!res.ok) {
          setProducts([]);
          return;
        }
        const result = await res.json();
        setProducts(result);
      })
      .catch((e) => {
        console.log("Error", e);
        setProducts([]);
      });
  }, [option, getLocation]);

  useEffect(() => {
    if (!sendTerm) {
      setError("Lỗi phía back end!");
      return;
    }

    axios
      .get(
        `http://localhost:8000/api/showAll/section?termData=${encodeURIComponent(
          sendTerm
        )}&getLocation=${encodeURIComponent(getLocation)}`
      )
      .then((res) => {
        setProducts(res.data);
      })
      .catch((e) => {
        console.log("Error", e);
        setProducts([]);
        setError("Lỗi phía back end!");
      });
  }, [sendTerm, getLocation]);

  return (
    <section className="md:w-[1400px] mx-auto px-4 mt-4 relative">
      {filter && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-[980] ${
            filter ? "block" : "hidden"
          }`}
          onClick={() => setFilter(false)}
        ></div>
      )}

      <main className="flex flex-col md:flex-row gap-4 relative">
        <div className="w-full md:w-[80%]">
          <p className="text-red-500">
            {getLocation} <span>/</span>
            <Link
              className="text-sm opacity-70 text-gray-500 mx-2 hover:text-gray-700"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Link>
          </p>

          <div className="flex justify-end mb-2">
            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => setSendTerm(e.target.value)}
            >
              <option value="">Mới nhất</option>
              <option value="decrease">Giá giảm dần</option>
              <option value="increase">Giá tăng dần</option>
              <option value="az">Tên A - Z</option>
              <option value="za">Tên Z - A</option>
            </select>
          </div>

          <div
            onClick={() => setFilter((prev) => !prev)}
            className="md:hidden block bg-white w-[100px] -mt-[30px] cursor-pointer hover:bg-slate-200"
          >
            <span className="flex gap-x-2 items-center justify-center">
              Lọc <CiFilter />
            </span>
          </div>

          {error && <div>{error}</div>}

          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
            {getProducts.map((e, index) => (
              <li key={index} className="group">
                <Link
                  className="bg-white p-3 flex flex-col items-center text-base"
                  to={`/item/detail/${encodeURIComponent(e.slug)}`}
                  state={{ id: e.product_id }}
                >
                  <img
                    className="w-[80px] sm:w-[120px] md:w-[180px] h-auto object-cover"
                    src={`/Images/x/${e.product_image}`}
                    alt=""
                  />

                  <p className="text-center mt-2">
                    <strong className="group-hover:text-red-500 max-w-[250px] inline-block truncate">
                      {e.product_name}
                    </strong>
                    <span className="flex justify-center text-yellow-500">
                      <CiStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                    </span>
                    <span className="text-red-500">
                      {e.product_price.toLocaleString()}
                      <sub>đ</sub>
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel lọc */}
        <div
          className={`bg-white p-3 border rounded md:w-[20%] md:block ${
            filter
              ? "fixed top-0 right-0 h-[100vh] w-[50vw] shadow-lg z-[999]"
              : "hidden"
          }`}
        >
          <p className="text-center font-bold text-2xl py-4 md:hidden">
            Lọc <b className="text-red-500">{0} </b>
            <hr className="py-2 mt-2" />
          </p>
          <span className="mb-3">Màu sắc</span>
          {colors.slice(0, last).map((e) => (
            <p key={e.id} className="flex items-center space-x-2 mb-2">
              <input
                className="w-[20px] h-[20px] rounded border border-gray-300"
                id={e.id}
                type="checkbox"
              />
              <span>{e.name}</span>
            </p>
          ))}
          <div className="text-red-500 font-semibold cursor-pointer ">
            <span
              onClick={() => {
                setStateColor(true);
                setLast(6);
              }}
              className={`flex gap-x-2 items-center ${
                stateColor === false ? "block" : "hidden"
              }`}
            >
              Xem thêm <IoIosArrowDown />
            </span>
            <br />
            <span
              onClick={() => {
                setStateColor(false);
                setLast(4);
              }}
              className={`flex items-center gap-x-2 ${
                stateColor === false ? "hidden" : "block"
              }`}
            >
              Thu gọn <IoIosArrowUp />
            </span>
          </div>
          <hr className="my-4" />
          Giá:
          {prices.map((e) => (
            <p key={`${e.id}-2`} className="flex items-center space-x-2 mb-2">
              <input
                onChange={() => setOption(e.price)}
                className="w-[20px] h-[20px] rounded border border-gray-300"
                name="priceOption"
                value={e.price}
                id={`price-${e.id}`}
                type="radio"
              />
              <label
                htmlFor={`price-${e.id}`}
                className="font-semibold cursor-pointer"
              >
                {e.price === 1000000
                  ? "Dưới " + e.price
                  : e.price === 2000000
                    ? "2.000.000 - 3.000.000"
                    : e.price === 3000000
                      ? "3.000.000 - 4.000.000"
                      : e.price === 4000000
                        ? "4.000.000 - 5.000.000"
                        : e.price === 5000000
                          ? "Trên 5.000.000"
                          : ""}
              </label>
            </p>
          ))}
        </div>
      </main>
    </section>
  );
}
