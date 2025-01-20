import axios from "../axios";

export const apiRegister = (data) =>
  axios({
    url: "/auth/register",
    method: "post",
    withCredentials: true,
    data,
  });

export const apiLogin = (data) =>
  axios({
    url: "/auth/login",
    method: "post",
    withCredentials: true,
    data,
  });

export const apiLogout = () =>
  axios({
    url: "/auth/logout",
    method: "get",
    withCredentials: true,
  });

export const apiForgotPassword = (data) =>
  axios({
    url: "/auth/forgotpassword",
    method: "post",
    data,
  });

export const apiResetPassword = (data) =>
  axios({
    url: "/auth/resetpassword",
    method: "put",
  });

export const apiGetCurrent = (token) =>
  axios({
    url: "/auth/current",
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiRefreshToken = () =>
  axios({
    url: "/auth/refreshtoken",
    method: "post",
    withCredentials: true,
  });
