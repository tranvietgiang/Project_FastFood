import axios from "axios";
import { useEffect, useState } from "react";
import GetProducts from "../Features/GetProducts/GetProducts";
import HandleMessage from "../Features/Handle/HandleMessage";

export default function Section_4() {
  const [getProduct, setProduct] = useState([]);
  useEffect(() => {
    const product_cache = localStorage.getItem("cache_products4");
    if (product_cache) {
      setProduct(JSON.parse(product_cache));
    }

    axios
      .get("http://localhost:8000/api/showAll/section4")
      .then((res) => {
        setProduct(res.data);
        localStorage.setItem("cache_products4", JSON.stringify(res.data));
      })
      .catch((e) => {
        setProduct([]);
        console.log("Error", e);
      });
  }, []);

  useEffect(() => {});

  return (
    <>
      <section className="md:w-[1400px] mx-auto mt-4">
        <div>
          <h1 className="md:text-[50px] text-[25px] font-bold md:font-semibold text-center py-5">
            Chào ngày mới
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10 w-full px-4 mt-4 items-center md:items-start">
          <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-x-10 gap-y-3">
            <GetProducts products={getProduct} />
          </ul>

          <div>
            <img
              className="object-cover md:w-[300px] md:h-auto  md:block hidden"
              src="/Images/index/index_slider_6.webp"
              alt=""
            />
          </div>
        </div>

        <HandleMessage />
      </section>
    </>
  );
}
