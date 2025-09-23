import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";
import HandleMessage from "./HandleMessage";
export default function HandleCompare({ isOpen, setOpen, productId }) {
  const [getProduct, setGetProduct] = useState([]);
  const [errorCompare, setErrorCompare] = useState("");
  const [checkCompare, setCheckCompare] = useState(false);
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user")) ?? null;
  const [openMessageHeart, setOpenMessageHeart] = useState(false);
  const [severity, setSeverity] = useState("error");

  let userId = null;
  if (userData) {
    userId = userData.id ?? null;
  }

  const handleCheckCompare = (e) => {
    if (e < 2) {
      setCheckCompare(false);
    } else {
      setCheckCompare(true);
    }
  };

  useEffect(() => {
    handleCheckCompare();
  }, []);

  useEffect(() => {
    if (!productId || !userId || !token) return;
    setErrorCompare("");

    const addToCompare = async () => {
      try {
        const addRes = await axios.post(
          `http://localhost:8000/api/products/add-compare/by-id`,
          { productId, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Sửa header
            },
          }
        );

        const getRes = await axios.get(
          `http://localhost:8000/api/products/get-compare-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const fullData = getRes.data ?? addRes.data;
        setGetProduct(fullData);
        localStorage.setItem("userLogin_compare", JSON.stringify(fullData));

        setCheckCompare(fullData.length >= 2);
      } catch (error) {
        setOpenMessageHeart(true);
        setSeverity("error");
        setErrorCompare(
          error.response?.data?.error || "Lỗi khi thêm vào compare"
        );

        // Refetch list khi fail để giữ UI không trắng
        try {
          const getRes = await axios.get(
            `http://localhost:8000/api/products/get-compare-user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const fullData = getRes.data;
          setGetProduct(fullData);
          localStorage.setItem("userLogin_compare", JSON.stringify(fullData));
          setCheckCompare(fullData.length >= 2);
        } catch (refetchError) {
          console.error("Refetch error:", refetchError);
          setGetProduct([]);
          setCheckCompare(false);
        }
      }
    };

    addToCompare();
  }, [productId, userId, token]);

  useEffect(() => {
    const addCompareGuest = async () => {
      if (!productId || userId) return; // chỉ chạy cho guest

      let compare = JSON.parse(localStorage.getItem("compare_guest")) ?? [];

      if (compare) {
        // Fetch lại toàn bộ danh sách để hiển thị
        fetchGuestCompare(compare);
      }
      try {
        // Lấy sản phẩm mới
        const res = await axios.get(
          `http://localhost:8000/api/products/compare-not-user/${productId}`
        );
        const newProduct = res.data; // giả sử trả về 1 product object
        setCheckCompare(true);

        // Nếu đã có sản phẩm trong compare → check category
        if (compare.length > 0) {
          const firstRes = await axios.get(
            `http://localhost:8000/api/products/compare-not-user/${compare[0]}`
          );
          const firstProduct = firstRes.data;
          let checkCate_id =
            newProduct.selectedProduct.cate_id !=
            firstProduct.selectedProduct.cate_id
              ? true
              : false;
          if (checkCate_id) {
            setOpenMessageHeart(true);
            setSeverity("error");
            setErrorCompare("Chỉ được so sánh sản phẩm cùng danh mục!");
            return;
          }
        } else {
          setCheckCompare(false);
        }

        // Nếu chưa có thì thêm productId vào localStorage
        if (!compare.includes(productId)) {
          compare.push(productId);

          localStorage.setItem("compare_guest", JSON.stringify(compare));
        }

        // Fetch lại toàn bộ danh sách để hiển thị
        fetchGuestCompare(compare);
      } catch (e) {
        console.log("Lỗi khi thêm compare guest:", e);
      }
    };

    addCompareGuest();
  }, [productId, userId]);

  // Hàm fetch danh sách guest compare
  const fetchGuestCompare = async (ids = null) => {
    const compare =
      ids ?? JSON.parse(localStorage.getItem("compare_guest")) ?? [];
    if (compare.length === 0) {
      setGetProduct([]);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/products/compare-list-guest",
        { ids: compare }
      );
      setGetProduct(res.data);
    } catch (e) {
      console.log("Lỗi khi fetch danh sách compare guest:", e);
    }
  };

  // xoá 1 user && user exists
  const handleRemove = (productId, userId) => {
    if (!productId && !userId) return;

    axios
      .delete("http://localhost:8000/api/products/delete-compare/by-id", {
        data: {
          productId,
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setGetProduct(res.data);
        handleCheckCompare(res.data.length);
        localStorage.setItem("userLogin_compare", JSON.stringify(res.data));
      })
      .catch(() => {
        setGetProduct([]);
      });
  };

  useEffect(() => {
    const userLogin_compare = JSON.parse(
      localStorage.getItem("userLogin_compare")
    );

    if (userLogin_compare) {
      setGetProduct(userLogin_compare);
    }
  }, []);

  const HandleRemoveAll = (userId) => {
    if (!userId) return;

    axios
      .delete(
        `http://localhost:8000/api/products/delete-compare-all/by-id/${userId}`
      )
      .then(() => {
        setCheckCompare(false);
        setGetProduct([]);
      })
      .catch(() => {
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
        {/* {errorCompare != "" && (
          <div className="bg-white absolute top-0 right-[100px] text-red-600 font-bold">
            {errorCompare}
          </div>
        )} */}
        <div
          className="bg-white rounded-t-lg shadow-lg w-full md:w-[1200px] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            {getProduct.map((e) => (
              <li key={e.product_id} className="relative border rounded-lg p-3">
                <button
                  className="absolute top-2 right-2 text-gray-500"
                  onClick={() => {
                    if (!!userId && !!token) {
                      handleRemove(e.product_id, userId);
                    } else {
                      handleRemove(e.product_id);
                    }
                  }}
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
              <button
                disabled={!checkCompare}
                className={`border rounded ${!checkCompare ? "bg-gray-500 cursor-not-allowed" : "border-red-500 text-red-500  hover:bg-red-500 hover:text-white"} px-4 py-2  `}
              >
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
        <HandleMessage
          message={errorCompare}
          open={openMessageHeart}
          onClose={() => setOpenMessageHeart(false)}
          severity={severity}
        />
      </div>
    </>
  );
}
