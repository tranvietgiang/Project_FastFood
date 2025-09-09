import { useEffect, useState } from "react";
export default function Coupon({ getCoupon }) {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    // Mock data
    setCoupons(getCoupon);
  }, [getCoupon]);

  return (
    <section className="max-w-[1400px] mx-auto p-5 bg-[#d3d0c8] min-h-[400px] rounded-lg md:mt-[50px] md:mb-[100px]">
      <h2 className="text-xl font-bold mb-4">Mã giảm giá của bạn</h2>
      <ul className="space-y-3">
        {coupons.length === 0 && (
          <li className="text-gray-600">Bạn chưa có mã nào</li>
        )}
        {coupons.map((c) => (
          <li
            key={c.id}
            className="flex flex-col md:flex-row items-center justify-between bg-orange-100 p-3 rounded-lg shadow"
          >
            {/* Mã code */}
            <div className="w-full md:w-1/4 flex items-center justify-center bg-orange-200 font-bold text-gray-800 rounded p-2">
              CODE{c.coupon_id}
            </div>
            {/* Nội dung */}
            <div className="flex-1 md:ml-4 mt-3 md:mt-0">
              <p className="text-sm font-medium text-gray-800">
                {c.coupon_user_name}
              </p>
              <p className="text-xs text-gray-600">
                Giảm{" "}
                <span className="font-semibold">{c.coupon_user_percent}%</span>{" "}
                cho đơn từ{" "}
                {Number(c.coupon_user_minimum_price).toLocaleString()}đ
              </p>
            </div>
            {/* Hành động */}
            <div className="mt-3 md:mt-0">
              <button
                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                onClick={() =>
                  navigator.clipboard.writeText(`CODE${c.coupon_id}`)
                }
              >
                Sao chép
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
