import axios from "axios";

export const HandleHeart = async (selectId) => {
  const users = JSON.parse(localStorage.getItem("user")) ?? null;
  const token = localStorage.getItem("token");
  if (!token || !users) {
    window.location.href = "/auth/login";
    return;
  }

  const user_id = users.id;

  try {
    const res = await axios.post(
      "http://localhost:8000/api/insert-heart-user",
      { user_id, selectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("hadnleHeaert", res);
    return { success: true, message: "Đã thêm vào danh sách yêu thích!" };
  } catch (e) {
    if (e.response && e.response.status === 409) {
      return {
        success: false,
        message:
          e.response.data["message-error"] ??
          "Sản phẩm đã tồn tại trong danh sách",
      };
    }
    return { success: false, message: "Có lỗi xảy ra khi thêm sản phẩm" };
  }
};
