"use client";
import { useRouter } from 'next/navigation';



// function to navigate to a different page
export const useNavigation = () => {
    const router = useRouter();

    const navigate = (path) => {
        router.push(path);
    };

    return navigate;
};



export const createLowResImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // ✅ 設定縮小比例 (10% 大小)
                canvas.width = img.width * 0.1;
                canvas.height = img.height * 0.1;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // ✅ 轉成 Blob (JPEG格式, 低品質)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const lowResFile = new File([blob], "blurredImage.jpg", { type: "image/jpeg" });
                        resolve(lowResFile);
                    } else {
                        reject(new Error("Failed to create low-res image"));
                    }
                }, "image/jpeg", 0.5);  // 0.5 代表降低圖片品質
            };
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export const formatTime = (timestamp) => {
    if (!timestamp) return "";
  
    // Firestore Timestamp ➜ JS Date
    const time = timestamp.toDate();  
    const now = new Date();
    const diff = (now - time) / 1000;
  
    if (diff < 60) return "剛剛";
    if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`;
  
    return time.toLocaleDateString(); // 超過一週就顯示日期
  };
  