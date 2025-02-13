"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkAccountSetting = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {

    const accountSettingPath = user.role === "artist" 
    ? "/artworkAccountSetting/artworkPainterAccountSetting" 
    : "/artworkAccountSetting/artworkConsumerAccountSetting";

    router.replace(accountSettingPath); 
  }, [user, router]);
}

export default  ArtworkAccountSetting;
