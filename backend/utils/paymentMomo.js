const { momoConfig } = require("../configs/momoConfig");
const crypto = require("crypto");
const https = require("https");

const createMomoPayment = (order) => {
  return new Promise((resolve, reject) => {
    const orderId = order._id?.toString() || `${new Date().getTime()}`;
    const requestId = `${momoConfig.partnerCode}-${new Date().getTime()}`;
    const amount = order.total.toString();
    const orderInfo = `Thanh toán đơn hàng ${orderId}`;
    const extraData = Buffer.from(JSON.stringify({ orderId })).toString(
      "base64"
    );

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: momoConfig.partnerCode,
      partnerName: "Đặt hàng",
      storeId: "ElectronicStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId, // Đặt orderId bằng ID thật của đơn hàng
      orderInfo: orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: momoConfig.lang,
      requestType: momoConfig.requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature,
    });

    const options = {
      hostname: momoConfig.hostname,
      port: 443,
      path: momoConfig.path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => reject(error));
    req.write(requestBody);
    req.end();
  });
};

module.exports = {
  createMomoPayment,
};
