import { useEffect, useState } from "react";
import axios from "axios";
import BillResultBuyNow from "./BillResultBuyNow";

export default function MomoResult() {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);

  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const transId = urlParams.get("transId");
  const message = urlParams.get("message");
  const getCoupon = localStorage.getItem("bill_coupon_id");

  useEffect(() => {
    if (!transId) return;
    setLoading(true);
    axios
      .post(
        "http://localhost:8000/api/momo/check-momo",
        {
          getCoupon: getCoupon,

          transId: transId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status && message == "Successful.") {
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
