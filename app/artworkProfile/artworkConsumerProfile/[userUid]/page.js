"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import { useLoading } from "@/app/contexts/LoadingContext.js";
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkConsumerCooperation from '@/components/ArtworkConsumerCooperation/ArtworkConsumerCooperation.jsx';
import ArtworkConsumerProfileTab from "@/components/ArtworkConsumerProfile-tab/ArtworkConsumerProfile-tab.jsx";
import ArtworkEntrustMasonryGrid from "@/components/ArtworkEntrustMasonryGrid/ArtworkEntrustMasonryGrid.js";
import ArtworkReview from "@/components/ArtworkReview/ArtworkReview.jsx";
import MasonryArtCommunity from '@/components/Masonry/MasonryArtCommunity.js';
import ArtworkEntrustCard from "@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx";
import MasonryGrid from "@/components/Masonry/MasonryGrid.js";
import { fetchAllEntrusts } from "@/lib/entrustListener.js";
import { fetchEntrustPortfolios } from '@/lib/entrustPortfolioListener.js'; // 展示大廳
import { fetchPainterArticles } from '@/lib/painterArticleListener';
import "./artworkConsumerProfile.css";




const ArtworkConsumerProfilePage = () => {
    const { userUid } = useParams();
    const { setIsLoading } = useLoading();
    const user = useSelector((state) => state.user.allUsers[userUid]) || {};
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(10); // 作品集預設顯示數量
    const allUsers = useSelector((state) => state.user.allUsers);
    //文章
    const [isPreloaded, setIsPreloaded] = useState(false);
    const [articleVisibleItems, setArticleVisibleItems] = useState(10); // 文章
    const { painterArticles } = useSelector((state) => state.painterArticle);
    // ** 過濾出當前使用者的 article**
    const userArticles = painterArticles.filter((article) => article.userUid == userUid);
    const articleMasonryTotalItems = userArticles.length; // article 總數
    const currentArticles = userArticles.slice(0, articleVisibleItems); // 當前顯示的 article
    const [isArticleMasonryReady, setIsArticleMasonryReady] = useState(false);


    // 委託 Entrusts 
    const { entrusts } = useSelector((state) => state.entrust);
    const [entrustVisibleItems, setEntrustVisibleItems] = useState(6); // 委託初始預設顯示數量


    // 過濾出當前使用者的委託
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredEntrusts = entrusts.filter((entrust) => {
        if (entrust.userUid !== userUid) return false;
        const startDate = new Date(entrust.startDate);
        const endDate = new Date(entrust.endDate);

        const isActive = entrust.isActive === true;

        // 確保 startDate 和 endDate 是有效的日期
        if (isNaN(startDate) || isNaN(endDate)) return false;

        // 確保作品目前在上架期間內
        return isActive && today <= endDate;
    });

    const entrustTotalItems = filteredEntrusts.length; // 總數

    // 評價 Review
    const [reviewVisibleItems, setReviewVisibleItems] = useState(10); // 查看評價預設顯示數量
    const reviewTotalItems = 30; // 總數


    const { entrustPortfolios, loading } = useSelector((state) => state.entrustPortfolio); // 作品集
    // ** 過濾出當前使用者的 portfolio**
    const userPortfolios = entrustPortfolios.filter((portfolio) => portfolio.userUid === userUid);

    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const masonryTotalItems = userPortfolios.length; // portfolio 總數
    const currentImages = userPortfolios.slice(0, masonryVisibleItems); // 當前顯示的 portfolio


    const testingImages = [
        "/images/testing-Arkwork-image-5.png",
        "/images/testing-Arkwork-image-6.png",
        "/images/testing-Arkwork-image-2.png",
        "/images/testing-Arkwork-image-4.png",
        "/images/testing-Arkwork-image-3.png",
        "/images/testing-Arkwork-image-5.png",
        "/images/testing-Arkwork-image-6.png",
        "/images/testing-Arkwork-image-2.png",
        "/images/testing-Arkwork-image-4.png",
        "/images/testing-Arkwork-image-3.png",
        "/images/testing-Arkwork-image-5.png",
        "/images/testing-Arkwork-image-6.png",
        "/images/testing-Arkwork-image-2.png",
        "/images/testing-Arkwork-image-4.png",
        "/images/testing-Arkwork-image-3.png",
        "/images/testing-Arkwork-image-5.png",
        "/images/testing-Arkwork-image-6.png",
        "/images/testing-Arkwork-image-2.png",
        "/images/testing-Arkwork-image-4.png",
        "/images/testing-Arkwork-image-3.png",
        "/images/testing-Arkwork-image-5.png",
        "/images/testing-Arkwork-image-6.png",
        "/images/testing-Arkwork-image-2.png",
        "/images/testing-Arkwork-image-4.png",
        "/images/testing-Arkwork-image-3.png",
    ];

    const handleArticleMasonryReady = () => {
        setTimeout(() => {
            setIsArticleMasonryReady(true);
        }, 300);
    };

    const handleMasonryReady = () => {
        setTimeout(() => {
            setIsMasonryReady(true);
        }, 300);
    };

    const handleArticleShowMore = () => {
        fetchPainterArticles();
        setArticleVisibleItems(prev => prev + 10);
    }

    const handleMasonryShowMore = () => {
        fetchEntrustPortfolios();
        setMasonryVisibleItems(prev => prev + 10);
    }


    useEffect(() => {
        fetchAllEntrusts();
        fetchPainterArticles();
    }, [])

    useEffect(() => {
        if (user?.uid) {
            setIsMasonryReady(false);
            fetchEntrustPortfolios(user.uid);
        }
    }, [user?.uid]);

    const tabs = [
        {
            label: "委託",
            content: <div className="ArtworkConsumerProfile-Tab-wrapper">
                <div className="ArtworkConsumerProfile-artworkEntrustCard-container">
                    {filteredEntrusts.slice(0, entrustVisibleItems).map((entrust, index) => {
                        const user=allUsers[entrust.userUid];
                        return (
                        <ArtworkEntrustCard
                            key={entrust.entrustId}
                            entrustId={entrust.entrustId}
                            marketName={entrust.marketName}
                            entrustNickname={user?.nickname || "使用者名稱"}
                            entrustProfileImg={user?.profileAvatar|| "/images/kv-min-4.png"}
                            applicationCount={entrust.applicationCount}
                            description={entrust.description}
                            categoryText={entrust.selectedCategory}
                            deadlineText={entrust.endDate}
                            price={entrust.price}
                            EntrustImageUrl={entrust.exampleImageUrl}
                        />
                    );
                    })}
                </div>
                {/* 顯示更多按鈕 */}
                {entrustVisibleItems < entrustTotalItems && (
                    <button onClick={() => setEntrustVisibleItems(prev => prev + 6)} className="ArtworkConsumerProfile-show-more-button" style={{ gridColumn: "span 2" }}>
                        顯示更多
                    </button>
                )}
            </div>
        },
        {
            label: "查看評價",
            content: (<div className="ArtworkConsumerProfile-artworkReview-container">
                {Array.from({ length: reviewTotalItems }).slice(0, reviewVisibleItems).map((_, index) => (
                    <ArtworkReview
                        key={index}
                        profileImg={"/images/user-test-icon2.png"}
                        userName={"使用者名稱"}
                        reviewTime={"2025.01.12"}
                        planName={"企劃名稱或是市集名稱不能超過十五個字"}
                        reviewText={"案主很好溝通，在細節上雖然很講究，但是不會讓我感覺壓力很大，而是有耐心地說明需求，很推薦可以合作喔！並且非常有禮貌，不會把繪師當成下屬的感覺，很喜歡這樣的合作氛圍。"}
                        collaborationCount={"3"}
                        rating={"4"}
                        tags={[]}
                        isPrivate={1}
                    />
                ))}

                {reviewVisibleItems < reviewTotalItems && (
                    <button onClick={() => setReviewVisibleItems(prev => prev + 10)} className="ArtworkConsumerProfile-show-more-button">
                        顯示更多
                    </button>
                )}
            </div>),
        },
        {
            label: "曾發布文章",
            content: <div className="ArtworkConsumerProfile-Tab-wrapper">
                <div className="ArtworkConsumerProfile-MasonryArtCommunity-container">
                    <div style={{ visibility: isArticleMasonryReady ? "visible" : "hidden" }}>
                        <MasonryArtCommunity
                            images={currentArticles}
                            isPreloaded={isPreloaded}
                            setIsPreloaded={setIsPreloaded}
                            isMasonryReady={isArticleMasonryReady}
                            onMasonryReady={handleArticleMasonryReady}
                        />
                    </div>
                    {!isArticleMasonryReady && currentArticles.length !== 0 ? (
                        <p className="ArtworkConsumerProfile-MasonryArtCommunity-loading" style={{ position: 'absolute', top: 10 }} >文章載入中...</p>
                    ) : currentArticles.length === 0 ? (
                        <div className="ArtworkConsumerProfile-artworkCollectionList-noData" style={{ position: 'absolute', top: 10 }}>
                            目前還沒有發布的文章喔!
                        </div>
                    ) : null
                    }
                </div>
                {articleVisibleItems < articleMasonryTotalItems && articleMasonryTotalItems > 9 && (
                    <button onClick={handleArticleShowMore} className="ArtworkConsumerProfile-show-more-button" style={{ gridColumn: "span 5", marginTop: "20px" }}>
                        顯示更多
                    </button>
                )}
            </div>
        },
        {
            label: "合作案例",
            content: <div className="ArtworkConsumerProfile-Tab-wrapper">
                <div className="ArtworkConsumerProfile-artworkEntrustMasonryGrid-container">
                    <div style={{ visibility: isMasonryReady ? "visible" : "hidden" }}>
                        <ArtworkEntrustMasonryGrid
                            images={currentImages}
                            onMasonryReady={handleMasonryReady}
                            isMasonryReady={isMasonryReady}
                        />
                    </div>

                    {!isMasonryReady && currentImages.length !== 0 ? (
                        <p className="ArtworkConsumerProfile-ArtworkEntrustMasonryGrid-loading" style={{ position: 'absolute', top: 10, left: 0 }}>
                            合作案例載入中...
                        </p>
                    ) : currentImages.length === 0 ? (
                        <div className="ArtworkConsumerProfile-ArtworkEntrustMasonryGrid-noData" style={{ position: 'absolute', top: 10 }}>
                            目前還沒有合作案例喔！
                        </div>
                    ) : null}
                </div>


                {masonryVisibleItems < masonryTotalItems && masonryTotalItems > 9 && (
                    <button onClick={handleMasonryShowMore} className="ArtworkConsumerProfile-show-more-button" style={{ gridColumn: "span 5", marginTop: "20px" }}>
                        顯示更多
                    </button>
                )}
            </div>,
        },
    ];

    useEffect(() => {
        if (user?.userSerialId) {
            setIsUserLoaded(true);
            setTimeout(() => setIsLoading(false), 500);
        } else {
            setIsUserLoaded(false);
            setIsLoading(true);
        }
    }, [user, setIsLoading]);

    if (!isUserLoaded) return null;

    return (

        <div className={`artworkConsumerProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
                <ArtworkPainterDetail
                    id="Detail"
                    backgroundImg={"/images/consumer-background.png"}
                    ratingText={"5"}
                    profileImg={user.profileAvatar ?? "/images/profile-avatar.png"}
                    usernameText={user?.nickname}
                    introductionText={user?.clientIntroduction ? user.clientIntroduction : "請寫下你的自我介紹......."}
                    viewID={user?.userSerialId ? user.userSerialId : "A123456"}
                    isHighQuality={true}
                    browsingPainterId={userUid}
                />
            </div>

            {/* 消費者合作次數 */}
            <div className="artworkConsumerCooperation-container">
                <ArtworkConsumerCooperation
                    id="Cooperation"
                    cooperationNum={"100"}
                    finishNum={"80"}
                />
            </div>

            <div className="ArtworkConsumerProfileTab-container">
                <ArtworkConsumerProfileTab tabs={tabs} />
            </div>

        </div>
    )
}

export default ArtworkConsumerProfilePage