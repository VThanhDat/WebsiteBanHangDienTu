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

  ACCOUNT: "account",
  ACCOUNT_PROFILE: "account/profile",
  ACCOUNT_RATINGS: "account/ratings",
  ACCOUNT_ORDERS: "account/orders",

  ADMIN: "admin",
  DASHBOARD_ADMIN: "admin/dashboard",
  PRODUCTS_ADMIN: "admin/products",
  BRANDS_ADMIN: "admin/brands",
  CATEGOGIES_ADMIN: "admin/categories",
  ORDERS_ADMIN: "admin/orders",
  RATINGS_ADMIN: "admin/ratings",
  COUPONS_ADMIN: "admin/coupons",
  USERS_ADMIN: "admin/users",
};

export default path;
