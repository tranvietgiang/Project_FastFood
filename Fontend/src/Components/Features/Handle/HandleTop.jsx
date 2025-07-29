import { IoIosArrowUp } from "react-icons/io";

export default function HandleTop() {
  function onArrowUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div
        className="fixed top-[70%] right-[20px] bg-red-500 rounded-full w-[40px] h-[40px] p-2 hover:bg-red-600 cursor-pointer flex items-center justify-center"
        onClick={onArrowUp}
      >
        <IoIosArrowUp className="text-base text-white" />
      </div>
    </>
  );
}
