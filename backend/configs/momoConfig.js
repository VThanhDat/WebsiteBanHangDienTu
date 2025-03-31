const momoConfig = {
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: "MOMO",  
  redirectUrl: process.env.CLIENT_URL + "/payment/success",
  ipnUrl:
    "https://48e6-2405-4802-a69a-b860-745b-378c-df5b-f9e7.ngrok-free.app/api/order/momo-ipn", // Cập nhật IPN URL
  hostname: "test-payment.momo.vn",
  path: "/v2/gateway/api/create",
  requestType: "payWithMethod",
  lang: "vi",
};

module.exports = { momoConfig };
