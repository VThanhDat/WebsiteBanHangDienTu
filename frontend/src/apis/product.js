import axios from "../axios";

export const apiGetProduct = (pid) =>
  axios({
    url: `/product/` + pid,
    method: "get",
  });

export const apiGetProducts = (params) =>
  axios({
    url: "/product/",
    method: "get",
    params,
  });
