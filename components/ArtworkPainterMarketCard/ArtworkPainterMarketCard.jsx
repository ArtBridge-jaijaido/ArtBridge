"use client";
import React, { useState, useEffect } from "react";
import "./ArtworkPainterMarketCard.css";

const ArtworkPainterMarketCard = ({ imageSrc, title, price, isHistoryTab }) => {
    const [isFavorite, setIsFavorite] = useState(false); 
    const [pageType, setPageType] = useState("Available"); // 預設是 market 頁面

  return (
    <div className={`ArtworkPainterMarketCard-card-container ${isHistoryTab ? "history-market" : ""}`}>
      {/* 圖片部分 */}
      <div className="ArtworkPainterMarketCard-image-container">
        <img src={imageSrc} alt={title} className="ArtworkPainterMarketCard-image" />
      </div>

      {/* 商品標題 */}
      <span className={`ArtworkPainterMarketCard-title ${isHistoryTab ? "history-market" : ""}`}>{title}</span>

      
      {/* 下方內容 */}
      <div className="ArtworkPainterMarketCard-card-content"> 

        {/* 價格與標籤 */}
        <div className="ArtworkPainterMarketCard-footer-row">
          <div className="ArtworkPainterMarketCard-profile-container">
            {/* 編輯商品按鈕 */}
            <button className="ArtworkPainterMarketCard-edit">{isHistoryTab ? "重新上架" : "編輯商品"}</button>
          </div>
          {/* 商品價格 */}
          <span className="ArtworkPainterMarketCard-price">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkPainterMarketCard;