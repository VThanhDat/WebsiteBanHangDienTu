const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: "products",
  BLOGS: "blogs",
  SERVICES: "services",
  FAQs: "faqs",
  COUPONS: "coupons",
  DETAIL_PRODUCT: "products",
  DETAIL_PRODUCT__SLUG: "products/:slug/",
  AUTH_REGISTER: "authregister/:status",
  RESET_PASSWORD: "resetpassword/:token",
  WISHLIST: "wishlist",

  CART: "cart",
  CHECKOUT: "cart/checkout",
  PAYMENTSUCCESS: "/payment/success",

  ACCOUNT: "account",
  ACCOUNT_PROFILE: "account/profile",
  ACCOUNT_ORDERS: "account/orders",
  ACCOUNT_ADDRESS: "account/address",
  ACCOUNT_PASSWORD: "account/password",

  ADMIN: "admin",
  DASHBOARD: "admin/dashboard",
  PRODUCTS_ADMIN: "admin/products",
  BRANDS: "admin/brands",
  CATEGOGIES: "admin/categories",
  ORDERS: "admin/orders",
  RATINGS: "admin/ratings",
  ADMIN_COUPONS: "admin/coupons",
  USERS: "admin/users",
};

export default path;
