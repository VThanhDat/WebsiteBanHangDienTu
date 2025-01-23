import axios from "../axios";

export const apiGetProduct = (params) =>
  axios({
    url: `/product/get/${params}`,
    method: "get",
  });

export const apiGetProducts = (params) =>
  axios({
    url: "/product/",
    method: "get",
    params,
  });
