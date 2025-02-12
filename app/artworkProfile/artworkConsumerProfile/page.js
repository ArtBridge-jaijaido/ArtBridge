"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { useSelector, useDispatch} from "react-redux";
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkConsumerCooperation from '@/components/ArtworkConsumerCooperation/ArtworkConsumerCooperation.jsx';
import ArtworkConsumerProfileTab from "@/components/ArtworkConsumerProfile-tab/ArtworkConsumerProfile-tab.jsx";
import ArtworkReview from "@/components/ArtworkReview/ArtworkReview.jsx"; 
import ArtworkEntrustCard from "@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx";
import MasonryGrid from "@/components/Masonry/MasonryGrid.js"; 
import "./artworkConsumerProfile.css";



const ArtworkConsumerProfilePage = () => {

        const {user} = useSelector((state) => state.user);  
        const [masonryVisibleItems, setMasonryVisibleItems] = useState(10); // 作品集預設顯示數量

        const [entrustVisibleItems, setEntrustVisibleItems] = useState(6); // 委託初始預設顯示數量
        const entrustTotalItems = 20; // 總數

        const [reviewVisibleItems, setReviewVisibleItems] = useState(10); // 查看評價預設顯示數量
        const reviewTotalItems = 30; // 總數

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
        const masonryTotalItems = testingImages.length; // 總數
        const currentImages = testingImages.slice(0, masonryVisibleItems);
        
        const tabs = [
            {
                label: "委託",
                content: <div className="ArtworkConsumerProfile-Tab-wrapper">
                    <div className="ArtworkConsumerProfile-artworkEntrustCard-container">
                        {Array.from({ length: entrustTotalItems }).slice(0, entrustVisibleItems).map((_, index) => (
                            <ArtworkEntrustCard 
                                key={index}
                                title={"企劃名稱(最多15個字"}
                                usernameText={"使用者名稱"}
                                applicantText={"已有5人應徵"}
                                descriptionText={"需要一個可以幫我畫角色的繪師，類型像圖片中那樣，偏向可矮Q版的風格，是12345678"}
                                categoryText={"OC/原創角色"}
                                dealineText={"2025年02月03日"}
                                price={"2000-5000"}
                                artworkImg={"/images/artwork-icon.png"}
                            />
                        ))}
                    </div>
                        {/* 顯示更多按鈕 */}
                        {entrustVisibleItems < entrustTotalItems && (
                            <button onClick={() => setEntrustVisibleItems(prev => prev + 6)} className="ArtworkConsumerProfile-show-more-button" style={{gridColumn: "span 2"}}>
                                顯示更多
                            </button>
                        )} 
                    </div> 
            },
            {
                label: "查看評價",
                content:(<div className="ArtworkConsumerProfile-artworkReview-container">
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
                content: <a href=""></a>,
            },
            {
                label: "合作案例",
                content: <div className="ArtworkConsumerProfile-Tab-wrapper">
                    <div className="ArtworkConsumerProfile-MasonryGrid-container">
                     <MasonryGrid images={currentImages}/>
                    </div>

                     {masonryVisibleItems < masonryTotalItems && (
                        <button onClick={() => setMasonryVisibleItems(prev => prev + 10)} className="ArtworkConsumerProfile-show-more-button">
                            顯示更多
                        </button>
                    )}
                 </div>,    
            },
        ];

    return (

        <div className={`artworkConsumerProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
                <ArtworkPainterDetail 
                    id="Detail" 
                    backgroundImg={"/images/consumer-background.png"}
                    ratingText={"5"}
                    profileImg={"/images/profile-avatar.png"}
                    usernameText={user?.nickname}
                    introductionText={"很好說話，美東時差黨，延遲回覆抱歉。如果超出原本預期的工時，可以直接跟我提價錢，好商量！如果顯示在線卻沒回"}
                    viewID={"A123456"}
                    isHighQuality={true}
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