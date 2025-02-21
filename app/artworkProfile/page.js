"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkProfile = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {

    const profilePath = user.role === "artist" 
    ? "/artworkProfile/artworkPainterProfile" 
    : "/artworkProfile/artworkConsumerProfile";

    router.replace(profilePath); 
  }, [user, router]);
}

export default ArtworkProfile;