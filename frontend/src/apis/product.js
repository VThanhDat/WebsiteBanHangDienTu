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

export const apiDeleteProduct = (token, pid) =>
  axios({
    url: `/product/delete/${pid}`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiDeleteManyProducts = (token, data) =>
  axios({
    url: `/product/deletemany`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiAddProduct = (token, data) =>
  axios({
    url: `/product/`,
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiEditProduct = (token, pid, data) =>
  axios({
    url: `/product/update/${pid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiUpdateImageProduct = (token, pid, data) =>
  axios({
    url: `/product/uploadimage/${pid}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data,
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

export const apiGetProductRatings = (token, params) =>
  axios({
    url: "/product/ratings",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

export const apiDeleteProductRating = (token, pid, data) =>
  axios({
    url: `/product/deleterating/${pid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteManyProductRatings = (token, data) =>
  axios({
    url: `/product/deleteratings`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteProductImage = (token, pid, imageUrl) =>
  axios({
    url: `/product/deleteimage/${pid}`,
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data: { imageUrl },
  });
