import { RiErrorWarningLine } from "react-icons/ri";

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import HandleCopy from "../Features/Handle/HandleCopy";

const section_1 = [
  { img: "chicken_1.png", name: "Gà rán" },
  { img: "MiY.webp", name: "Mì ý" },
  { img: "Pizza.webp", name: "Pizza" },
  { img: "rice.webp", name: "Cơm" },
  { img: "salad.webp", name: "Salad" },
  { img: "cake.png", name: "Bánh" },
];

export default function Section_1() {
  const [getCoupon, setCoupon] = useState([]);
  const [error, setError] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [copied, setCopied] = useState("");
  const [textCopy, setTextCopy] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/getCoupon")
      .then((res) => {
        setCoupon(res.data);
        setError("");
      })
      .catch((e) => {
        console.log("error", e);
        setError("Phiếu giảm giá đang bị lỗi, xin lỗi bạn");
      });
  }, []);
  return (
    <>
      <section className="container mx-auto mt-4 px-4">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl">
          Lựa chọn thực đơn
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-8 place-items-center mt-12 mb-16">
          {section_1.map((e, i) => (
            <a className="group" href="#" key={i}>
              <div className="text-center">
                <span className="relative inline-block w-[160px] h-[160px]">
                  <div className="absolute inset-0 border-[3px] border-dashed border-gray-300 rounded-full group-hover:border-orange-400 group-hover:animate-spin group-hover:[animation-duration:6s] group-hover:[animation-timing-function:linear]"></div>
                  <img
                    className="relative w-full h-full object-cover rounded-full p-4"
                    src={`/Images/Section1/${e.img}`}
                    alt={e.name}
                  />
                </span>
                <span className="mt-4 inline-block font-semibold group-hover:text-orange-400 duration-300 transition-colors">
                  {e.name}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/*Coupon*/}
        <div className="Coupon">
          {/* Breakpoint	Áp dụng class
              Mobile (<640px)	grid-cols-2
              sm (≥640px)	grid-cols-3
              md (≥768px)	grid-cols-4
              lg (≥1024px)	grid-cols-6 */}

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4">
            {error && <h2 className="text-center">{error}</h2>}

            {getCoupon.map((e) => {
              const coupon = new Date(e.created_at).toLocaleDateString();
              const dayPresent = new Date().toLocaleDateString();

              return (
                <li className="">
                  <p className="flex space-x-4 max-w-80 bg-red-200 rounded-md p-2">
                    <span className="flex items-center font-bold">
                      RTL{e.coupon_id}
                    </span>
                    <span className="text-sm">
                      {" "}
                      <p className="flex items-center gap-1 text-red-500 font-bold">
                        <RiErrorWarningLine /> điều kiện
                      </p>
                      {e.coupon_name}
                      <span className="opacity-50 block">{coupon}</span>
                      {copiedText && (
                        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 mt-[300px] py-2 rounded-md shadow-md z-[9999] text-center text-sm">
                          {copiedText}
                        </div>
                      )}
                      {copied && (
                        <HandleCopy
                          text={copied}
                          setCopiedText={setCopiedText}
                        />
                      )}
                      <div className="flex justify-end group">
                        {coupon >= dayPresent ? (
                          <span
                            onClick={() => {
                              setCopied(e.coupon_id);
                              setTextCopy(true);

                              setTimeout(() => {
                                setTextCopy(false);
                              }, 2000);
                            }}
                            className="bg-red-600 text-white p-1 rounded-md group-hover:bg-red-700 cursor-pointer"
                          >
                            {textCopy ? "đã sao chép" : "sao chép"}
                          </span>
                        ) : (
                          <span className="bg-white/30 text-black p-1 rounded-md group-hover:bg-white/100 cursor-not-allowed">
                            Hết Hạn
                          </span>
                        )}
                      </div>
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
