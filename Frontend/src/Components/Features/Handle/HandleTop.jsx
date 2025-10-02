import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useLocation } from "react-router-dom";

export default function HandleTop() {
  const [isHidden, setIsHidden] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function onArrowUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div
        className={`fixed top-[70%] right-[20px] bg-red-500 rounded-full w-[40px] h-[40px] p-2 hover:bg-red-600 cursor-pointer flex items-center justify-center z-[999]  ${
          isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={onArrowUp}
      >
        <IoIosArrowUp className="text-base text-white" />
      </div>
    </>
  );
}
