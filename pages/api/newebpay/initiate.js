import crypto from "crypto";

const merchantID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const HashKey = process.env.NEWEBPAY_HASH_KEY;
const HashIV = process.env.NEWEBPAY_HASH_IV;
const actionURL = "https://ccore.newebpay.com/MPG/mpg_gateway";



function aesEncrypt(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function shaEncrypt(data) {
  return crypto.createHash("sha256").update(data).digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  const { artistNickname, amount } = req.body;
  const orderId = "ORDER" + Date.now();

  const tradeInfoObject = {
    MerchantID: merchantID,
    RespondType: "JSON",
    TimeStamp: Math.floor(Date.now() / 1000).toString(),
    Version: "2.0",
    MerchantOrderNo: orderId,
    Amt: amount,
    ItemDesc: `繪師委託-${artistNickname}`,
    ReturnURL: "https://yourdomain.com/api/newebpay/notify",
    ClientBackURL: "http://localhost:3000/artworkOrdersManagement/consumerOrdersManagement"
  };
  
  const tradeInfoStr = new URLSearchParams(tradeInfoObject).toString();
  const encrypted = aesEncrypt(tradeInfoStr, Buffer.from(HashKey, "utf8"), Buffer.from(HashIV, "utf8"));
  const sha = shaEncrypt(`HashKey=${HashKey}&${encrypted}&HashIV=${HashIV}`);

  console.log("Trade Info:", tradeInfoStr);


  res.status(200).send(`
    <html><body>
      <form id="newebpayForm" method="post" action="${actionURL}">
        <input type="hidden" name="MerchantID" value="${merchantID}" />
        <input type="hidden" name="TradeInfo" value="${encrypted}" />
        <input type="hidden" name="TradeSha" value="${sha}" />
        <input type="hidden" name="Version" value="2.0" />
      </form>
      <script>document.getElementById("newebpayForm").submit();</script>
    </body></html>
  `);
}
