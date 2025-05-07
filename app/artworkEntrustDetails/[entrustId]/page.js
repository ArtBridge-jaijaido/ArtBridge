"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { fetchEntrustById } from "@/services/artworkEntrustService.js";
import { useSelector } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import ModalImgApplyEntrust from "@/components/ModalImage/ModalImgApplyEntrust";
import Masonry from "react-masonry-css";
import PainterMilestoneProgress from "@/components/PainterMilestoneProgress/PainterMilestoneProgress.jsx";
import "./artworkEntrustDetails.css";



export default function EntrustDetailPage({ params }) {


    const currentUser = useSelector((state) => state.user.user);
    const searchParams = useSearchParams();
    const { entrustId } = use(params);
    const entrustImageUrl = searchParams.get("image");
    const entrustNickname = searchParams.get("nickname");
    const entrustProfileImg = searchParams.get("avatar");
    const { addToast } = useToast();

    // 狀態存儲FireStore抓到的 entrust 資料
    const [entrust, setEntrust] = useState(null);
    const [loading, setLoading] = useState(true);

    // ModalImgApplyEntrust 的狀態
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const breakpointColumnsObj = {
        default: 2,
        440: 1,
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEntrustById(entrustId);
            setEntrust(data);
            setLoading(false);
        };

        fetchData();
    }, [entrustId]);

    const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
        });
    };

    /*handle apply entrust*/ 
    const handleApplyModalOpen = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            addToast("error", "請先登入才能應徵喔！");
            return;
        }

        try {
            // 預載 artwork 主圖與畫師頭貼
            await Promise.all([
                preloadImage(entrustProfileImg),
            ]);
            setIsApplyModalOpen(true);
        } catch (err) {
            addToast("error", "圖片載入失敗，請稍後再試");
        }
    }

    // loading 狀態
    if (loading) return <p>載入中...</p>;
    if (!entrust) return <p>找不到市集</p>;

    return (
        <div className={`artworkEntrustDetails-page ${notoSansTCClass}`}>
            {/* 頂部區塊 */}
            <div className="artworkEntrustDetails-header">
                {/* 左半邊 */}
                <div className="artworkEntrustDetails-left">
                    <div className="artworkEntrustDetails-titleRow">
                        <h1 className="artworkEntrustDetails-title">{entrust.marketName}</h1>
                        <p className="artworkEntrustDetails-price">
                            NT.<span className="artworkEntrustDetails-price-number">{entrust.price.slice(0, -1)}</span>元
                        </p>
                    </div>

                    <div className="artworkEntrustDetails-artistTopRow">
                        <div className="artworkEntrustDetails-artistTopRow-left">
                            <img
                                src={entrustProfileImg}
                                alt="畫師頭像"
                                className="artworkEntrustDetails-artistAvatar"

                            />
                            <span className="artworkEntrustDetails-artist-name">{entrustNickname}</span>
                        </div>
                        <div className="artworkEntrustDetails-buttonRow">
                            <button className="artworkEntrustDetails-apply-button" onClick={handleApplyModalOpen}>
                                <img src="/images/icons8-apply-96-1.png" alt="applyIcon" />
                                我要應徵
                            </button>
                        </div>
                    </div>

                    <div className="artworkEntrustDetails-stats">
                        <div>合作評分 <span className="blue">100%</span></div>
                        <div>用途 <span className="blue">{entrust.usage}</span></div>
                    </div>

                </div>

                {/* 右半邊 */}
                <div className="artworkEntrustDetails-right">

                    <div className="artworkEntrustDetails-infoTable">
                        <div className="artworkEntrustDetails-infoTable-group">
                            <div className="artworkEntrustDetails-infoTable-label">市集結束時間</div>
                            <div className="artworkEntrustDetails-infoTable-value">{entrust.endDate}</div>
                        </div>
                        <div className="artworkEntrustDetails-infoTable-group">
                            <div className="artworkEntrustDetails-infoTable-label">完稿時間</div>
                            <div className="artworkEntrustDetails-infoTable-value">{entrust.completionTime}</div>
                        </div>
                        <div className="artworkEntrustDetails-infoTable-group">
                            <div className="artworkEntrustDetails-infoTable-label">類別</div>
                            <div className="artworkEntrustDetails-infoTable-value">{entrust.selectedCategory}</div>
                        </div>
                        <div className="artworkEntrustDetails-infoTable-group">
                            <div className="artworkEntrustDetails-infoTable-label">風格</div>
                            <div className="artworkEntrustDetails-infoTable-value">
                                {Array.isArray(entrust.selectedStyles)
                                    ? entrust.selectedStyles.join("、")
                                    : entrust.selectedStyles || "未提供"}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* 範例圖片*/}
            <div className="artworkEntrustDetails-section">
                <h2>範例圖片</h2>
                <div className="artworkEntrustDetails-image-wrapper">
                    <img
                        src={entrustImageUrl}
                        alt="委託商品圖片"
                        className="artworkEntrustDetails-image"
                    />
                </div>
            </div>

            {/* 補充圖片 */}
            <div className="artworkEntrustDetails-section">
                <h2>補充圖片</h2>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="artworkEntrustDetails-masonry"
                    columnClassName="artworkEntrustDetails-masonry-column"
                >
                    {entrust.supplementaryImageUrls?.map((url, index) => (
                        <img
                            loading="lazy"
                            key={index}
                            src={url}
                            alt={entrust.supplementaryImageName?.[index] || `補充圖片${index + 1}`}
                            className="artworkEntrustDetails-masonry-image"
                        />
                    ))}
                </Masonry>
            </div>

            {/* 補充內文 */}
            <div className="artworkEntrustDetails-section">
                <h2>詳細內文</h2>
                <p className="artworkEntrustDetails-innerText">{entrust.description}</p>
            </div>

            {/* 流程圖 */}
            <div className="artworkEntrustDetails-section">
                <h2>流程圖</h2>
                <div className="artworkEntrustDetails-progress-container">
                    <PainterMilestoneProgress milestones={entrust.milestones} />
                </div>
            </div>

            {/* 補充資訊 */}
            <div className="artworkEntrustDetails-supplementaryInfo-section">
                <h2>補充資訊</h2>
                <div className="artworkEntrustDetails-supplementaryInfo-container">
                    <p>完稿格式：{entrust.fileFormat}</p>
                    <p>作品尺寸：{entrust.size}px</p>
                    <p>回報進度：{entrust.reportProgress}</p>
                    <p>色彩模式 : {entrust.colorMode}</p>
                    <p>權限：{entrust.permission}</p>
                    <p>應徵人數：{entrust.applicationCount}人</p>
                </div>
            </div>


            <ModalImgApplyEntrust
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                entrustData={entrust}
                entrustNickname={entrustNickname}
                entrustProfileImg={entrustProfileImg}
            />



        </div>
    );










}