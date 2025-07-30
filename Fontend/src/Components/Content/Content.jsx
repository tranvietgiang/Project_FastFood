import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Section_1 from "./Section_1";
import Section_2 from "./Section_2";
import Section_3 from "./Section_3";

export default function Content() {
  return (
    <>
      <section>
        <div className="relative w-full group">
          <p className="">
            <img
              className="object-cover w-full"
              src="/Images/index/index_slider_1.webp"
              alt=""
            />
          </p>
          <p className="text-2xl font-normal absolute inset-0 z-10 text-transparent flex justify-between w-full p-3 items-center opacity-0 group-hover:opacity-100 group-hover:text-white duration-300 transition-colors">
            <button className="bg-white/30 rounded-full p-2 hover:bg-white/60">
              <FaChevronLeft className="text-white" />
            </button>
            <button className="bg-white/30 rounded-full p-2 hover:bg-white/60">
              <FaChevronRight className="text-white" />
            </button>
          </p>
        </div>
      </section>

      <Section_1 />
      <Section_2 />
      <Section_3 />
    </>
  );
}
