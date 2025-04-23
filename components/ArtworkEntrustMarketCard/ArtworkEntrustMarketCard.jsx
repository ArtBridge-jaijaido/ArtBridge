"use client";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import "./ArtworkEntrustMarketCard.css";

const ArtworkEntrustMarketCard = ({ imageSrc, title, budget, isHistoryTab }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div className={`ArtworkEntrustMarketCard-card-container ${isHistoryTab ? "history-market" : ""}`}>
            {/* 圖片部分 */}
            <div className="ArtworkEntrustMarketCard-image-container">
                {!isImageLoaded && (
                    <div className="ArtworkEntrustMarketCard-loader">
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
                    className={`ArtworkEntrustMarketCard-image ${isImageLoaded ? "loaded" : "hidden"}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setIsImageLoaded(true)}
                />
            </div>

            {/* 標題 */}
            <span className={`ArtworkEntrustMarketCard-title ${isHistoryTab ? "history-market" : ""}`}>
                {title}
            </span>

            {/* 底部內容 */}
            <div className="ArtworkEntrustMarketCard-card-content">
                <div className="ArtworkEntrustMarketCard-footer-row">
                    <div className="ArtworkEntrustMarketCard-profile-container">
                        <button className="ArtworkEntrustMarketCard-edit">
                            {isHistoryTab ? "再次委託" : "編輯委託"}
                        </button>
                    </div>
                    <span className="ArtworkEntrustMarketCard-price">${budget}</span>
                </div>
            </div>
        </div>
    );
};

export default ArtworkEntrustMarketCard;
