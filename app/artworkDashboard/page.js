"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkDashboard = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (!user || !user.role) return; // 防止 user 尚未讀取完成

    const dashboardPath = user.role === "artist" 
    ? "/artworkDashboard/painterDashboard" 
    : "/artworkDashboard/artworkConsumerDashboard";

    router.replace(dashboardPath); // `replace` 避免返回按鈕回到這個中間頁
  }, [user, router]);

  return null; // 不渲染任何畫面（或顯示 loading 效果也可以）
}

export default ArtworkDashboard;
