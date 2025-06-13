import crypto from "crypto";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false,
  },
};

const HashKey = process.env.NEWEBPAY_HASH_KEY;
const HashIV = process.env.NEWEBPAY_HASH_IV;

function decryptHex(TradeInfo) {
  const decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, "hex", "utf8");
  const plainText = text + decrypt.final("utf8");
  const result = plainText.replace(/[\x00-\x20]+/g, "");
  return JSON.parse(result);
}

export default async function handler(req, res) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const rawBody = Buffer.concat(buffers).toString("utf8");

  const body = querystring.parse(rawBody);
  const { TradeInfo } = body;

  let redirectPath = "/"; // 預設首頁

  try {
    const result = decryptHex(TradeInfo);
    const merchantOrderNo = result.Result.MerchantOrderNo;
    const [type] = merchantOrderNo.split("_");

    switch (type) {
      case "entrust":
        redirectPath = "/artworkOrdersManagement/consumerOrdersManagement";
        break;
      case "market":
        redirectPath = "/artworkOrdersManagement/consumerOrdersManagement";
        break;
      default:
        redirectPath = "/";
    }
  } catch (error) {
    console.error("解密錯誤或取值失敗：", error);
  }

  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="zh-Hant">
      <head>
        <meta charset="UTF-8" />
        <title>付款完成</title>
      </head>
      <body>
        <script>
          alert("付款成功！返回管理頁面");
          window.location.href = "${redirectPath}";
        </script>
      </body>
    </html>
  `);
}
