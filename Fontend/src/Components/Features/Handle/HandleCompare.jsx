import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HandleCompare({ isOpen, setOpen, productId }) {
  const [getProduct, setGetProduct] = useState([]);
  const [errorCompare, setErrorCompare] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!productId) return;

    setErrorCompare("");

    setUserId(1);
    axios
      .get(`http://localhost:8000/api/products/add-compare/by-id/${productId}`)
      .then((res) => {
        setGetProduct(res.data);
      })
      .catch((e) => {
        console.log("Error", e);
        setErrorCompare("Bạn chỉ có thể so sánh sản phẩm trong cùng danh mục!");
        setTimeout(() => {
          setErrorCompare("");
        }, 4000);
      });
  }, [productId]);

  // xoá 1 sp
  const handleRemove = (productId, userId) => {
    axios
      .get(
        `http://localhost:8000/api/products/delete-compare/by-id/${productId}/${userId}`
      )
      .then((res) => {
        setGetProduct(res.data);
      })
      .catch((e) => {
        console.log("Error", e);
        setGetProduct([]);
      });
  };

  const HandleRemoveAll = (userId) => {
    axios
      .get(
        `http://localhost:8000/api/products/delete-compare-all/by-id/${userId}`
      )
      .then(() => {
        localStorage.removeItem("cache_productCompare");
        setGetProduct([]);
      })
      .catch((e) => {
        console.log("Error", e);
        setGetProduct([]);
      });
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[900] ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {errorCompare != "" && (
          <div className="bg-white absolute top-0 right-[100px] text-red-600 font-bold">
            {errorCompare}
          </div>
        )}
        <div
          className="bg-white rounded-t-lg shadow-lg w-full md:w-[1200px] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            {getProduct.map((e) => (
              <li key={e.product_id} className="relative border rounded-lg p-3">
                <button
                  className="absolute top-2 right-2 text-gray-500"
                  onClick={() => handleRemove(e.product_id, userId)}
                >
                  <IoCloseOutline className="hover:text-red-500 md:text-lg" />
                </button>
                <Link
                  className="text-sm font-semibold text-center"
                  to={`/item/detail/${encodeURIComponent(e.slug)}`}
                  state={{ id: e.product_id }}
                >
                  <img
                    className="w-20 h-20 object-contain mb-2  mx-auto"
                    src={`/Images/x/${e?.product_image}`}
                  />
                  <p className="truncate max-w-[350px]">{e.product_name}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <Link to={`/compare/ingredients`} state={{ id: userId }}>
              <button className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white">
                So sánh ngay
              </button>
            </Link>
            <button
              onClick={() => HandleRemoveAll(userId)}
              className="px-4 py-2 text-gray-600 hover:text-black underline"
            >
              Xoá tất cả sản phẩm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
