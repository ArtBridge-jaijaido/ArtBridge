"use client";
import React from "react";
import "./ArtworkOrderCard.css";

const ArtworkOrderCard = ({
    orderIndex = "",
    statusLabel = "",
    OrderTitle = "",
    OrderSource = "",
    OrderEndDate = "",
    orderId = "",
    imageUrl = "",
}) => {
    return (
        <div className="artworkOrderCard-wrapper">
            <div className="artworkOrderCard-status">
                <span
                    className={`artworkOrderCard-index ${
                            statusLabel === "等待承接"
                            ? "waiting"
                            : statusLabel === "進行中"
                                ? "in-progress"
                            : statusLabel === "準時完成"
                                ? "completedOnTime"
                                    : ""
                        }`}
                >
                    {orderIndex}
                </span>

                <span
                    className={`artworkOrderCard-label ${
                        statusLabel === "等待承接"
                            ? "waiting"
                            : statusLabel === "進行中"
                                ? "in-progress"
                                : statusLabel === "準時完成"
                                    ? "completedOnTime"
                                    : ""
                        }`}
                >
                    {statusLabel}
                </span>
            </div>



            <div className="artworkOrderCard-main">
                <div className="artworkOrderCard-info">
                    <p><strong className="label">名稱</strong> {OrderTitle}</p>
                    <p><strong className="label">來源</strong> {OrderSource}</p>
                    <p><strong className="label">日期</strong> {OrderEndDate}</p>
                    <button className="artworkOrderCard-link">
                        查看應徵資訊
                    </button>
                </div>

                <div className="artworkOrderCard-meta">
                <p className="artworkOrderCard-vertical-id">
                    案件編號：<span>{orderId}</span>
                    </p>
                    <div className="artworkOrderCard-image">
                        {imageUrl ? (
                            <img src={imageUrl} alt="委託圖片" />
                        ) : (
                            <div className="artworkOrderCard-image-placeholder">
                                <p>圖片：<br />範例圖或是市集的圖，<br />沒有的話放上官方圖</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkOrderCard;
