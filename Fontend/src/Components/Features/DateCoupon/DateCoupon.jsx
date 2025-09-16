import { useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import HandleCopy from "../Handle/HandleCopy";
import axios from "axios";
import { useState } from "react";

export default function DateCoupon({
  getCouponList,
  getCoupon,
  copiedId,
  setCopiedText,
  setCopiedId,
}) {
  const [dateSendInert, setDateCoupon] = useState(null);

  useEffect(() => {
    if (!copiedId) return;

    const token_user = localStorage.getItem("token");

    axios
      .post(
        `http://localhost:8000/api/insert-coupon/${copiedId}`,
        {
          displayDate: dateSendInert,
        },
        {
          headers: {
            Authorization: `Bearer ${token_user}`,
          },
        }
      )
      .then(() => {
        console.log("thành công thêm code");
      })
      .catch((e) => {
        console.log("Error", e);
      });
  }, [copiedId, dateSendInert]);

  return (
    <>
      {getCoupon.map((e) => {
        const expiredDate = new Date(e.updated_at);
        const dayPresent = new Date();
        const displayDate = expiredDate.toISOString().split("T")[0]; // 2025-09-15
        const isValid = expiredDate >= dayPresent;

        return (
          <li
            key={e.coupon_id}
            className="flex-none md:flex w-[100%] snap-center bg-red-100 rounded-lg overflow-hidden shadow-sm list-none"
          >
            <div className="w-24 flex items-center justify-center bg-red-200 font-bold text-gray-800">
              RTL{e.coupon_id}
            </div>

            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-800">{e.coupon_name}</p>
                <p className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-1">
                  <RiErrorWarningLine /> Điều kiện
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-600">{displayDate}</span>

                {copiedId === e.coupon_id && (
                  <HandleCopy text={copiedId} setCopiedText={setCopiedText} />
                )}

                <button
                  disabled={!isValid}
                  onClick={() => {
                    if (!isValid) return;

                    setCopiedId(e.coupon_id);
                    setDateCoupon(displayDate);
                    setCopiedText("Đã sao chép");

                    // setTimeout(() => {
                    //   setCopiedId(null);
                    //   setCopiedText("");
                    // }, 2000);
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    getCouponList.some((v) => v.coupon_user_id == e.coupon_id)
                      ? "bg-gray-100 text-green-700"
                      : e.coupon_id == copiedId
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : isValid
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-100 text-red-500 cursor-not-allowed"
                  }`}
                >
                  {getCouponList.some((v) => v.coupon_user_id == e.coupon_id)
                    ? "Đã nhận"
                    : e.coupon_id == copiedId
                      ? "Đã sao chép"
                      : isValid
                        ? "Sao chép"
                        : "Hết Hạn"}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}
