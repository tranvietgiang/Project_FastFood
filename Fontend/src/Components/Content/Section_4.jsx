import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import axios from "axios";
import { useEffect, useState } from "react";

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
  return (
    <>
      <section className="md:w-[1400px] mx-auto  mt-4">
        <div>
          <h1 className="md:text-[50px] text-lg font-bold md:font-semibold text-center py-5">
            Chào ngày mới
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full px-4 mt-4">
          <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-x-2 gap-y-3">
            {getProduct.map((e, i) => (
              <li key={i} className="group">
                <Link
                  state={{ id: e.product_id }}
                  className="bg-white p-5 flex flex-col items-center text-base rounded-md"
                  to={`/item/detail/${encodeURIComponent(e.slug)}`}
                >
                  <img
                    className="sm:w-[120px] md:w-[250px] md:h-auto object-cover h-[120px] w-auto"
                    src={`/Images/x/${e.product_image}`}
                    alt=""
                  />

                  <p className="text-center mt-2">
                    <strong className="group-hover:text-red-500 truncate inline-block max-w-[200px]">
                      {e.product_name}
                    </strong>
                    <span className="flex justify-center text-yellow-500">
                      <CiStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                    </span>
                    <span className="text-red-500">
                      {e.product_price.toLocaleString()}
                      <sub>đ</sub>
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div>
            <img
              className="object-cover md:w-full md:h-auto w-[500px] md:block hidden"
              src="/Images/index/index_slider_6.webp"
              alt=""
            />
          </div>
        </div>
      </section>
    </>
  );
}
