import axios from "axios";
export const HandleHeart = async (selectId) => {
  const users = JSON.parse(localStorage.getItem("user")) ?? null;
  const token = localStorage.getItem("token");

  if (!token && !users) {
    window.location.href = "/auth/login";
    return;
  }

  const user_id = users.id;

  try {
    axios
      .post(
        "http://localhost:8000/api/insert-heart-user",
        {
          user_id,
          selectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log("thành công add-list");
      })
      .catch((e) => {
        console.log("E", e);
      });
  } catch (error) {
    console.log("error", error);
  }
};
