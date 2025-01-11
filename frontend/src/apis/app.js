import axios from "../axios";

export const apiGetCategories = (params) =>
  axios({
    url: "/prodcategory/",
    method: "get",
    params,
  });
