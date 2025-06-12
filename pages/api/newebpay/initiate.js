import crypto from "crypto";
import { pendingPainterTempData } from "@/services/artworkOrderServiceAdmin";

const merchantID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const HashKey = process.env.NEWEBPAY_HASH_KEY;
const HashIV = process.env.NEWEBPAY_HASH_IV;
const actionURL = "https://ccore.newebpay.com/MPG/mpg_gateway"; // 測試環境

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
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");


  const { artistNickname, amount, orderId, artistUid, expectedDays, expectedPrice,type } = req.body;

  if (!artistNickname || !amount || !orderId || !artistUid || !expectedDays || !expectedPrice || !type ) {
    return res.status(400).send("missing required fields");
  }

  const uniqueOrderNo = `${type}_${orderId}_${Date.now()}`; 
  let clickBackURL = "";
  let itemDesc = "";
  let tradeTempStoragePromise = Promise.resolve();

  switch (type) {
      case "entrust":
        clickBackURL = "https://afd7-114-46-14-33.ngrok-free.app/artworkOrdersManagement/consumerOrdersManagement";
        itemDesc = `繪師委託-${artistNickname}`;
        tradeTempStoragePromise = pendingPainterTempData(orderId, artistUid, expectedDays, expectedPrice);
        break;
      case "market":
     
        break;
    default:
      return res.status(400).send("無效的付款類型");
}
       
  
  await tradeTempStoragePromise; 


  const tradeInfoObject = {
    MerchantID: merchantID, 
    RespondType: "JSON",
    TimeStamp: Math.floor(Date.now() / 1000).toString(),
    Version: "2.0",
    MerchantOrderNo: uniqueOrderNo,
    Amt: amount,
    ItemDesc: itemDesc,
    ReturnURL: "https://afd7-114-46-14-33.ngrok-free.app/api/newebpay/return", 
    NotifyURL: "https://afd7-114-46-14-33.ngrok-free.app/api/newebpay/notify", 
    ClientBackURL: clickBackURL
  };

  const tradeInfoStr = new URLSearchParams(tradeInfoObject).toString();
  const encrypted = aesEncrypt(tradeInfoStr, Buffer.from(HashKey, "utf8"), Buffer.from(HashIV, "utf8"));
  const sha = shaEncrypt(`HashKey=${HashKey}&${encrypted}&HashIV=${HashIV}`);

  res.status(200).send(`<!DOCTYPE html>
<html>
  <body>
    <form id="newebpayForm" method="post" action="${actionURL}">
      <input type="hidden" name="MerchantID" value="${merchantID}" />
      <input type="hidden" name="TradeInfo" value="${encrypted}" />
      <input type="hidden" name="TradeSha" value="${sha}" />
      <input type="hidden" name="Version" value="2.0" />
    </form>
    <script>document.getElementById("newebpayForm").submit();</script>
  </body>
</html>`);
}

