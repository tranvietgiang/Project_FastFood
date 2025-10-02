import { useEffect, useState } from "react";
import axios from "axios";
import BillResultBuyNow from "./BillResultBuyNow";
export default function ZaloPay() {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);

  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const getCoupon = localStorage.getItem("bill_coupon_id");

  useEffect(() => {
    setLoading(true);
    const apptransid = urlParams.get("apptransid");

    if (!apptransid) return;

    axios
      .post(
        "http://localhost:8000/api/zalo/check-zalo",
        {
          getCoupon: getCoupon,
          app_id: apptransid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setStatus(true);
          setItem(res.data.bill);
          localStorage.removeItem("bill_coupon_id");
          setLoading(false);
        } else {
          setStatus(false);
          console.log("err", res.data.error);
        }
      })
      .catch(() => {
        setStatus(false);
        setItem({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <BillResultBuyNow item={item} loading={loading} status={status} />;
}
