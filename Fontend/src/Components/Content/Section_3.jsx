import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { IoIosOptions } from "react-icons/io";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Section_3() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [statePage, setStatePage] = useState("");
  const [termData, setTermData] = useState("Mì ý");

  useEffect(() => {
    if (!termData) return;
    axios
      .get(`http://localhost:8000/api/getProduct3?termData=${termData}`)
      .then((res) => {
        setProducts(res.data.products);
        setStatePage(res.data.message);
        setError("");
      })
      .catch((e) => {
        setProducts([]);
        setStatePage("");
        console.log("Error", e);
      });
  }, [termData]);

  return (
    <>
      <section className="container mx-auto mt-4  bg-white mb-5 rounded-sm">
        <div>
          <h1 className="text-[45px] font-bold text-center mb-5 py-4">
            Gợi ý cho bạn
          </h1>
          <p className="flex space-x-14 items-center justify-center text-2xl text-red-500 cursor-pointer">
            <span
              onClick={() => setTermData("Mì ý")}
              className={statePage === "1" ? "font-bold" : ""}
            >
              Mi Ý
            </span>
            <span
              onClick={() => setTermData("Bugger")}
              className={statePage === "2" ? "font-bold" : ""}
            >
              Bugger
            </span>
            <span
              onClick={() => setTermData("Pizza")}
              className={statePage === "3" ? "font-bold" : ""}
            >
              Pizza
            </span>
          </p>
          <div className="border-b-2 border-gray-200 pd-4 mt-5"></div>

          <div className="">
            {error && <div>{error}</div>}
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-5 p-4 place-items-center">
              {products.map((e) => {
                return (
                  <>
                    <li key={e.product_id} className="group">
                      <Link
                        to="#"
                        className="flex items-center justify-center space-x-5"
                      >
                        <img
                          className="sm:w-[80px] md:w-[120px] lg:w-[150px] h-auto object-cover inline"
                          src="/Images/MiY/product-image-1.jpg"
                          alt=""
                        />

                        <p>
                          <strong className="group-hover:text-red-500">
                            {e.product_name}
                          </strong>
                          <span className="flex">
                            <CiStar />
                            <CiStar />
                            <CiStar />
                            <CiStar />
                            <CiStar />
                          </span>
                          <span className="text-red-500">
                            {e.product_price} <sub>đ</sub>
                          </span>
                        </p>
                      </Link>
                    </li>

                    <span className="bg-red-200 p-4 px-2 w-[30px] text-2xl h-[30px]  flex justify-center items-center rounded-full hover:bg-red-600 cursor-pointer">
                      <IoIosOptions />
                    </span>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
