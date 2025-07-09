import { useState } from "react";
import { Link } from "react-router-dom";

const menuCall = [
  {
    title: "nt phone",
    image: "Images/Call_center/addthis-phone.svg",
  },
  {
    title: "nt zalo",
    image: "Images/Call_center/addthis-zalo.svg",
  },
  {
    title: "nt messenger",
    image: "Images/Call_center/addthis-messenger.svg",
  },
];
export default function Call_center() {
  const [hidden, setHidden] = useState(true);

  function handleHidden() {
    setHidden((prev) => !prev);
  }

  return (
    <>
      <section className="fixed top-[80%] right-[30px]">
        <div className="bg-red-500 w-[45px] h-[45px] rounded-full flex justify-center items-center">
          <img
            onClick={handleHidden}
            className="w-[35px] h-[35px] cursor-pointer hover:scale-110 transition-transform duration-300"
            src="/Images/Call_center/call-center.webp"
            alt=""
          />
        </div>
        <ul
          className={`${
            hidden
              ? "opacity-0 mt-[0px] overflow-hidden"
              : "opacity-100 scale-100 mt-[-210px] space-y-4 transition-all duration-700 ease-in-out"
          }`}
        >
          {menuCall.map((e, i) => (
            <li key={i}>
              <Link to="#">
                <img
                  className="w-[40px] h-[40px] object-contain"
                  src={e.image}
                  alt={e.title}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
