import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Edit3, ArrowLeft } from "lucide-react";
import axios from "axios";

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
  const navigate = useNavigate();

  // Khi chọn coupon
  useEffect(() => {
    if (userCoupon && userCoupon !== appliedCoupon) {
      setConfirm(false);
    }

    if (userCoupon && userCoupon === appliedCoupon) {
      setConfirm(true);
    }
  }, [userCoupon, appliedCoupon, finalPrice]);

  console.log(appliedCoupon, userCoupon);

  useEffect(() => {
    const order = localStorage.getItem("packageOrder");
    const user = localStorage.getItem("user");
    if (order) {
      setOrders(JSON.parse(order));
    }
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("packageOrder");
    localStorage.removeItem("user");

    navigate("/auth/login");
  };

  const handleCss = (value) => {
    setPayment(value);
  };

  let priceTotal = getOrder?.priceOrder * getOrder?.quantityOrder;

  const handleCoupon = async () => {
    if (!userCoupon) return;
    // console.log(userCoupon);
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
  // console.log("% giảm:", getCoupon);
  // console.log("price total:", priceTotal);
  // console.log("price final if have percents:", finalPrice);

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

                <input
                  type="text"
                  readOnly
                  defaultValue={getUser?.fullname ?? ""}
                  className="w-full p-3 border border-gray-300 rounded bg-gray-400"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                      <span className="w-5 h-3 bg-red-500 rounded-sm"></span>
                    </div>
                    <input
                      type="tel"
                      value={getUser?.phone ?? ""}
                      className="flex-1 p-3 border border-gray-300 rounded-r w-[100px]"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Địa chỉ (tùy chọn)"
                    className="p-3 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <select className="p-3 border border-gray-300 rounded bg-gray-50">
                    <option>Tỉnh thành</option>
                  </select>

                  <select className="p-3 border border-gray-300 rounded bg-gray-50">
                    <option>Quận huyện (tùy chọn)</option>
                  </select>

                  <select className="p-3 border border-gray-300 rounded bg-gray-50">
                    <option>Phường xã (tùy chọn)</option>
                  </select>
                </div>

                <textarea
                  placeholder="Ghi chú (tùy chọn)"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer">
              <h2 className="text-lg font-medium mb-4">Thanh toán</h2>

              <div className="space-y-3">
                <form>
                  <div
                    onClick={() => handleCss("bank")}
                    className={`flex items-center gap-3 p-3 border ${payment === "bank" ? "border-blue-500 bg-blue-50" : ""}  rounded mb-2 `}
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

                  <div
                    onClick={() => handleCss("cod")}
                    className={`flex items-center gap-3 p-3 border ${payment === "cod" ? "border-blue-500 bg-blue-50" : ""}  rounded `}
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
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getOrder?.quantityOrder ?? 0}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{getOrder?.nameOrder ?? ""}</h3>
                </div>
                <span className="font-medium text-red-500">
                  {Number(getOrder?.priceOrder ?? 0).toLocaleString()}₫
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
                      const value = e.target.value;
                      setUserCoupon(e.target.value);

                      if (value == "Chọn mã") {
                        setFinalPrice(null);
                        setCoupon(null);
                      } else {
                        setFinalPrice(finalPriceRe);
                      }
                    }}
                  >
                    <option value={null}>Chọn mã</option>
                    {getCouponUserList
                      .filter((v) => v.coupon_user_minimum_price <= priceTotal)
                      .map((e, index) => (
                        <option
                          className={`${userCoupon == e.coupon_user_id ? "text-red-500 font-bold" : ""}`}
                          key={index}
                          value={e.coupon_user_id}
                        >
                          <span className="inline-block font-bold text-lg">
                            RT{e.coupon_user_id}
                          </span>
                          - {e.coupon_user_name ?? ""}
                        </option>
                      ))}
                  </select>
                  <p>
                    {!confirm && userCoupon !== "" ? (
                      <button
                        onClick={handleCoupon}
                        className="px-4 py-2  text-white bg-blue-600 rounded text-sm font-medium"
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
                    {finalPrice && userCoupon === appliedCoupon
                      ? Number(finalPrice).toLocaleString()
                      : Number(priceTotal).toLocaleString()}
                    ₫
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="font-medium text-red-600 text-[19px] inline-block">
                    {finalPrice && userCoupon === appliedCoupon
                      ? Number(finalPrice).toLocaleString()
                      : Number(priceTotal).toLocaleString()}
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
                <button className="w-full py-3 bg-blue-600 text-white rounded font-medium">
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
