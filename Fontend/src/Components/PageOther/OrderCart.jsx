import { useState, useEffect, useCallback } from "react";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderCart() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [userCoupon, setUserCoupon] = useState("");
  const [getCoupon, setCoupon] = useState(null);
  const [getCouponUserList, setUserCouponList] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [priceTotal, setPriceTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!user) navigate("/auth/login");
  }, [user, navigate]);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/get-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(res.data.get_data || []);

      // Tính tổng dựa trên current_price
      const total = (res.data.get_data || []).reduce(
        (sum, item) =>
          sum + (item.current_price || item.product_price * item.cart_quantity),
        0
      );

      setPriceTotal(total);
      setFinalPrice(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Fetch coupon list
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get-coupon-user")
      .then((res) => {
        setUserCouponList(res.data.list || []);
      })
      .catch((e) => {
        console.error("Error fetching coupons:", e);
        setUserCouponList([]);
      });
  }, []);

  useEffect(() => {
    if (getCoupon > 0 && confirm) {
      const discountedPrice = priceTotal * (1 - getCoupon / 100);
      setFinalPrice(discountedPrice);
    } else {
      setFinalPrice(priceTotal);
    }
  }, [getCoupon, priceTotal, confirm]);

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.product_id))
    .reduce((sum, item) => sum + item.current_price * item.cart_quantity, 0);

  const updateQuantity = async (productId, cartId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      await axios.post(
        "http://localhost:8000/api/update-cart",
        {
          product_id: productId,
          cart_id: cartId,
          quantity: newQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"))
      return;

    try {
      await axios.post("http://localhost:8000/api/delete-cart", {
        data: {
          productId: productId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      await fetchCartItems();
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Navigate to checkout page with selected items
    navigate("/checkout", {
      state: {
        selectedItems,
        coupon: appliedCoupon,
        discount: getCoupon,
        finalPrice: finalPrice,
      },
    });
  };

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
  const selectedCount = selectedItems.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-600">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng của bạn
            </p>
            <Link
              to="/fast-foods"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.product_id}-${item.cart_id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="p-4 flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.product_id)}
                      onChange={() => toggleSelect(item.product_id)}
                      className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                    />

                    {/* Hình ảnh */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                    {/* Thông tin sản phẩm */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product_name}
                      </h3>
                      <p className="text-red-500 font-bold text-lg">
                        {Number(item.current_price).toLocaleString()}đ
                      </p>
                    </div>

                    {/* Nút tăng giảm */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.cart_id,
                            item.cart_quantity - 1
                          )
                        }
                        disabled={
                          updatingItems.has(item.product_id) ||
                          item.cart_quantity <= 1
                        }
                        className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {updatingItems.has(item.product_id)
                          ? "..."
                          : item.cart_quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.cart_id,
                            item.cart_quantity + 1
                          )
                        }
                        disabled={updatingItems.has(item.product_id)}
                        className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>

                    {/* Tổng từng sản phẩm - Sử dụng current_price */}
                    <div className="text-right font-semibold text-lg min-w-[100px]">
                      {Number(
                        item.current_price * item.cart_quantity
                      ).toLocaleString()}
                      đ
                    </div>

                    {/* Xóa */}
                    <button
                      onClick={() => removeItem(item.product_id, item.cart_id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

                {/* Coupon */}
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
                          setFinalPrice(0);
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
                {/* Giá */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tạm tính ({selectedCount} sản phẩm):
                    </span>
                    <span>{selectedTotal.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>

                  <hr className="my-2" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-500">
                      {selectedTotal.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Nút hành động */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className="w-full py-3 bg-red-500 text-white rounded-lg mb-3 font-semibold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Thanh toán ({selectedCount})
                </button>

                <Link
                  to="/products"
                  className="block w-full py-3 border border-gray-300 rounded-lg text-center text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
