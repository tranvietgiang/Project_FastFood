import GetProducts from "../../Features/GetProducts/GetProducts";
import axios from "axios";
import { useEffect, useState } from "react";
export default function ProductRelated({ idDetailRelated }) {
  const [getProducts, setGetProducts] = useState([]);

  useEffect(() => {
    if (!idDetailRelated) {
      return;
    }

    axios
      .get(
        `http://localhost:8000/api/products/related/by-id/${idDetailRelated}`
      )
      .then((res) => {
        setGetProducts(res.data);
      })
      .catch((error) => {
        console.log("Error_Product_related:", error);
        setGetProducts([]);
      });
  }, [idDetailRelated]);

  return (
    <>
      <div>
        <h1 className="font-semibold text-2xl mt-10 mb-3 md:text-[40px] text-center md:mt-[120px] md:mb-[80px]">
          Sản phẩm đã xem
        </h1>
        {/* Grid đặc biệt */}
        <div className="flex overflow-x-auto pb-4 justify-between">
          <div className="w-full px-4">
            <ul className="flex min-w-max justify-between space-x-5 sm:space-x-8 sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-4 xl:grid xl:grid-cols-4 2xlg:grid 2xl:grid-cols-4 gap-4 gap-y-[20px]">
              <GetProducts
                products={getProducts}
                className="min-w-[250px] flex-shrink-0 mx-2 sm:mx-4"
              />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
