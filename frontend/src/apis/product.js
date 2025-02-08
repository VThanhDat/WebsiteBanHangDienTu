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

export const apiRatings = (/*token,*/ data = {}) =>
  axios({
    url: `/product/ratings`,
    method: "put",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    data,
  });
