import axios from "../axios";

export const apiGetBrands = (params) =>
  axios({
    url: "/brand/",
    method: "get",
    params,
  });
