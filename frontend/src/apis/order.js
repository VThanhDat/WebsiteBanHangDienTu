import axios from "../axios";

export const apiCreateOrder = (token, data) =>
  axios({
    url: `/order/`,
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiGetOrders = (token, params) =>
  axios({
    url: `/order/admin`,
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const apiGetOneOrder = (token, oid) =>
  axios({
    url: `/order/order-detail/${oid}`,
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiUpdateStatusOrder = (token, oid, data) =>
  axios({
    url: `/order/status/${oid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiCancelOrder = (token, oid) =>
  axios({
    url: `/order/${oid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiUserOrders = (token, params) =>
  axios({
    url: `/order/`,
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
