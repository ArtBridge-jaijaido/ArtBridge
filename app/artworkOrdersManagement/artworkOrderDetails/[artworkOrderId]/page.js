
"use client";
import React, { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { fetchArtworkOrderById } from "@/services/artworkOrderService";
import { useSelector } from "react-redux";
import Masonry from "react-masonry-css";
import PainterMilestoneProgress from "@/components/PainterMilestoneProgress/PainterMilestoneProgress.jsx";
import "./artworkOrderDetails.css";

export default function ArtworkOrderDetailsPage() {

    const { artworkOrderId } = useParams();
    const router = useRouter();
    const [artworkOrder, setArtworkOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const allUsers = useSelector((state) => state.user.allUsers);
    const assignedPainterNickname = allUsers[artworkOrder?.assignedPainterUid]?.nickname || "使用者名稱";
    const breakpointColumnsObj = {
        default: 2, 
    };

    useEffect(() => {
        const getOrderData = async () => {
            const orderData = await fetchArtworkOrderById(artworkOrderId);
            setArtworkOrder(orderData);
            setLoading(false);
        };


        getOrderData();
    }, [artworkOrderId]);



    if (loading) return <p>載入中...</p>;


    return (
        <div className={`artworkOrderDetailsPage ${notoSansTCClass}`} >

            <div className="artworkOrderDetails-wrapper">
                <div className="artworkOrderDetails-header">
                    {/* 左側：基本資訊 */}
                    <div className="artworkOrderDetails-left">
                        <div className="artworkOrderDetails-button-container">
                            <button className="artworkOrderDetails-back-button" onClick={() => router.back()}>
                                <img src="/images/icons8-return-80.png" alt="Back" />
                                <span>返回</span>
                            </button>
                        </div>
                        <div className="artworkOrderDetails-orderInfo-container">
                            <div className="artworkOrderDetails-info-item">
                                <strong>名稱</strong> <span>{artworkOrder.marketName}</span>
                            </div>
                            <div className="artworkOrderDetails-info-item">
                                <strong>對象</strong> <span>{assignedPainterNickname}</span>
                            </div>
                            <div className="artworkOrderDetails-info-item">
                                <strong>來源</strong> <span>{artworkOrder.orderSource}</span>
                            </div>
                            <div className="artworkOrderDetails-info-item">
                                <strong>價格</strong> <span>{artworkOrder.price}元</span>
                            </div>
                            <div className="artworkOrderDetails-info-item">
                                <strong>截止日期</strong> <span>{artworkOrder.endDate}</span>
                            </div>
                        </div>

                        <div className="artworkOrderDetails-description-container">
                            <strong>需求內文</strong>
                            <p>{artworkOrder.description}</p>
                        </div>
                        <div className="artworkOrderDetails-supplementaryImage-container">
                            <strong>補充圖片</strong>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="artworkOrderDetails-masonry"
                                columnClassName="artworkOrderDetails-masonry-column"
                            >
                                {artworkOrder.supplementaryImageUrls?.map((url, index) => (
                                    <img
                                        loading="lazy"
                                        key={index}
                                        src={url}
                                        alt={artworkOrder.supplementaryImageName?.[index] || `補充圖片${index + 1}`}
                                        className="artworkOrderDetails-masonry-image"
                                    />
                                ))}
                            </Masonry>
                        </div>

                    </div>

                    {/* 右側：圖片與按鈕 */}
                    <div className="artworkOrderDetails-right">
                        <button className="artworkOrderDetails-terminate-button">終止委託</button>

                        <div className="artworkOrderDetails-image-containter">
                            {artworkOrder.exampleImageUrl ? (
                                <img src={artworkOrder.exampleImageUrl} alt="範例圖" />
                            ) : (
                                <p>圖片：<br />範例圖或是市集的圖，<br />沒有的話放上官方圖</p>
                            )}
                        </div>

                        <p className="artworkOrderDetails-id">案件編號：{artworkOrder.artworkOrderId}</p>
                    </div>
                </div>
                {/*補充資訊*/}            
                <div className="artworkOrderDetails-requirement-container">

                    <h2>詳細要求</h2>
                    <div className="artworkOrderDetails-requirement-infoItem-container">
                        <div className="artworkOrderDetails-requirement-infoItem">
                            <strong>類別</strong> <span>{artworkOrder.category}</span>
                        </div>
                        <div className="artworkOrderDetails-requirement-infoItem">
                            <strong>尺寸</strong> <span>{artworkOrder.size}</span>
                        </div>
                        <div className="artworkOrderDetails-requirement-infoItem">
                            <strong>格式</strong> <span>{artworkOrder.fileFormat}</span>
                        </div>
                        <div className="artworkOrderDetails-requirement-infoItem">
                            <strong>進度回報</strong> <span>{artworkOrder.reportProgress}</span>
                        </div>
                        <div className="artworkOrderDetails-requirement-infoItem">
                            <strong>作品權限</strong> <span>{artworkOrder.permission}</span>
                        </div>
                    </div>
                </div>

                {/*流程圖*/}
                <div className="artworkOrderDetails-progress-container">
                    <h2>流程圖</h2>
                    <PainterMilestoneProgress milestones={artworkOrder.artworkOrderMilestones} status={true} />
                </div>

                {/*小提醒*/}
                <div className="artworkOrderDetails-reminder-container">
                    <h2>🚨 小提示</h2>
                    <p>為了保障雙方權益，官方會先向委託方收取款項進行保管，完成並且交付作品後，站方再將款項交給繪師，若有任何爭議，會交由平台進行審核。</p>
                </div>







            </div>
        </div>
    );
}