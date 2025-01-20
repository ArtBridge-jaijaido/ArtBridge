import fs from "fs";
import path from "path";
import crypto from "crypto";

export default function handler(req, res) {
  const { filename, mode } = req.query;

  // 拼接文件路径
  const filePath = path.join(process.cwd(), "public/images", filename);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  // 读取文件数据
  const fileData = fs.readFileSync(filePath);

  if (mode === "encrypt") {
    // 加密图片数据
    const secretKey = "test123"; // 替换为你的加密密钥
    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, Buffer.alloc(16, 0));
    const encrypted = Buffer.concat([cipher.update(fileData), cipher.final()]);

    // 设置下载文件头，强制保存为 .detail 文件
    res.setHeader("Content-Disposition", `attachment; filename="${filename}.detail"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).send(encrypted);
  } else {
    // 返回原始图片内容，用于网页显示
    res.setHeader("Content-Type", "image/png"); // 确保图片类型正确
    res.status(200).send(fileData);
  }
}
