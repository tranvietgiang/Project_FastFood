import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CompareIngredients() {
  const location = useLocation();
  const user_id = location.state?.id ?? null;
  const [getProducts, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user_id) return;

    const cache = localStorage.getItem("cache_compareIngredients");
    if (cache) {
      setProducts(JSON.parse(cache));
    }
    axios
      .get(
        `http://localhost:8000/api/products/compare-ingredients/by-id/${user_id}`
      )
      .then((res) => {
        if (user_id) {
          setProducts(res.data);
          localStorage.getItem(
            JSON.stringify(res.data, "cache_compareIngredients")
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 410) {
          navigate(-1);
        }
        setProducts([]);
        console.log("e", e);
      });
  }, [user_id, navigate]);

  useEffect(() => {
    if (user_id) return; // chỉ chạy khi KHÔNG login (guest)

    const compare = JSON.parse(localStorage.getItem("compare_guest")) ?? [];
    if (compare.length == 0) {
      setProducts([]);
      return;
    }

    const cache = localStorage.getItem("cache_compareNotIngredients");
    if (cache) {
      setProducts(JSON.parse(cache));
    }

    axios
      .post("http://localhost:8000/api/products/compare-list-guest", {
        ids: compare,
      })
      .then((res) => {
        setProducts(res.data);
        localStorage.setItem(
          "cache_compareNotIngredients",
          JSON.stringify(res.data)
        );
      })
      .catch((e) => {
        setProducts([]);
        console.log("e", e);
      });
  }, [user_id]);

  // xoá 1 sp
  const handleRemove = (productId, userId) => {
    if (!productId && !userId) return;

    axios
      .delete(`http://localhost:8000/api/products/delete-compare/by-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        data: {
          productId,
          userId,
        },
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch(() => {
        setProducts([]);
      });
  };

  return (
    <>
      <section className="max-w-[1400px] mx-auto mt-6">
        <div className="font-semibold mb-2">
          <Link onClick={() => navigate(-1)}> Quay lại</Link> /
          <span className="mx-[10px] opacity-50">So sánh sản phẩm</span>
        </div>
        <div className="bg-white p-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-center rounded-md">
          {getProducts.map((e, index) => (
            <div key={index} className="p-3 border rounded-md relative">
              <img
                className="mx-auto w-[150px] md:w-[220px] h-auto object-cover rounded-md"
                src={`/Images/x/${e.product_image}`}
                alt="Tên sản phẩm"
              />
              {getProducts.length > 1 && (
                <button
                  onClick={() => {
                    handleRemove(e.product_id, user_id);
                  }}
                  className="absolute top-2 right-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full p-1"
                >
                  ✕
                </button>
              )}
              {e.percent_name > 0 && (
                <span className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded top-2 left-2">
                  -20%
                </span>
              )}
              <h3 className="mt-3 font-semibold text-red-500 text-lg truncate">
                {e.product_name ?? ""}
              </h3>

              {e.percent_name > 0 ? (
                <p className="text-gray-400 line-through text-sm">
                  {Number(e.product_price).toLocaleString()}đ
                </p>
              ) : (
                <p className="text-red-500 text-lg font-bold">
                  {Number(e.product_price).toLocaleString()}đ
                </p>
              )}

              {e.percent_name && (
                <p className="text-xl font-bold text-red-600">
                  {Number(
                    e.product_price * (1 - e.percent_name / 100)
                  ).toLocaleString()}
                  đ
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bảng so sánh */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-center">
            <tbody>
              {/* Loại sản phẩm */}
              {/* <tr>
                <td className="font-bold p-2 text-left">Loại sản phẩm</td>
                {getProducts.map((e, index) => (
                  <td key={index} className="p-2 border">
                    {e.category_name ?? "—"}
                  </td>
                ))}
              </tr> */}

              {/* Biến thể */}
              <tr className="bg-gray-100">
                <td className="font-bold p-2 text-left">Biến thể</td>
                {getProducts.map((e, index) => (
                  <td key={index} className="p-2 border">
                    {e.variant ?? "—"}
                  </td>
                ))}
              </tr>

              {/* Thông số kỹ thuật */}
              <tr>
                <td className="font-bold p-2 text-left">Thông số kỹ thuật</td>
                {getProducts.map((e, index) => (
                  <td key={index} className="p-2 border">
                    {e.specs ?? "—"}
                  </td>
                ))}
              </tr>

              {/* Mô tả */}
              <tr className="bg-gray-100">
                <td className="font-bold p-2 text-left">Mô tả</td>
                {getProducts.map((e, index) => (
                  <td key={index} className="p-2 border text-gray-600 text-sm">
                    {e.product_desc != "" ? e.product_desc : "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
