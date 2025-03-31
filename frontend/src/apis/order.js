import axios from "../axios";

export const apiCreateOrder = (token, data) =>
  axios({
    url: `/order/`,
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
