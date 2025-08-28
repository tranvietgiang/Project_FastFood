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
        <h2 className="text-[35px] font-bold text-center mt-[100px] mb-[100px]">
          Sản phẩm liên quan
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-3 sm:grid-cols-2 rounded-lg  place-items-center">
          <GetProducts products={getProducts} />
        </ul>
      </div>
    </>
  );
}
