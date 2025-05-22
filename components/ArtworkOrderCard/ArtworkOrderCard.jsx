"use client";
import React from "react";
import "./ArtworkOrderCard.css";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useSelector } from "react-redux";

const ArtworkOrderCard = ({
    orderIndex = "",
    statusLabel = "",
    OrderTitle = "",
    OrderSource = "",
    OrderEndDate = "",
    OrderAssignedPainter = "",
    orderId = "",
    imageUrl = "",
}) => {

    const navigate = useNavigation();
    const { setIsLoading } = useLoading();
    const allUsers = useSelector((state) => state.user.allUsers);
    const assignedPainterNickname = allUsers[OrderAssignedPainter]?.nickname || "使用者名稱";

    const handleNavigateTo = (e) => {
        e.stopPropagation();
        const targetPath =  `/artworkOrdersManagement/consumerOrdersManagement/entrustApplicants/${orderId}`;
        navigate(targetPath);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    }

    const handleNavigateToOrderDetail = (e) => {
        e.stopPropagation();
      
        if (OrderAssignedPainter) {
          const targetPath = `/artworkOrdersManagement/artworkOrderDetails/${orderId}`;
          navigate(targetPath);
      
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 1000);
        }
    };
      

    return (
        <div
            className={`artworkOrderCard-wrapper ${OrderAssignedPainter ? "clickable" : ""}`}
            onClick={handleNavigateToOrderDetail}
        >
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
                    <p><strong className="label">截止日期</strong> {OrderEndDate}</p>
                    {OrderAssignedPainter ? (
                        <p><strong className="label">指定繪師</strong> {assignedPainterNickname}</p>
                        ) : (
                        <button className="artworkOrderCard-link" onClick={handleNavigateTo}>
                            查看應徵資訊
                        </button>
                        )}

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
