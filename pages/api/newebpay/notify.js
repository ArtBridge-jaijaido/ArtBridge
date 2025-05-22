import crypto from "crypto";
import querystring from "querystring";
import {updateOrderAfterPaymentAdmin } from "@/services/artworkOrderServiceAdmin";

export const config = {
  api: {
    bodyParser: false, //  保持 raw body
  },
};

const HashKey = process.env.NEWEBPAY_HASH_KEY;
const HashIV = process.env.NEWEBPAY_HASH_IV;

function decryptHex(TradeInfo) {
    const decrypt = crypto.createDecipheriv('aes256', HashKey , HashIV );
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return JSON.parse(result);
  }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    // 🔽 收 raw body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString("utf8");

    // 🔽 解析 querystring 取得 TradeInfo
    const body = querystring.parse(rawBody);
    const { TradeInfo } = body;

   
    const result = decryptHex(TradeInfo);
    
    if (result.Status === "SUCCESS") {
      console.log("付款成功，更新訂單狀態");
      const merchantOrderNo = result.Result.MerchantOrderNo;
      const firebaseOrderId = merchantOrderNo.split("_")[0]; // order id = [0]
      await updateOrderAfterPaymentAdmin(firebaseOrderId);
    } else {
      console.warn("付款狀態非 SUCCESS：", result.Status);
    }
  } catch (error) {
    console.error("解密或更新失敗：", error);
    //  即使錯誤也要回 OK，避免金流重發通知
  }

  return res.status(200).send("OK");
}