const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: "products",
  BLOGS: "blogs",
  SERVICES: "services",
  FAQs: "faqs",
  DETAIL_PRODUCT: "products",
  DETAIL_PRODUCT__SLUG: "products/:slug/",
  AUTH_REGISTER: "authregister/:status",
  RESET_PASSWORD: "resetpassword/:token",
  WISHLIST: "wishlist",

  CART: "cart",
  CHECKOUT: "cart/checkout",

  ACCOUNT: "account",
  ACCOUNT_PROFILE: "account/profile",
  ACCOUNT_RATINGS: "account/ratings",
  ACCOUNT_ORDERS: "account/orders",

  ADMIN: "admin",
  DASHBOARD: "admin/dashboard",
  PRODUCTS_ADMIN: "admin/products",
  BRANDS: "admin/brands",
  CATEGOGIES: "admin/categories",
  ORDERS: "admin/orders",
  RATINGS: "admin/ratings",
  COUPONS: "admin/coupons",
  USERS: "admin/users",
};

export default path;
