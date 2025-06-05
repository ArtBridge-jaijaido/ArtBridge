"use client";
import { useState } from "react";
import "./ArtworkOrderCard.css";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { updateArtworkOrder } from "@/services/artworkOrderService.js";
import ModalImgMarketOrderPreview from "@/components/ModalImage/ModalImgMarketOrderPreview.jsx";
import { useSelector } from "react-redux";

const preloadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });


const ArtworkOrderCard = ({
    orderIndex = "",
    statusLabel = "",
    OrderTitle = "",
    OrderSource = "",
    OrderEndDate = "",
    OrderAssignedPainter = "",
    orderId = "",
    exampleImageUrl = "",
    referenceImageUrl = "",
    customRequirement = "",
}) => {

    const navigate = useNavigation();
    const { setIsLoading } = useLoading();
    const allUsers = useSelector((state) => state.user.allUsers);
    const assignedPainterNickname = allUsers[OrderAssignedPainter]?.nickname || "使用者名稱";
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
   
    
    const handleViewEntrustApplicant = (e) => {
        e.stopPropagation();
        const targetPath = `/artworkOrdersManagement/consumerOrdersManagement/entrustApplicants/${orderId}`;
        navigate(targetPath);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    }

    const handleNavigateToOrderDetail = (e) => {
        e.stopPropagation();
        const targetPath = `/artworkOrdersManagement/artworkOrderDetails/${orderId}`;
        navigate(targetPath);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);

    };

    // 市集 繪師接受承接
    const handleAcceptOrder = async (e, orderId) => {

        // 臨時設置 為測試isVisibleToConsumer 是否讓委託方同步顯示案件
        e.stopPropagation();
        try {
            await updateArtworkOrder(orderId, {
                isVisibleToConsumer: true,
            });
            console.log(" 承接成功並已更新訂單狀態");
        } catch (error) {
            console.error(" 接受訂單失敗", error);
        }
    };


    // 市集 view 委託方參考圖及需求說明
    const openMarketPreviewModal = async (e) => {
        e.stopPropagation();
        
        try {
          await preloadImage(referenceImageUrl);
          setIsPreviewModalOpen(true);
        } catch (error) {
          console.error("圖片預載失敗", error);
        } 
      };

    return (
        <div
            className={"artworkOrderCard-wrapper"}
            onClick={handleNavigateToOrderDetail}
        >
            <div className="artworkOrderCard-status">
                <span
                    className={`artworkOrderCard-index ${statusLabel === "等待承接" || statusLabel === "等待回應"
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
                    className={`artworkOrderCard-label ${statusLabel === "等待承接" || statusLabel === "等待回應"
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
                    {OrderSource === "委託大廳" && !OrderAssignedPainter ? (
                        <button className="artworkOrderCard-link" onClick={handleViewEntrustApplicant}>
                            查看應徵資訊
                        </button>
                    ) : OrderSource === "市集" && statusLabel === "等待回應" ? (
                        <div className="artworkOrderCard-market-buttons">
                            <button className="artworkOrderCard-confirm-button" onClick={(e) => handleAcceptOrder(e, orderId)}>
                                確認承接
                            </button>
                            <button className="artworkOrderCard-reject-button" onClick={() => handleRejectOrder(orderId)}>
                                拒絕承接
                            </button>

                        </div>
                    ) : (
                        <p><strong className="label">指定繪師</strong> {assignedPainterNickname}</p>
                    )}


                </div>

                <div className="artworkOrderCard-meta">
                    <p className="artworkOrderCard-vertical-id">
                        案件編號：<span>{orderId}</span>
                    </p>
                    <div className="artworkOrderCard-image"
                        onClick={(e) => {
                        e.stopPropagation(); 
                        
                      }}
                    >
                        {OrderSource === "市集" ? (
                            <div className="artworkOrderCard-market-image-placeholder"
                                onClick={openMarketPreviewModal}
                            >
                                <p>
                                    點此查看<br />
                                    圖片及說明
                                </p>
                            </div>
                        ) : exampleImageUrl ? (
                            <img src={exampleImageUrl} alt="委託圖片" />
                        ) : (
                            <div className="artworkOrderCard-image-placeholder">
                                <p>
                                    圖片：<br />
                                    範例圖或是市集的圖，<br />
                                    沒有的話放上官方圖
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ModalImgMarketOrderPreview
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                referenceImageUrl={referenceImageUrl}
                customRequirement={customRequirement}
            />
        </div>

    );
};

export default ArtworkOrderCard;
