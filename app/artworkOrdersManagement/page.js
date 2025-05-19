"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkDashboard = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {

    const dashboardPath = user.role === "artist" 
    ? "/artworkOrdersManagement/painterOrdersManagement" 
    : "/artworkOrdersManagement/consumerOrdersManagement";

    router.replace(dashboardPath); 
  }, [user, router]);
}

export default ArtworkDashboard;
