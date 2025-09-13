import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import axios from "axios";
import BillResultBuyNow from "./BillResultBuyNow";

export default function VNPayResult() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const vnp_TransactionStatus = urlParams.get("vnp_TransactionStatus");
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");

    console.log(vnp_TransactionNo);
    if (!vnp_TransactionStatus && !vnp_ResponseCode) return;
    setLoading(true);
    axios
      .post(
        "http://localhost:8000/api/vnpay/check-vnpay",
        {
          transactionStatus: vnp_TransactionStatus,
          responseCode: vnp_ResponseCode,
          vnp_TransactionNo: vnp_TransactionNo,
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
        } else {
          setStatus(false);
          setItem([]);
        }
      })
      .catch((error) => {
        setItem([]);
        setStatus(false);
        console.log("Error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, token]);

  return <BillResultBuyNow item={item} loading={loading} status={status} />;
}
