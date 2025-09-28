import { useState } from "react";
import {
  CiCircleChevDown,
  CiCircleChevLeft,
  CiCircleChevRight,
} from "react-icons/ci";
import "./Navbar.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Navbar() {
  const menuItems = [
    { name: "Trang chủ", href: "/fast.foods" },
    { name: "Menu", hasDropdown: true },
    { name: "Chương trình khuyến mãi", hasDropdown: true },
    { name: "Đặt bàn", href: "#" },
    { name: "🤍", href: "/user-heart" },
    { name: "Giới thiệu", href: "#" },
    { name: "Liên hệ", href: "#" },
    { name: "Hướng dẫn thiết lập", href: "#" },
  ];

  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState("right");

  const showItems = 6;

  const handleSliding = menuItems.slice(start, start + showItems);

  const handleNext = () => {
    if (start + showItems < menuItems.length) {
      setDirection("right");
      setStart(start + 1);
    }
  };

  const handlePrev = () => {
    if (start > 0) {
      setDirection("left");
      setStart(start - 1);
    }
  };

  const animation =
    direction === "right" ? "fade-slide-right" : "fade-slide-left";

  return (
    <>
      <nav className="hidden md:flex items-center space-x-6">
        <div key={start} className={`flex space-x-6 ${animation}`}>
          {handleSliding.map((item, index) => (
            <div key={index} className="relation group">
              {item.hasDropdown ? (
                <button className="flex items-center text-gray-700 hover:text-red-500 transition-colors">
                  {item.name} <CiCircleChevDown className="ml-1" />
                </button>
              ) : (
                <a
                  className="flex items-center text-gray-700 hover:text-red-500 transition-colors"
                  href={item.href}
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </div>

        {/*button move sliding */}
        <div className="flex space-x-2 items-center">
          <button
            onClick={handlePrev}
            className={
              start === 0
                ? "text-gray-400"
                : "text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
            }
            disabled={start === 0}
          >
            <CiCircleChevLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={start + showItems >= menuItems.length}
            className={
              start + showItems >= menuItems.length
                ? "text-gray-400"
                : "text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
            }
          >
            <CiCircleChevRight size={20} />
          </button>
        </div>
      </nav>
    </>
  );
}
