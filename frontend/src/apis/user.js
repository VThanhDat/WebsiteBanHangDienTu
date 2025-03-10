import axios from "../axios";

export const apiUpdateUserAddress = (token, data) =>
  axios({
    url: "/user/address",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
export const apiUpdateUserInformation = (token, data) =>
  axios({
    url: "/user/current",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

//ADMIN
export const apiGetUsers = (token, params) =>
  axios({
    url: "/user/",
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const apiEditUser = (token, uid, data) =>
  axios({
    url: `/user/update/${uid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apideleteUser = (token, params) =>
  axios({
    url: "/user/delele",
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const apiDeleteManyUsers = (token, data) =>
  axios({
    url: `/user/deletemany`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
