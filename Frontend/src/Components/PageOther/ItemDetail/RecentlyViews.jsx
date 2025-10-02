import { useEffect, useState } from "react";
import axios from "axios";
import GetProducts from "../../Features/GetProducts/GetProducts";

export default function RecentlyViews({ idViewRecently }) {
  const [getProduct, setGetProducts] = useState([]);

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
      <div>
        <h1 className="font-semibold text-2xl mt-10 mb-3 md:text-[40px] text-center md:mt-[120px] md:mb-[80px]">
          Sản phẩm đã xem
        </h1>
        {/* Grid đặc biệt */}
        <div className="flex overflow-x-auto gap-4 pb-4">
          <div className="w-full px-4">
            <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 gap-y-[20px]">
              <GetProducts
                products={getProduct}
                className="2xl:min-w-[250px] 2xl:flex-shrink-0 2xl:mx-2 2xl:sm:mx-4"
              />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
