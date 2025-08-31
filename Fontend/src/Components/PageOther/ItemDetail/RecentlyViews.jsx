import { useEffect, useState, useRef } from "react";
import axios from "axios";
import GetProducts from "../../Features/GetProducts/GetProducts";

export default function RecentlyViews({ idViewRecently }) {
  const [getProduct, setGetProducts] = useState([]);
  const listRef = useRef(null);
  const scroll = (distance) => {
    listRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };
  useEffect(() => {
    if (!idViewRecently) {
      return;
    }

    axios
      .get(
        `http://localhost:8000/api/products/view-recently/by-id/${idViewRecently}`
      )
      .then((res) => {
        setGetProducts(res.data);
      })
      .catch((error) => {
        setGetProducts([]);
        console.log("Error", error);
      });
  }, [idViewRecently]);

  return (
    <>
      <div className="relative text-center">
        <h1 className="font-semibold text-2xl mt-10  mb-3 md:text-[40px] text-center md:mt-[120px] md:mb-[80px]">
          Sản phẩm đã xem
        </h1>
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full md:hidden"
          onClick={() => scroll(-200)}
        >
          ◀
        </button>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full md:hidden"
          onClick={() => scroll(200)}
        >
          ▶
        </button>

        <ul
          ref={listRef}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
          className="flex place-content-center place-items-center gap-2 overflow-x-auto scroll-smooth mt-[20px] md:mt-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-x-visible cursor-grab"
        >
          <GetProducts products={getProduct} />
        </ul>
      </div>
    </>
  );
}
