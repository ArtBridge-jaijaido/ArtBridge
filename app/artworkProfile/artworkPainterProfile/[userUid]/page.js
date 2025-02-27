"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch} from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import { useLoading } from "@/app/contexts/LoadingContext.js";
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkPainterCalendar from '@/components/ArtworkPainterCalendar/ArtworkPainterCalendar.jsx';
import ArtworkPainterProfileTab from "@/components/ArtworkPainterProfile-tab/ArtworkPainterProfile-tab.jsx";
import ArtworkPainterMasonryGrid from "@/components/ArtworkPainterMasonryGrid/ArtworkPainterMasonryGrid.js"; 
import ArtworkReview from "@/components/ArtworkReview/ArtworkReview.jsx"; 
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard.jsx";
import "./artworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {
        const {userUid} = useParams();
        const { setIsLoading } = useLoading();
        const dispatch = useDispatch();
        const user = useSelector((state) => state.user.allUsers[userUid]) || {};
        const [masonryVisibleItems, setMasonryVisibleItems] = useState(10); // 作品集預設顯示數量
        const artworks = useSelector((state) => state.artwork.artworks);
        const [reviewVisibleItems, setReviewVisibleItems] = useState(10); // 查看評價
        const reviewTotalItems = 30; //總數
        const [isUserLoaded, setIsUserLoaded] = useState(false);
        const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 市集
        const artworkCardTotalItems = 40;


        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredArtworks = artworks.filter((artwork) => {
            if (artwork.userUid !== userUid) return false; 
        
            const startDate = new Date(artwork.startDate);
            const endDate = new Date(artwork.endDate);
        
            // 確保 startDate 和 endDate 是有效的日期
            if (isNaN(startDate) || isNaN(endDate)) return false;
        
            // 確保作品目前在上架期間內
            return  today <= endDate;
        });
       

        const testingImages = [
            {src:"/images/testing-Arkwork-image-2.png", category: "category1"},
            {src:"/images/testing-Arkwork-image-9.png", category: "category2"},
            {src:"/images/testing-Arkwork-image-8.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-4.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-6.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-5.png", category: "category1"},
            {src:"/images/testing-Arkwork-image-3.png", category: "category2"},
            {src:"/images/testing-Arkwork-image-10.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-11.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-7.png", category: "category3"},
            {src:"/images/testing-Arkwork-image.png", category: "category1"},
            {src:"/images/testing-Arkwork-image-9.png", category: "category2"},
            {src:"/images/testing-Arkwork-image-8.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-4.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-7.png", category: "category3"},
            {src:"/images/testing-Arkwork-image.png", category: "category1"},
            {src:"/images/testing-Arkwork-image-9.png", category: "category2"},
            {src:"/images/testing-Arkwork-image-8.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-4.png", category: "category3"},
            {src:"/images/testing-Arkwork-image-7.png", category: "category3"},
        ];
        const masonryTotalItems = testingImages.length; // 總數
        const currentImages = testingImages.slice(0, masonryVisibleItems);
        


        const tabs = [
            {
                label: "作品集",
                content: <div className="artworkPainterProfile-Tab-wrapper">
                    <div className="artworkPainterProfile-artworkPainterMasonryGrid-container">
                     <ArtworkPainterMasonryGrid images={currentImages}/>
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
                    {filteredArtworks.slice(0, artworkCardVisibleItems).map((artwork, index) => (
                            <ArtworkCard 
                                key={artwork.artworkId}
                                imageSrc={artwork.exampleImageUrl}
                                title={artwork.marketName}
                                price={artwork.price}
                                artistProfileImg={artwork.artistProfileImg || "/images/kv-min-4.png"}
                                artistNickName={artwork.artistNickName || "使用者名稱"}
                                deadline={`截止日期: ${artwork.endDate}`}
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
     
          <div className={`artworkPainterProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
                <ArtworkPainterDetail 
                    id="Detail"
                    backgroundImg={user.painterProfileBackgroundImg ?? "/images/painter-background.png" }
                    ratingText={"5"}
                    profileImg={user.profileAvatar ?? "/images/profile-avatar.png"}
                    usernameText={user?.nickname}
                    introductionText={user?.painterIntroduction? user.painterIntroduction : "請寫下你的自我介紹......."}
                    viewID={user?.userSerialId?user.userSerialId:"A123456"}
                    isHighQuality={1}
                    browsingPainterId={userUid}
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