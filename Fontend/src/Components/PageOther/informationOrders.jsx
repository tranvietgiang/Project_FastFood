import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import Address from "./Address/Address";

export default function InformationOrders() {
  const [getOrder, setOrders] = useState({});
  const [getUser, setUser] = useState({});
  const [payment, setPayment] = useState("cod");
  const [userCoupon, setUserCoupon] = useState(null);
  const [getCoupon, setCoupon] = useState(null);
  const [getCouponUserList, setUserCouponList] = useState([]);
  const [finalPrice, setFinalPrice] = useState(null);
  const [finalPriceRe, setFinalPriceRe] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userSelectPM, setUserSelectPM] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const priceProductRef = useRef();
  const priceTempRef = useRef();
  const priceTotalRef = useRef();
  const nameRef = useRef();
  const QtyRef = useRef();

  // localStorage.removeItem("cache_province");

  useEffect(() => {
    const order = localStorage.getItem("packageOrder");
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    } else {
      navigate("/auth/login");
    }

    if (order) {
      setOrders(JSON.parse(order));
    }
  }, [navigate]);

  useEffect(() => {
    if (userCoupon && userCoupon !== appliedCoupon) {
      setConfirm(false);
    }

    if (userCoupon && userCoupon === appliedCoupon) {
      setConfirm(true);
    }
  }, [userCoupon, appliedCoupon, finalPrice]);

  const handleLogout = () => {
    localStorage.removeItem("packageOrder");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/auth/login");
  };

  let priceTotal = getOrder?.priceOrder * getOrder?.quantityOrder;

  const handleCoupon = async () => {
    if (!userCoupon) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/api/enter-the-coupon/
        ${userCoupon}`
      );
      setCoupon(res.data.coupon_percent ?? null);
      setConfirm(true);
      setAppliedCoupon(userCoupon);
    } catch (error) {
      setCoupon(null);
      setConfirm(false);
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (getCoupon > 0) {
      setFinalPrice(priceTotal * (1 - getCoupon / 100));
      setFinalPriceRe(finalPrice);
    }
  }, [setFinalPrice, priceTotal, getCoupon, finalPrice]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get-coupon-user")
      .then((res) => {
        setUserCouponList(res.data.list);
      })
      .catch((e) => {
        console.log(e);
        setUserCouponList([]);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 50000);

    return () => clearTimeout(loading);
  });

  let checkPrice = finalPrice && userCoupon === appliedCoupon;

  const handlePayment = async () => {
    if (
      priceProductRef.current.textContent !=
      Number(getOrder?.priceOrder).toLocaleString()
    ) {
      navigate("/notFile");
      return;
    }

    if (checkPrice) {
      if (
        priceTempRef.current.textContent != Number(finalPrice).toLocaleString()
      ) {
        navigate("/notFile");
        return;
      }
    } else {
      if (
        priceTempRef.current.textContent != Number(priceTotal).toLocaleString()
      ) {
        navigate("/notFile");
        return;
      }
    }

    if (checkPrice) {
      if (
        priceTotalRef.current.textContent != Number(finalPrice).toLocaleString()
      ) {
        navigate("/notFile");
        return;
      }
    } else {
      if (
        priceTotalRef.current.textContent != Number(priceTotal).toLocaleString()
      ) {
        navigate("/notFile");
        return;
      }
    }

    if (nameRef.current.textContent.trim() != getOrder?.nameOrder.trim()) {
      navigate("/notFile");
      return;
    }

    if (QtyRef.current.textContent != getOrder?.quantityOrder) {
      navigate("/notFile");
      return;
    }

    setLoading(true);

    let pm = null;

    pm =
      userSelectPM == "vnPay"
        ? 2
        : userSelectPM == "zaloPay"
          ? 3
          : userSelectPM == "momo"
            ? 4
            : 1;

    let priceToPay =
      getCoupon > 0 ? priceTotal * (1 - getCoupon / 100) : priceTotal;

    if (userCoupon && userCoupon !== appliedCoupon) {
      priceToPay = priceTotal;
    }

    if (userCoupon === appliedCoupon) {
      localStorage.setItem("bill_coupon_id", userCoupon);
    } else {
      localStorage.removeItem("bill_coupon_id");
    }

    const data = {
      bill_product_id: getOrder?.idOrder,
      bill_user_id: getUser?.id,
      bill_payment_id: pm,
      bill_price_total: priceToPay,
      bill_quantity: getOrder?.quantityOrder,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8000/api/checkout/buy-now`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );

      setLoading(false);
      localStorage.setItem("bills", JSON.stringify(data));

      if (res.data.payment_url) {
        // Nếu là VNPAY
        window.location.href = res.data.payment_url;
      } else if (res.data.orderurl) {
        // Nếu là ZaloPay
        window.location.href = res.data.orderurl;
      } else if (res.data.payUrl) {
        // Nếu là MoMo
        window.location.href = res.data.payUrl;
      } else {
        console.log("Không có URL thanh toán trả về:", res.data);
      }
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-blue-600 mb-2">
                EGA Food
              </h1>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Thông tin nhận hàng</h2>
                <button
                  onClick={handleLogout}
                  className="text-blue-600 text-sm hover:bg-gray-200 p-1 rounded-md px-2"
                >
                  Đang xuất
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    defaultValue={getUser?.email ?? ""}
                    className="w-full p-3 border border-gray-300 rounded bg-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    readOnly
                    defaultValue={getUser?.fullname ?? ""}
                    className="p-3 border  border-gray-300 rounded bg-gray-400"
                  />
                  <div className="flex">
                    <input
                      type="tel"
                      value={getUser?.phone ?? ""}
                      className="flex-1 p-3 border border-gray-300 rounded-l w-[100px] border-r-0"
                    />
                    <div className="flex items-center px-4 bg-gray-100 border  border-gray-300 rounded-r">
                      <span className="w-5 h-3 bg-red-500 rounded-sm"></span>
                    </div>
                  </div>
                </div>

                <Address />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer">
              <h2 className="text-lg font-medium mb-4">Thanh toán</h2>

              <div className="space-y-3">
                <form>
                  {/* Chuyển khoản */}
                  <div
                    onClick={() => setPayment("bank")}
                    className={`flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer 
                    ${payment === "bank" ? "border-gray-800 bg-gray-100" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      id="payment1"
                      value="bank"
                      checked={payment === "bank"}
                      onChange={(e) => setPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="payment1">Chuyển khoản</label>
                  </div>

                  {/* Nếu chọn bank thì show thêm options */}
                  {payment === "bank" && (
                    <div className="ml-6 space-y-2">
                      {["vnPay", "zaloPay", "momo"].map((method) => (
                        <div
                          key={method}
                          onClick={() => setUserSelectPM(method)}
                          className={`flex items-center gap-3 p-2 border w-[400px] rounded cursor-pointer
                           ${userSelectPM === method ? "border-blue-500 bg-blue-50" : ""}`}
                        >
                          <input
                            type="radio"
                            name="bankMethod"
                            id={method}
                            value={method}
                            checked={userSelectPM === method}
                            onChange={(e) => setUserSelectPM(e.target.value)}
                            className="w-4 h-4"
                          />
                          <label htmlFor={method} className="capitalize">
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* COD */}
                  <div
                    onClick={() => setPayment("cod")}
                    className={`flex items-center gap-3 p-3 border rounded cursor-pointer
                  ${payment === "cod" ? "border-blue-500 bg-blue-50" : ""} mt-4`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      id="payment2"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={(e) => setPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="payment2" className="font-medium">
                      Thu hộ (COD)
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-lg font-medium mb-4">
                Đơn hàng (1 sản phẩm)
              </h2>

              {/* Order Item */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                <div className="relative">
                  <div className="w-16 h-16  rounded-lg flex items-center justify-center">
                    <img
                      src={`/Images/x/${getOrder?.imageOrder ?? ""}`}
                      alt=""
                    />
                  </div>
                  <span
                    ref={QtyRef}
                    className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {getOrder?.quantityOrder ?? 0}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 ref={nameRef} className="font-medium">
                    {getOrder?.nameOrder ?? ""}
                  </h3>
                </div>
                <span className="font-medium text-red-500">
                  <span ref={priceProductRef}>
                    {Number(getOrder?.priceOrder ?? 0).toLocaleString()}
                  </span>
                  ₫
                </span>
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                <div className="flex gap-2 ">
                  <select
                    className={`ax-w-[370px] flex-1 p-2 border border-gray-300 rounded text-sm `}
                    name="user-coupon"
                    value={userCoupon ?? null}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : e.target.value;
                      setUserCoupon(e.target.value);

                      if (value == "chọn mã") {
                        setFinalPrice(null);
                        setCoupon(null);
                      } else {
                        setFinalPrice(finalPriceRe);
                      }
                    }}
                  >
                    <option value={null}>Chọn mã</option>

                    {getCouponUserList
                      .filter((v) => {
                        const created = new Date(v.created_at);
                        const a = created.toISOString().split("T")[0];
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          a >= today &&
                          v.coupon_user_minimum_price <= priceTotal
                        );
                      })
                      .map((e, index) => {
                        return (
                          <>
                            <option
                              className={`${userCoupon == e.coupon_user_id ? "text-red-500 font-bold" : ""}`}
                              key={index}
                              value={e.coupon_user_id}
                            >
                              <span
                                className={`inline-block font-bold text-lg`}
                              >
                                RT{e.coupon_user_id}
                              </span>
                              - {e.coupon_user_name ?? ""}
                            </option>
                            ;
                          </>
                        );
                      })}
                  </select>
                  <p>
                    {!confirm && userCoupon !== "" ? (
                      <button
                        onClick={handleCoupon}
                        className={`${userCoupon == "Chọn mã" ? "bg-gray-500" : ""} px-4 py-2 truncate  text-white bg-blue-600 rounded text-sm font-medium`}
                      >
                        Áp dụng
                      </button>
                    ) : (
                      <button
                        onClick={handleCoupon}
                        className="px-4 py-2  bg-green-600  text-white rounded text-sm font-medium"
                      >
                        Đã áp dụng
                      </button>
                    )}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span className="font-medium text-red-500 text-[18px] inline-block">
                    <span ref={priceTempRef}>
                      {checkPrice
                        ? Number(finalPrice).toLocaleString()
                        : Number(priceTotal).toLocaleString()}
                    </span>
                    ₫
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="font-medium text-red-600 text-[19px] inline-block">
                    <span ref={priceTotalRef}>
                      {checkPrice
                        ? Number(finalPrice).toLocaleString()
                        : Number(priceTotal).toLocaleString()}
                    </span>
                    đ
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-2 text-blue-600 text-sm">
                  <Link
                    onClick={() => {
                      navigate(-1);
                      localStorage.removeItem("packageOrder");
                    }}
                  >
                    ← Quay về giỏ hàng
                  </Link>
                </button>
                {loading && (
                  <div className="flex justify-center items-center fixed inset-0 bg-black opacity-50">
                    <ClipLoader size={30} color="#36d7b7" loading={loading} />
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-blue-600 text-white rounded font-medium"
                >
                  ĐẶT HÀNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
