"use client";
import React, { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners"; 
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import "./ArtworkPainterMarketCard.css";

const ArtworkPainterMarketCard = ({ artworkId, imageSrc, title, price, isHistoryTab, artistNickName, artistProfileImg }) => {
    const [isFavorite, setIsFavorite] = useState(false); 
    const [isImageLoaded, setIsImageLoaded] = useState(false); // 圖片加載狀態
    const navigate = useNavigation();
      const { setIsLoading } = useLoading();
  
    const handleHeadingToDetail = (e) => {
        e.stopPropagation();
        navigate(`/artworkDetails/${artworkId}?nickname=${encodeURIComponent(artistNickName)}&avatar=${encodeURIComponent(artistProfileImg)}&image=${encodeURIComponent(imageSrc)}`);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
      };

    return (
        <div className={`ArtworkPainterMarketCard-card-container ${isHistoryTab ? "history-market" : ""}`}>
            {/* 圖片部分 */}
            <div className="ArtworkPainterMarketCard-image-container">
                {!isImageLoaded && (
                    <div className="ArtworkPainterMarketCard-loader">
                        <FadeLoader
                            color="white"
                            height={12}
                            width={3}
                            radius={5}
                            margin={-4}
                        />
                    </div>
                )}

                <img
                    src={imageSrc}
                    alt={title}
                    className={`ArtworkPainterMarketCard-image ${isImageLoaded ? "loaded" : "hidden"}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setIsImageLoaded(true)} // 如果圖片加載失敗也隱藏 Spinner
                    onClick={handleHeadingToDetail}
                />
            </div>

            {/* 商品標題 */}
            <span 
            className={`ArtworkPainterMarketCard-title ${isHistoryTab ? "history-market" : ""}`}
            onClick={handleHeadingToDetail}
            >
                {title}
            </span>

            {/* 下方內容 */}
            <div className="ArtworkPainterMarketCard-card-content">
                {/* 價格與標籤 */}
                <div className="ArtworkPainterMarketCard-footer-row">
                    <div className="ArtworkPainterMarketCard-profile-container">
                        {/* 編輯商品按鈕 */}
                        <button className="ArtworkPainterMarketCard-edit">
                            {isHistoryTab ? "重新上架" : "編輯商品"}
                        </button>
                    </div>
                    {/* 商品價格 */}
                    <span className="ArtworkPainterMarketCard-price">${price}</span>
                </div>
            </div>
        </div>
    );
};

export default ArtworkPainterMarketCard;
