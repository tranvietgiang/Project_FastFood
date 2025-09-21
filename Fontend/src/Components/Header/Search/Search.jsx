import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronDown } from "lucide-react";
import { FaHistory } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
const popularKeywords = ["pizza", "burger", "gà rán", "combo"];

export default function SearchComponent({
  onClose,
  historySearch,
  setHistorySearch,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cate, setCate] = useState([]);
  const [selectCate, setSelectCate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedCate, setSelectedCate] = useState(null);

  function onChangeCate(e) {
    const value = e.target.textContent;

    setSelectCate(value);
    navigate("/productByCate", { state: { selectedCate: value } });
  }

  useEffect(() => {
    const cache_search_cate = localStorage.getItem("cache_search_cate");
    if (cache_search_cate) {
      setCate(JSON.parse(cache_search_cate));
    }

    setLoading(true);
    axios
      .get("http://localhost:8000/api/getCate")
      .then((res) => {
        setCate(res.data);
        localStorage.setItem("cache_search_cate", JSON.stringify(res.data));
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error", e);
        setCate([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSearch() {
    if (searchTerm.trim() === "") {
      setError("Vui lòng nhập tên sản phẩm...");
      return;
    }

    setError("");

    setTimeout(() => {
      saveHistorySearch();

      navigate("/userSearch", { state: { searchTemp: searchTerm } });
    }, 1000);

    setSearchTerm("");
  }

  function saveHistorySearch() {
    axios
      .post("http://localhost:8000/api/history", { history: searchTerm })
      .then((res) => setHistorySearch(res.data || []))
      .catch((e) => console.log("Error", e));
  }

  function handleDelete(e) {
    axios
      .delete(`http://localhost:8000/api/delete/${encodeURIComponent(e)}`)
      .then((res) => {
        setHistorySearch(res.data);
      })
      .catch((e) => {
        if (e.status === "500") {
          navigate("/notFile");
        } else {
          console.log("Error", e);
        }
      });
  }

  function handleHistory(event) {
    const data = event.target.textContent;

    fetch(`http://localhost:8000/api/historySearch/${encodeURIComponent(data)}`)
      .then(async (res) => {
        if (res.status === 404) {
          navigate("/notFile");
          return;
        }
        navigate("/userSearch", { state: { dataHistory: data } });
      })
      .catch((e) => console.log("error", e));
  }

  return (
    <section className="h-[100vh] w-[350px] fixed top-0 right-0 bg-white shadow-lg z-[800]">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ChevronLeft
            onClick={onClose}
            className="w-6 h-6 text-gray-600 cursor-pointer"
          />
          <h2 className="text-xl font-semibold text-gray-800">Tìm kiếm</h2>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">
              {(loading && (
                <div className="flex justify-center items-center ">
                  <ClipLoader size={25} color="#36d7b7" loading={loading} />
                </div>
              )) ||
                selectCate ||
                "Select Cate"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {cate.map((e, i) => (
                <button
                  key={i}
                  onClick={(event) => {
                    const clickedText = event.currentTarget.textContent.trim();

                    if (clickedText !== e) {
                      console.log(e, clickedText);
                      navigate("/notFile");
                      return;
                    }

                    setSelectedCate(i); // lưu index đang chọn
                    onChangeCate(event);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors
                  ${selectedCate === i ? "bg-gray-200" : "hover:bg-gray-50"}
                  first:rounded-t-lg last:rounded-b-lg`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={error || "Tìm theo tên sản phẩm..."}
            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 p-2 rounded-md hover:bg-red-600 transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {historySearch && (
        <div className="mx-[20px] space-y-2 ">
          {historySearch.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between border hover:bg-gray-300 p-2 rounded"
            >
              <span className="flex items-center gap-2">
                <FaHistory />
                <span
                  className="block w-[calc(310px-80px)]"
                  onClick={(event) => handleHistory(event)}
                >
                  {e.history_search_name}
                </span>
              </span>
              <IoCloseSharp
                onClick={() => handleDelete(e.history_search_id)}
                className="cursor-pointer text-gray-500 hover:text-black"
              />
            </div>
          ))}
        </div>
      )}

      {/* Popular Keywords */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          Từ khóa phổ biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularKeywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(keyword)}
              className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm hover:bg-orange-200 transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="flex-1 p-4">
        {searchTerm ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Tìm kiếm "{searchTerm}"</p>
              <p className="text-sm mt-1">Nhấn enter để tìm kiếm</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-2" />
              <p>Nhập từ khóa để tìm kiếm</p>
              <p className="text-sm mt-1">Tìm món ăn yêu thích của bạn</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
