import { useEffect, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import axios from "axios";
import BillResultBuyNow from "./BillResultBuyNow";
export default function ZaloPay() {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);

  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const appStatus = urlParams.get("status");

  useEffect(() => {
    setLoading(true);
    const apptransid = urlParams.get("apptransid");

    if (!apptransid) return;

    axios
      .post(
        "http://localhost:8000/api/zalo/check-zalo",
        {
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
        if (res.data.status && appStatus == 1) {
          setStatus(true);
          setItem(res.data.bill);
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
