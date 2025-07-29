import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

export default function CateSearch() {
  const [cate, setCate] = useState([]);
  const [nameCate, setNameCate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const selectedCate = location.state?.selectedCate;
  const navigate = useNavigate();

  // Lấy tên danh mục từ localStorage
  useEffect(() => {
    if (selectedCate) {
      setNameCate(selectedCate);
    }
  }, [selectedCate]);

  console.log(selectedCate);

  // Gọi API khi có tên danh mục
  useEffect(() => {
    if (!nameCate) return;

    setLoading(true);

    axios
      .get(`http://localhost:8000/api/product/${encodeURIComponent(nameCate)}`)
      .then((res) => {
        setCate(res.data.data); // Laravel paginate -> nằm trong `data.data`
        // console.log(res.data.data);
        setLoading(false);
        setError("");
      })
      .catch((e) => {
        console.log("error", e);
        setError("Không thể tải dữ liệu.");
        navigate("/notFile");
        setLoading(false);
      });
  }, [nameCate, setLoading, navigate]);

  return (
    <section className="p-4">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={40} color="#36d7b7" loading={loading} />
        </div>
      ) : (
        <ul className="space-y-2">
          {cate.length === 0 ? (
            <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
          ) : (
            cate.map((e, i) => (
              <li key={i}>
                <Link
                  to="#"
                  className="block p-2 border rounded hover:bg-gray-100"
                >
                  {e.product_name}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
}
