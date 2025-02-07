"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkPainterCalendar from '@/components/ArtworkPainterCalendar/ArtworkPainterCalendar.jsx';
import Tabs from "@/components/Tabs/Tab.jsx";
import ArtworkReview from "@/components/ArtworkReview/ArtworkReview.jsx"; 
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {
     const [currentPage, setCurrentPage] = useState(1); // 目前頁數
        const [itemsPerPage, setItemsPerPage] = useState(4); //設定預設顯示的商品數量
        const totalItems = 9; // 商品總數（可以從API獲取）
        const totalPages = Math.ceil(totalItems / itemsPerPage); // 總頁數     

        // 當用戶切換頁碼時
        const handlePageChange = (page) => {
            setCurrentPage(page);
        };
        const currentItems = Array.from({ length: totalItems }).slice(
            (currentPage - 1) * itemsPerPage,
             currentPage * itemsPerPage
        );

        const tabs = [
            {
                label: "作品集",
                content: <a href=""></a>,    
            },
            {
                label: "查看評價",
                content:(<div className="artworkReview-container">
                    {currentItems.map((_, index) => (
                         <ArtworkReview 
                         key={index}
                         profileImg={"/images/user-test-icon.png"}
                         userName={"使用者名稱"}
                         reviewTime={"2025.01.12"}
                         planName={"企劃名稱或是市集名稱不能超過十五個字"}
                         reviewText={"這位繪師的作品充滿了靈感與細緻，每一筆都展現出無與倫比的技術和情感。無論是人物表情還是場景氛圍，都讓人感受到深刻的故事與情感。他的作品彷彿能夠與觀者心靈相通，令人印象深刻。"}
                         collaborationCount={"3"}
                         rating={"4"}
                         tags={["1","2","3","4","5"]}
                       /> 
                     ))}
                 </div>),
            },
            {
                label: "市集",
                content: <a href=""></a>,
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
                isHighQuality={true}
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
            <div className="artworkPainterProfile-tab-container">
                <Tabs tabs={tabs} />
            </div>
 
           

        </div>
    )
}

export default ArtworkPainterProfilePage