"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkDashboard = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {

    const dashboardPath = user.role === "artist" 
    ? "/artworkDashboard/painterDashboard" 
    : "/artworkDashboard/artworkConsumerDashboard";

    router.replace(dashboardPath); // `replace` 避免返回按鈕回到這個中間頁
  }, [user, router]);
}

export default ArtworkDashboard;
