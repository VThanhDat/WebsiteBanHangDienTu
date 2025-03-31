import axios from "../axios";

export const apiGetUserAddress = (token, params) =>
  axios({
    url: "/user/user-address",
    method: "get",
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const apiUpdateUserAddress = (token, data) =>
  axios({
    url: "/user/address",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiChangePassword = (token, data) =>
  axios({
    url: "/user/change-password",
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

// CART
export const apiAddToCart = (token, data) =>
  axios({
    url: "/user/updatecart",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiRemoveFromCart = (token, data) =>
  axios({
    url: "/user/removefromcart",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiUpdateCart = (token, data) =>
  axios({
    url: "/user/updatecart",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiClearCart = (token, data) =>
  axios({
    url: "/user/clearcart",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

// WISHLIST
export const apiAddWishList = (token, data) =>
  axios({
    url: "/user/addwishlist",
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiRemoveWishList = (token, data) =>
  axios({
    url: "/user/removewishlist",
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

export const apiUploadAvatar = (token, uid, data) =>
  axios({
    url: `/user/uploadavatar/${uid}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data,
  });
