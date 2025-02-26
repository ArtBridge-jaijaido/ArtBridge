"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ArtworkProfile = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (!user) return; 

    const profilePath = user.role === "artist" 
      ? `/artworkProfile/artworkPainterProfile/${user.uid}`
      : `/artworkProfile/artworkConsumerProfile/${user.uid}`;

    router.replace(profilePath); 
  }, [user, router]);

  return null;
}

export default ArtworkProfile;