"use client";
import React, { useState, useEffect } from "react";
import "./ArtworkCard.css";
import { FadeLoader } from "react-spinners";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import {toggleArtworkLike} from "@/services/artworkMarketService.js";
import {useSelector} from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import { usePathname } from "next/navigation";

/**
 * 
 * @param {onUnlike} 取消在artworkCollectionList 內的市集按讚並移除 
 * @returns 
 */

const ArtworkCard = ({ imageSrc, title, price, artistProfileImg, artistNickName, deadline,artistUid,artworkId,likedby , onUnlike }) => {
  const pathname = usePathname();
  const isCollectionPage = pathname.includes("artworkCollectionList");
  const [likeStates, setLikeStates] = useState({});
  const [pageType, setPageType] = useState("market"); // 預設是 market 頁面
  const [isImageLoaded, setIsImageLoaded] = useState(false); 
  const navigate = useNavigation();
  const { setIsLoading } = useLoading();
  const currentUser = useSelector((state) => state.user.user);
  const { addToast } = useToast();
  const isLiked = likeStates[artworkId] ?? likedby?.includes(currentUser?.uid);


  /*按讚功能*/
  const handleToggleLike = async (e) =>{
    e.stopPropagation();

    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔！");
      return;
    }

    try {
      const response = await toggleArtworkLike(artistUid, artworkId, currentUser.uid);
      if(response.success){
        const hasLiked = likedby?.includes(currentUser.uid);

        if (isCollectionPage) {
          onUnlike(artworkId);
        }

        setLikeStates((prev) => ({
          ...prev,
          [artworkId]: !hasLiked,
        }));

       
      }
    }catch(err){
      console.error("Error toggling like:", err);
      addToast("error", "按讚失敗，請稍後再試！");
    }
  }


  
  useEffect(() => {
    // 監聽路徑變更，確保 className 正確
    if (typeof window !== "undefined") {
      setPageType(window.location.pathname.includes("artworkPainterProfile") ? "painterProfile" : "market");
    }
  }, [typeof window !== "undefined" ? window.location.pathname : null]); // 監聽 pathname 變化



  const handleHeadingToProfile = (e) => {
    e.stopPropagation();
    navigate(`/artworkProfile/artworkPainterProfile/${artistUid}`);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
   
 };

  const handleHeadingToDetail = (e) => {
    e.stopPropagation();
    navigate(`/artworkDetails/${artworkId}?nickname=${encodeURIComponent(artistNickName)}&avatar=${encodeURIComponent(artistProfileImg)}&image=${encodeURIComponent(imageSrc)}`);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className={`Artwork-card-container ${pageType === "painterProfile" ? "painter-profile" : "market-style"}`}>
      {/* 圖片部分 */}
      <div className="Artwork-image-container">
        
        {/*  Loading Spinner */}
        {!isImageLoaded && (
          <div className="ArtworkCard-loader">
            <FadeLoader
              color="white"
              height={12}
              width={3}
              radius={5}
              margin={-4}
            />
          </div>
        )}

        {/* 圖片加載完成才顯示 */}
        <img
          src={imageSrc}
          alt={title}
          className={`Artwork-image ${isImageLoaded ? "loaded" : "hidden"}`}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)} 
          onClick={handleHeadingToDetail}
        />
      </div>

      {/* 商品標題 */}
      <span className="Artwork-title"
        onClick={handleHeadingToDetail} // 點擊標題時跳轉到詳細頁面
      >
        
        {title}</span>

      {/* 按讚按鈕 */}
      
        <button className="Artwork-favorite-button" onClick={handleToggleLike}>
          <img
            src={
              isLiked
              ? "/images/icons8-love-48-1.png"
              : "/images/icons8-love-96-26.png"
            }
            alt="favorite"
            className="Artwork-favorite-icon"
          />
        </button>

      
      {/* 下方內容 */}
      <div className="Artwork-card-content"> 



        {/* 價格與標籤 */}
        <div className="Artwork-footer-row">
          <div className="Artwork-profile-container">
                {/* 藝術家暱稱 */}
                {pageType === "market" && (
                  <>
                    <img src={artistProfileImg} alt="artist avatar" className="Artwork-artist-img" onClick={handleHeadingToProfile}/>
                    {/* 藝術家暱稱 */}
                    <span className="Artwork-artist-nickname">{artistNickName}</span>
                  </>
                )}
              {/* 截止日期（僅在 painter 頁面顯示） */}
              {pageType === "painterProfile" && deadline && (
                <span className="Artwork-artist-deadline">{deadline}</span>
              )}
          </div>
          {/* 商品價格 */}
          <span className="Artwork-price">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;