import axios from "../axios";

export const apiDeleteCategory = (token, pcid) =>
  axios({
    url: `/prodcategory/delete/${pcid}`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiAddCategory = (token, data) =>
  axios({
    url: `/prodcategory/`,
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data,
  });

export const apiEditCategory = (token, pcid, data) =>
  axios({
    url: `/prodcategory/update/${pcid}`,
    method: "put",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiDeleteManyCategories = (token, data) =>
  axios({
    url: `/prodcategory/deletemany`,
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

export const apiUpdateImageCategory = (token, pcid, data) =>
  axios({
    url: `/prodcategory/uploadimage/${pcid}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data,
  });
