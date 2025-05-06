"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { fetchArtworkById } from "@/services/artworkMarketService";
import { toggleArtworkLike, toggleReportArtwork } from "@/services/artworkMarketService.js";
import { useNavigation } from "@/lib/functions.js";
import { useSelector } from "react-redux";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import ModalImgBuyArtwork from "@/components/ModalImage/ModalImgBuyArtwork.jsx";
import Masonry from "react-masonry-css";
import "./artworkDetails.css";

export default function ArtworkDetailPage({ params }) {

    const currentUser = useSelector((state) => state.user.user);
    const [likeStates, setLikeStates] = useState({});
    const searchParams = useSearchParams();
    const { artworkId } = use(params);
    const artworkImageUrl = searchParams.get("image");
    const artistNickname = searchParams.get("nickname");
    const artistProfileImg = searchParams.get("avatar");
    const navigate = useNavigation();
    const { addToast } = useToast();
    const { setIsLoading } = useLoading();

    //  狀態儲存 Firestore 抓到的 artwork 資料
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLiked = likeStates[artworkId] ?? artwork?.likedBy?.includes(currentUser?.uid);
    const hasReported = artwork?.reportedBy?.includes(currentUser?.uid);

    // ModalImgBuyArtwork 的狀態
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const breakpointColumnsObj = {
        default: 2,
        440: 1,
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchArtworkById(artworkId);
            setArtwork(data);
            setLoading(false);
        };

        fetchData();
    }, [artworkId]);

    /*toggle like*/
    const handleToggleLike = async (e) => {
        e.stopPropagation();

        if (!currentUser) {
            addToast("error", "請先登入才能按讚喔！");
            return;
        }

        try {
            const response = await toggleArtworkLike(artwork.userUid, artwork.artworkId, currentUser.uid);
            if (response.success) {
                const hasLiked = artwork?.likedBy?.includes(currentUser.uid);

                // 更新 artwork.likedBy 陣列
                const updatedLikedBy = hasLiked
                    ? artwork.likedBy.filter((uid) => uid !== currentUser.uid)
                    : [...artwork.likedBy, currentUser.uid];

                setArtwork((prev) => ({
                    ...prev,
                    likedBy: updatedLikedBy,
                }));

                setLikeStates((prev) => ({
                    ...prev,
                    [artworkId]: !hasLiked,
                }));


            }
        } catch (err) {
            console.error("Error toggling like:", err);
            addToast("error", "按讚失敗，請稍後再試！");
        }
    }

    /* handle report*/
    const handleReport = async (e) => {
        e.stopPropagation();

        if (!currentUser) {
            addToast("error", "請先登入才能檢舉！");
            return;
        }

        const hasReported = artwork?.reportedBy?.includes(currentUser.uid);

        const confirmed = window.confirm(
            hasReported ? "確定要取消檢舉此市集嗎？" : "確定要檢舉此市集嗎？"
        );
        if (!confirmed) return;

        const result = await toggleReportArtwork(artwork.userUid, artwork.artworkId, currentUser.uid);

        if (result.success) {
            setArtwork((prev) => ({
                ...prev,
                reportedBy: result.reported
                    ? [...(prev.reportedBy || []), currentUser.uid]
                    : prev.reportedBy.filter((uid) => uid !== currentUser.uid),
            }));

            addToast("success", result.reported ? "已成功送出檢舉" : "已取消檢舉");


        } else {
            addToast("error", "操作失敗，請稍後再試！");
        }
    };

    const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
        });
    };


    /*handle buy artwork*/
    const handleBuyArtwork = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            addToast("error", "請先登入才能購買喔！");
            return;
        }

        try {
            // 預載 artwork 主圖與畫師頭貼
            await Promise.all([
                preloadImage(artworkImageUrl),
                preloadImage(artistProfileImg),
            ]);
            setIsBuyModalOpen(true);
        } catch (err) {
            addToast("error", "圖片載入失敗，請稍後再試");
        }
    };


    /*heading artist profile page*/
    const handleArtistProfileClick = (e) => {
        e.stopPropagation();
        const targetPath = `/artworkProfile/artworkPainterProfile/${artwork.userUid}`;
        navigate(targetPath);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    }


    // loading 狀態
    if (loading) return <p>載入中...</p>;
    if (!artwork) return <p>找不到市集</p>;



    return (
        <div className={`artworkDetails-page ${notoSansTCClass}`}>
            {/* 頂部區塊 */}
            <div className="artworkDetails-header">
                {/* 左半邊 */}
                <div className="artworkDetails-left">

                    <div className="artworkDetails-titleRow">
                        <h1 className="artworkDetails-title">{artwork.marketName}</h1>
                        <p className="artworkDetails-price">
                            NT.<span className="artworkDetails-price-number">{artwork.price}</span>元
                        </p>
                    </div>

                    <div className="artworkDetails-image-wrapper">
                        <img
                            src={artworkImageUrl}
                            alt="商品圖片"
                            className="artworkDetails-image"
                        />
                        <div className="artworkDetails-report"
                            onClick={handleReport}
                        >
                            <img
                                src={hasReported ? "/images/exclamation-icon.png" : "/images/icons8-exclamation-mark-64-1.png"}
                                alt="reportIcon"
                            />
                            {hasReported ? "取消檢舉" : "我要檢舉"}
                        </div>
                    </div>
                </div>

                {/* 右半邊 */}
                <div className="artworkDetails-right">
                    <div className="artworkDetails-artistTopRow">

                        <div className="artworkDetails-artistTopRow-left">
                            <img
                                src={artistProfileImg}
                                alt="畫師頭像"
                                className="artworkDetails-artistAvatar"
                                onClick={handleArtistProfileClick}
                            />
                            <span className="artworkDetails-artist-name">{artistNickname}</span>
                        </div>
                        <div className="artworkDetails-artist-rating">5 ★ </div>
                    </div>

                    <div className="artworkDetails-stats">
                        <div>準時完成率 <span className="blue">100%</span></div>
                        <div>信譽評分 <span className="blue">100分</span></div>
                    </div>

                    <div className="artworkDetails-buttonRow">
                        <button className="artworkDetails-buy-button" onClick={handleBuyArtwork}>
                            <img src="/images/icons8-pay-96-1.png" alt="buyIcon" />
                            我要購買
                        </button>
                        <button className="artworkDetails-like-button"
                            onClick={handleToggleLike}
                        >
                            <img src={
                                isLiked
                                    ? "/images/icons8-love-48-1.png"
                                    : "/images/icons8-love-96-26.png"
                            } alt="likeIcon" />
                            按讚收藏
                        </button>
                    </div>

                    <div className="artworkDetails-infoTable">

                        <div className="artworkDetails-infoTable-group">
                            <div className="artworkDetails-infoTable-label">市集結束時間</div>
                            <div className="artworkDetails-infoTable-value">{artwork.endDate}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="artworkDetails-infoTable-label">完稿時間</div>
                            <div className="artworkDetails-infoTable-value">{artwork.completionTime}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="artworkDetails-infoTable-label">類別</div>
                            <div className="artworkDetails-infoTable-value">{artwork.selectedCategory}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="artworkDetails-infoTable-label">風格</div>
                            <div className="artworkDetails-infoTable-value">
                                {Array.isArray(artwork.selectedStyles)
                                    ? artwork.selectedStyles.join("、")
                                    : artwork.selectedStyles || "未提供"}
                            </div>
                        </div>
                    </div>

                    <div className="artworkDetails-rejectInfo">❌ 拒絕接洽：<span>{artwork.rejectedTypes}</span></div>
                    <div className="artworkDetails-referenceImage">
                        <img src="/images/icons8-example-96-1.png" alt="referenceIcon" /> 委託方是否需提供參考圖片：<span>{artwork.reference}</span>
                    </div>
                </div>
            </div>

            {/* 補充圖片 */}
            <div className="artworkDetails-section">
                <h2>補充圖片</h2>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="artworkDetails-masonry"
                    columnClassName="artworkDetails-masonry-column"
                >
                    {artwork.supplementaryImageUrls?.map((url, index) => (
                        <img
                            loading="lazy"
                            key={index}
                            src={url}
                            alt={artwork.supplementaryImageName?.[index] || `補充圖片${index + 1}`}
                            className="artworkDetails-masonry-image"
                        />
                    ))}
                </Masonry>
            </div>


            {/* 補充內文*/}
            <div className="artworkDetails-section">
                <h2>詳細內文</h2>
                <p className="artworkDetails-innerText">{artwork.description}</p>
            </div>




            {/* 流程圖 */}
            <div className="artworkDetails-section">
                <h2>流程圖</h2>
            </div>

            {/* 補充資訊 */}
            <div className="artworkDetails-supplementaryInfo-section">
                <h2>補充資訊</h2>
                <div className="artworkDetails-supplementaryInfo-container">
                    <p>完稿格式：{artwork.fileFormat}</p>
                    <p>作品尺寸：{artwork.size}px</p>
                    <p>權限：{artwork.permission}</p>
                </div>
            </div>

            {/* 評價 */}
            <div className="artworkDetails-section">
                <h2>市集評價</h2>

            </div>

            <ModalImgBuyArtwork
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                artwork={artwork}
                artworkImageUrl={artworkImageUrl}
                artistNickname={artistNickname}
                artistProfileImg={artistProfileImg}
            />
        </div>

    );
}
