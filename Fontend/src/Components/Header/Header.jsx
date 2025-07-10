import { FaRegUserCircle } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import SearchComponent from "./Search/Search";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Header() {
  const [showSearch, setShowSearch] = useState(false);

  const openSearch = () => setShowSearch(true);
  const closeSearch = () => setShowSearch(false);
  const [historySearch, setHistorySearch] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/history-list")
      .then((res) => setHistorySearch(res.data || []))
      .catch((e) => console.log("Lỗi khi load lịch sử:", e));
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">EGA</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                FOOD
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <Navbar />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 border-[1px] rounded border-red-500 p-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"></div>
              <span className="text-sm font-medium text-red-500">LIVE</span>
            </div>

            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <CiSearch onClick={openSearch} size={24} />
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <FaRegUserCircle size={24} />
            </button>
            <button className="relative text-gray-600 hover:text-gray-800 transition-colors">
              <FaCartArrowDown size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {showSearch && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={closeSearch}
          />
          <SearchComponent
            onClose={closeSearch}
            historySearch={historySearch}
            setHistorySearch={setHistorySearch}
          />
        </>
      )}
    </header>
  );
}

export default Header;
