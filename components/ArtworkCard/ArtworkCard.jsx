"use client";
import React, { useState } from "react";
import "./ArtworkCard.css";

const ArtworkCard = ({ imageSrc, title, price, artistProfileImg, artistNickName }) => {

  const [isFavorite, setIsFavorite] = useState(false); 

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="Artwork-card-container">
      {/* 圖片部分 */}
      <div className="Artwork-image-container">
        <img src={imageSrc} alt={title} className="Artwork-image" />
      </div>

      {/* 商品標題 */}
      <span className="Artwork-title">{title}</span>

      {/* 收藏按鈕 */}
      <button className="Artwork-favorite-button" onClick={toggleFavorite}>
        <img
          src={isFavorite ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"}
          alt="favorite"
          className="Artwork-favorite-icon"
        />
      </button>
      
      {/* 下方內容 */}
      <div className="Artwork-card-content">


        


        {/* 價格與標籤 */}
        <div className="Artwork-footer-row">
          <div className="Artwork-profile-container">
            {/* 藝術家照片*/}
            <img src={artistProfileImg} alt="artist" className="Artwork-artist-img" />
            {/* 藝術家暱稱 */}
            <span className="Artwork-artist-nickname">{artistNickName}</span>
          </div>
          {/* 商品價格 */}
          <span className="Artwork-price">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;