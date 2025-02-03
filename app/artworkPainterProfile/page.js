"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkPainterCalendar from '@/components/ArtworkPainterCalendar/ArtworkPainterCalendar.jsx';
import "./artworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {
     const [currentPage, setCurrentPage] = useState(1); // 目前頁數
        const [itemsPerPage, setItemsPerPage] = useState(1); //設定預設顯示的商品數量
        const totalItems = 135; // 商品總數（可以從API獲取）
        

        // 當用戶切換頁碼時
        const handlePageChange = (page) => {
            setCurrentPage(page);
        };
        const currentItems = Array.from({ length: totalItems }).slice(
            (currentPage - 1) * itemsPerPage,
             currentPage * itemsPerPage
        );
    

    return (

        <div className={`artworkPainterProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
            {currentItems.map((_, index) => (
                    <ArtworkPainterDetail 
                    key={index} 
                    backgroundImg={"/images/profile-background.png"}
                    ratingText={"5"}
                    profileImg={"/images/profile-avatar.png"}
                    usernameText={"使用者名稱"}
                    introductionText={"我是一名經驗豐富的插畫家，擅長日系畫風，專注於VUP虛擬主播立繪和建模（包括Live2D製作）。曾參與《食之契約》《崩壞2》《原神》《蒼藍誓約》《命運神界》"}
                    viewID={"A123456"}
                    isHighQuality={true}
                    />
             ))}
            </div>

            {/* 繪師行事曆 */}
            <div className="artworkPainterCalendar-container">
                 {currentItems.map((_, index) => (
                    <ArtworkPainterCalendar 
                        key={index} 
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
                ))}
            </div>
        </div>
    )
}

export default ArtworkPainterProfilePage