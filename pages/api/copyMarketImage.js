import { adminStorage } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, artworkId, orderId, supplementaryImageUrls = [] } = req.body;

  if (!userId || !artworkId || !orderId) {
    return res.status(400).json({ error: "缺少參數" });
  }

  try {
    //  複製範例圖
    const examplePath = `artworkMarket/${userId}/${artworkId}/exampleImage.jpg`;
    const targetExamplePath = `artworkOrders/${orderId}/exampleImage.jpg`;

    await adminStorage.file(examplePath).copy(adminStorage.file(targetExamplePath));

    const [exampleMetadata] = await adminStorage.file(targetExamplePath).getMetadata();
    const exampleToken = exampleMetadata.metadata.firebaseStorageDownloadTokens;

    const copiedExampleImageUrl = `https://firebasestorage.googleapis.com/v0/b/${adminStorage.name}/o/${encodeURIComponent(targetExamplePath)}?alt=media&token=${exampleToken}`;

    //  複製補充圖
    const copiedSupplementaryImageUrls = [];

    for (let i = 0; i < supplementaryImageUrls.length; i++) {
      const sourcePath = `artworkMarket/${userId}/${artworkId}/supplementaryImage_${i + 1}.jpg`;
      const targetPath = `artworkOrders/${orderId}/supplementaryImage_${i + 1}.jpg`;

      const file = adminStorage.file(sourcePath);
      const [exists] = await file.exists();
      if (exists) {
        await file.copy(adminStorage.file(targetPath));

        const [suppMetadata] = await adminStorage.file(targetPath).getMetadata();
        const suppToken = suppMetadata.metadata.firebaseStorageDownloadTokens;

        const url = `https://firebasestorage.googleapis.com/v0/b/${adminStorage.name}/o/${encodeURIComponent(targetPath)}?alt=media&token=${suppToken}`;
        copiedSupplementaryImageUrls.push(url);
      }
    }

    return res.status(200).json({
      copiedExampleImageUrl,
      copiedSupplementaryImageUrls,
    });
  } catch (error) {
    console.error("圖片複製失敗：", error);
    return res.status(500).json({ error: "圖片複製失敗" });
  }
}
