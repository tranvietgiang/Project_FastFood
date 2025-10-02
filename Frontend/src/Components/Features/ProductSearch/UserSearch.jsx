import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginate } from "../Paginate/Paginate";
import GetProducts from "../GetProducts/GetProducts";

export default function UserSearch() {
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const termSearch = location.state?.searchTemp;
  const selectedHistory = location.state?.dataHistory;

  const itemsPerPage = 10;

  const lastPage = Math.ceil(userInput.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userInput.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!termSearch || termSearch.trim() === "") return;

    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/userInput?input=${encodeURIComponent(
          termSearch
        )}`
      )
      .then((res) => {
        setUserInput(res.data || []);
        setCurrentPage(1); // Reset to first page on new search
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
        setUserInput(res.data || []);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((e) => {
        setUserInput([]);
        setLoading(false);
        console.error("Error history term:", e);
      });
  }, [selectedHistory, navigate]);

  useEffect(() => {
    if (currentPage < 1) {
      setCurrentPage(1);
    } else if (currentPage > lastPage && lastPage > 0) {
      setCurrentPage(lastPage);
    }
  }, [currentPage, lastPage]);

  return (
    <section className="md:w-[1400px] mx-auto m-[50px] relative z-30">
      {loading ? (
        <div className="text-center flex justify-center mt-[100px]">
          <ClipLoader size={40} color="#36d7b7" loading={loading} />
        </div>
      ) : (
        <p className="font-bold text-2xl bg-white w-[100%] h-[100%] text-center p-5 mt-[5px] mr-[0] mb-[10px] ml-[0]">
          Kết quả tìm kiếm: "{termSearch || selectedHistory}"
        </p>
      )}

      <ul className="grid grid-cols-2 place-items-center gap-5 md:grid md:grid-cols-5">
        <GetProducts products={currentItems} />
      </ul>

      {lastPage > 0 && (
        <Paginate
          currentPage={currentPage}
          lastPage={lastPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </section>
  );
}
