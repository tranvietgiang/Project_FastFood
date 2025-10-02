import axios from "axios";

export const HandleCartItem = async (productId, finalPrice) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!productId) {
    window.location.href = "/notFile";
    return;
  }

  if (!token || !user) {
    window.location.href = "/auth/login";
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:8000/api/insert-cart-item",
      { productId: productId, priceDiscount: finalPrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", res.data);
    window.dispatchEvent(
      new CustomEvent("updateCart", { detail: res.data.count_cart })
    );
    return {
      success: true,
      message: res.data.message ?? "Đã thêm vào giỏ hàng",
    };
  } catch (e) {
    if (e.response) {
      console.error("Error response:", e.response.data);
      return {
        success: false,
        message: e.response.data["cartItem_error"] ?? "Có lỗi xảy ra",
      };
    }
    return { success: false, message: "Không kết nối được server" };
  }
};
