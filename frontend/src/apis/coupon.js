import axios from "../axios";

export const apiGetCoupons = (params) =>
  axios({
    url: "/coupon/",
    method: "get",
    params,
  });

export const apiAddCoupon = (token, data) =>
  axios({
    url: `/coupon/`,
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteCoupon = (token, cpid) =>
  axios({
    url: `/coupon/delete/${cpid}`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiEditCoupon = (token, cpid, data) =>
  axios({
    url: `/coupon/update/${cpid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteManyCoupons = (token, data) =>
  axios({
    url: `/coupon/deletemany`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
