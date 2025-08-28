import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import GetProducts from "../GetProducts/GetProducts";

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

  // Gọi API khi có tên danh mục
  useEffect(() => {
    if (!nameCate) return;

    setLoading(true);

    axios
      .get(`http://localhost:8000/api/product/${encodeURIComponent(nameCate)}`)
      .then((res) => {
        setCate(res.data.data); // Laravel paginate -> nằm trong `data.data`
        setLoading(false);
      })
      .catch((e) => {
        setError("");
        setCate([]);
        console.log("error", e);
        setError("Không thể tải dữ liệu.");
        navigate("/notFile");
        setLoading(false);
      });
  }, [nameCate, setLoading, navigate]);

  return (
    <section className="p-4 md:max-w-[1400px] mx-auto">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <p className="bg-white text-center p-3 text-xl font-bold">
        Kết quả tìm kiếm:
      </p>
      <p>
        <Link onClick={() => navigate(-1)}>Quay lại</Link>
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={40} color="#36d7b7" loading={loading} />
        </div>
      ) : (
        <ul className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-5 place-items-center relative gap-x-3">
          {cate.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào.</p>
          ) : (
            <GetProducts products={cate} />
          )}
        </ul>
      )}
    </section>
  );
}
