import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TiTickOutline } from "react-icons/ti";
import { CiShoppingCart } from "react-icons/ci";
import { Paginate } from "../Paginate/Paginate";

export default function UserSearch() {
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const termSearch = location.state?.searchTemp;
  const selectedHistory = location.state?.dataHistory;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (!termSearch || termSearch.trim() === "") return;

    console.log(termSearch);
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/userInput?input=${encodeURIComponent(
          termSearch
        )}`
      )
      .then((res) => {
        setUserInput(res.data.data);
        setLastPage(res.last_page);
        setLoading(false);
      })
      .catch((e) => {
        setUserInput([]);
        setLoading(false);
        console.error("Error:", e);
      });
  }, [termSearch, navigate]);

  useEffect(() => {
    if (!selectedHistory || selectedHistory.trim() === "") return;

    setLoading(true);

    axios
      .get(
        `http://localhost:8000/api/product/history/${encodeURIComponent(
          selectedHistory
        )}`
      )
      .then((res) => {
        setUserInput(res.data.data);
        setLastPage(res.last_page);
        setLoading(false);
      })
      .catch((e) => {
        setUserInput([]);
        setLoading(false);

        console.error("Error history term:", e);
      });
  }, [selectedHistory, navigate]);

  return (
    <>
      <section className="container mx-auto m-[50px]">
        {(loading && (
          <div className="text-center flex justify-center mt-[100px]">
            <ClipLoader size={40} color="#36d7b7" loading={loading} />
          </div>
        )) || (
          <p className="font-bold text-2xl bg-white w-[100%] h-[100%] text-center p-5 mt-[5px] mr-[0] mb-[10px] ml-[0]">
            Kết quả tìm kiếm:
          </p>
        )}

        <ul className="grid grid-cols-5 gap-5  ">
          {userInput.map((e) => (
            <li
              key={e.product_id}
              className="w-full group block relative overflow-hidden border p-2 rounded shadow hover:shadow-lg transition"
            >
              <MdOutlineRemoveRedEye className="absolute top-2 right-1 text-xl opacity-0 border border-black group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none" />

              <Link to="#">
                <img
                  src={`/Images/MiY/${e.product_image}`}
                  className="mx-auto object-cover w-[173px] h-[173px]"
                  alt=""
                />
                <h3 className="font-bold mt-2">{e.product_name}</h3>
                <p>
                  Giá:
                  <span className="text-red-500 font-bold">
                    {e.product_price} <sub>đ</sub>
                  </span>
                </p>
                <p className="flex">
                  <span>Trạng thái:</span>
                  {e.product_quantity > 0 ? (
                    <span className="text-green-500 flex">
                      <TiTickOutline />
                      Có sẵn
                    </span>
                  ) : (
                    <span className="text-red-500">Hết hàng</span>
                  )}
                </p>
                <p className="truncate max-w-[250px]">
                  Mô tả:12321321321321321213213 {e.product_desc}
                </p>
              </Link>
              <button className="hover:bg-orange-500 border border-black text-center p-2 flex">
                Đặt ngay <CiShoppingCart />
              </button>
            </li>
          ))}
        </ul>
        {lastPage && (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            last_page={lastPage}
          />
        )}
      </section>
    </>
  );
}
