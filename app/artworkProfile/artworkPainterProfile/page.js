"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkPainterCalendar from '@/components/ArtworkPainterCalendar/ArtworkPainterCalendar.jsx';
import ArtworkPainterProfileTab from "@/components/ArtworkPainterProfile-tab/ArtworkPainterProfile-tab.jsx";
import MasonryGrid from "@/components/Masonry/MasonryGrid.js"; 
import ArtworkReview from "@/components/ArtworkReview/ArtworkReview.jsx"; 
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard.jsx";
import "./artworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {

        const [masonryVisibleItems, setMasonryVisibleItems] = useState(10); // 作品集預設顯示數量

        const [reviewVisibleItems, setReviewVisibleItems] = useState(10); // 查看評價
        const reviewTotalItems = 30; //總數

        const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 市集
        const artworkCardTotalItems = 40;

        const testingImages = [
            "/images/testing-Arkwork-image.png",
            "/images/testing-Arkwork-image-9.png",
            "/images/testing-Arkwork-image-8.png",
            "/images/testing-Arkwork-image-4.png",
            "/images/testing-Arkwork-image-7.png",
            "/images/testing-Arkwork-image.png",
            "/images/testing-Arkwork-image-9.png",
            "/images/testing-Arkwork-image-8.png",
            "/images/testing-Arkwork-image-4.png",
            "/images/testing-Arkwork-image-7.png",
            "/images/testing-Arkwork-image.png",
            "/images/testing-Arkwork-image-9.png",
            "/images/testing-Arkwork-image-8.png",
            "/images/testing-Arkwork-image-4.png",
            "/images/testing-Arkwork-image-7.png", 
            "/images/testing-Arkwork-image.png",
            "/images/testing-Arkwork-image-9.png",
            "/images/testing-Arkwork-image-8.png",
            "/images/testing-Arkwork-image-4.png",
            "/images/testing-Arkwork-image-7.png", 
        ];
        const masonryTotalItems = testingImages.length; // 總數
        const currentImages = testingImages.slice(0, masonryVisibleItems);


        const tabs = [
            {
                label: "作品集",
                content: <div className="artworkPainterProfile-Tab-wrapper">
                    <div className="artworkPainterProfile-MasonryGrid-container">
                     <MasonryGrid images={currentImages}/>
                    </div>

                     {masonryVisibleItems < masonryTotalItems && (
                        <button onClick={() => setMasonryVisibleItems(prev => prev + 10)} className="artworkPainter-show-more-button" style={{gridColumn: "span 5", marginTop: "20px"}}>
                            顯示更多
                        </button>
                    )}
                 </div>,    
            },
            {
                label: "查看評價",
                content:(<div className="artworkPainterProfile-artworkReview-container">
                    {Array.from({ length: reviewTotalItems }).slice(0, reviewVisibleItems).map((_, index) => (
                         <ArtworkReview 
                         key={index}
                         profileImg={"/images/user-test-icon1.png"}
                         userName={"使用者名稱"}
                         reviewTime={"2025.01.12"}
                         planName={"企劃名稱或是市集名稱不能超過十五個字"}
                         reviewText={"這位繪師的作品充滿了靈感與細緻，每一筆都展現出無與倫比的技術和情感。無論是人物表情還是場景氛圍，都讓人感受到深刻的故事與情感。他的作品彷彿能夠與觀者心靈相通，令人印象深刻。"}
                         collaborationCount={"3"}
                         rating={"4"}
                         tags={["1","2","3","4","5"]}
                         isPrivate={0}
                       /> 
                     ))}
                     {reviewVisibleItems < reviewTotalItems && (
                        <button onClick={() => setReviewVisibleItems(prev => prev + 10)} className="artworkPainter-show-more-button">
                            顯示更多
                        </button>
                    )}
                 </div>),
            },
            {
                label: "市集",
                content: (<div className="artworkPainterProfile-Tab-wrapper">
                    <div className="artworkPainterProfile-artworkCard-container">
                        {Array.from({ length: artworkCardTotalItems }).slice(0, artworkCardVisibleItems).map((_, index) => (
                            <ArtworkCard 
                                key={index}
                                imageSrc={"/images/testing-Arkwork-image-10.png"}
                                title={"商品標題(至多8字"}
                                price={"1500"}
                                artistProfileImg="profile.jpg"
                                artistNickName="Artist Name"
                                deadline={"截止日期:2025.01.02"}
                            /> 
                        ))}
                    </div>
                        {artworkCardVisibleItems < artworkCardTotalItems && (
                            <button onClick={() => setArtworkCardVisibleItems(prev => prev + 10)} className="artworkPainter-show-more-button">
                                顯示更多
                            </button>
                        )}
                 </div>),
            },
            {
                label: "曾發布文章",
                content: <a href=""></a>,
            },
        ];


    return (

        <div className={`artworkPainterProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
                <ArtworkPainterDetail 
                id="Detail"
                backgroundImg={"/images/painter-background.png"}
                ratingText={"5"}
                profileImg={"/images/profile-avatar.png"}
                usernameText={"使用者名稱"}
                introductionText={"我是一名經驗豐富的插畫家，擅長日系畫風，專注於VUP虛擬主播立繪和建模（包括Live2D製作）。曾參與《食之契約》《崩壞2》《原神》《蒼藍誓約》《命運神界》"}
                viewID={"A123456"}
                isHighQuality={1}
                />
            </div>

            {/* 繪師行事曆 */}
            <div className="artworkPainterCalendar-container">
                <ArtworkPainterCalendar 
                    id="calendar"
                    completion={"100%"}
                    reputation={"100分"}
                    statusData={[
                        [0, 0], 
                        [0, 0], 
                        [0, 0], 
                        [0, 0], 
                        [0, 0],
                        [0, 0]
                    ]}
                />
            </div>
            <div className="ArtworkPainterProfileTab-container">
                <ArtworkPainterProfileTab tabs={tabs} />
            </div>
             {/* 固定在畫面右側的價目表按鈕 */}
            <button className="artworkPainterProfile-fixed-pricing-button">價目表</button>
           

        </div>
    )
}

export default ArtworkPainterProfilePage