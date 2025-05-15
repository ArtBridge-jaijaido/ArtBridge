// services/storageService.js
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase"; 

export const uploadImage = async (file, path) => {
  try {
    const imageRef = ref(storage, path);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("圖片上傳失敗:", error);
    return null;
  }
};


export const uploadPainterResumePdf = async (file, orderId, painterUid) => {
  const path = `artworkOrders/${orderId}/applicants/${painterUid}/resume.pdf`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};