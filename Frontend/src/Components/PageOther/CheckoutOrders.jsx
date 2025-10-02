import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import Address from "./Address/Address";

export default function CheckoutOrders() {
  const [getOrder, setOrders] = useState({});
  const [getUser, setUser] = useState({});
  const [payment, setPayment] = useState("cod");
  const [userSelectPM, setUserSelectPM] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const priceTotalRef = useRef();
  const priceTempRef = useRef();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const order = localStorage.getItem("orderCartData");
    if (user) {
      setUser(user);
    } else {
      navigate("/auth/login");
    }

    if (order) {
      setOrders(JSON.parse(order));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("orderCartData");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/auth/login");
  };

  // Tính tổng số sản phẩm và tổng tiền
  const totalItems = getOrder?.cartItems?.length || 0;
  const totalPrice = getOrder?.totalPrice || 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 50000);

    return () => clearTimeout(timeout);
  }, []);

  // console.log("Order data:", getOrder);

  const handlePayment = async () => {
    if (totalItems === 0) {
      alert("Giỏ hàng trống");
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

    const data = {
      cart_ids: getOrder?.cartIds, // Gửi cart_ids
      bill_user_id: getUser?.id, // Thêm user_id
      bill_payment_id: pm,
      bill_price_total: totalPrice,
      coupon_id: getOrder?.coupon || null, // Gửi coupon nếu có
    };

    try {
      const res = await axios.post(
        `http://localhost:8000/api/checkout/buy-cart`,
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
      setLoading(false);
      console.log("Payment error:", error);
      alert("Có lỗi xảy ra khi thanh toán");
    }
  };

  // Render danh sách sản phẩm từ giỏ hàng
  const renderCartItems = () => {
    if (!getOrder?.cartItems || getOrder.cartItems.length === 0) {
      return <div className="text-center py-4">Không có sản phẩm</div>;
    }

    return getOrder.cartItems.map((item, index) => (
      <div key={index} className="flex items-center gap-3 pb-4 mb-4 border-b">
        <div className="relative">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={`/Images/x/${item.product_image}`}
              alt={item.product_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/80x80?text=No+Image";
              }}
            />
          </div>
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {item.cart_quantity}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{item.product_name}</h3>
          <p className="text-gray-600 text-xs">
            Số lượng: {item.cart_quantity}
          </p>
        </div>
        <span className="font-medium text-red-500 text-sm">
          {Number(item.current_price * item.cart_quantity).toLocaleString()}₫
        </span>
      </div>
    ));
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
              <p className="text-gray-600">Thanh toán giỏ hàng</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Thông tin nhận hàng</h2>
                <button
                  onClick={handleLogout}
                  className="text-blue-600 text-sm hover:bg-gray-200 p-1 rounded-md px-2"
                >
                  Đăng xuất
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
                    className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    readOnly
                    defaultValue={getUser?.fullname ?? ""}
                    className="p-3 border border-gray-300 rounded bg-gray-100"
                  />
                  <div className="flex">
                    <input
                      type="tel"
                      value={getUser?.phone ?? ""}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-l bg-gray-100"
                    />
                    <div className="flex items-center px-4 bg-gray-100 border border-gray-300 rounded-r">
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
                Đơn hàng ({totalItems} sản phẩm)
              </h2>

              {/* Cart Items */}
              <div className="max-h-80 overflow-y-auto">
                {renderCartItems()}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span
                    ref={priceTempRef}
                    className="font-medium text-red-500 text-[18px]"
                  >
                    {Number(totalPrice).toLocaleString()}₫
                  </span>
                </div>

                {getOrder?.coupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Mã giảm giá</span>
                    <span>Đã áp dụng</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>

                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span
                    ref={priceTotalRef}
                    className="font-medium text-red-600 text-[19px]"
                  >
                    {Number(totalPrice).toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-2 text-blue-600 text-sm">
                  <Link
                    onClick={() => {
                      navigate(-1);
                      localStorage.removeItem("orderCartData");
                    }}
                  >
                    ← Quay về giỏ hàng
                  </Link>
                </button>
                {loading && (
                  <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
                    <ClipLoader size={30} color="#36d7b7" loading={loading} />
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={totalItems === 0}
                  className={`w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors ${
                    totalItems === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
