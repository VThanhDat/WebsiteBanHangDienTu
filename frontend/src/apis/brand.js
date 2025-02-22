import axios from "../axios";

export const apiGetBrands = (params) =>
  axios({
    url: "/brand/",
    method: "get",
    params,
  });

export const apiDeleteBrand = (token, bcid) =>
  axios({
    url: `/brand/delete/${bcid}`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiAddBrand = (token, data) =>
  axios({
    url: `/brand/`,
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiEditBrand = (token, bcid, data) =>
  axios({
    url: `/brand/update/${bcid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteManyBrands = (token, data) =>
  axios({
    url: `/brand/deletemany`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
