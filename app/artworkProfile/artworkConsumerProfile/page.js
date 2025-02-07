"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import ArtworkConsumerCooperation from '@/components/ArtworkConsumerCooperation/ArtworkConsumerCooperation.jsx';
import "./artworkConsumerProfile.css";



const ArtworkConsumerProfilePage = () => {
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

        <div className={`artworkConsumerProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
                <ArtworkPainterDetail 
                    id="Detail" 
                    backgroundImg={"/images/consumer-background.png"}
                    ratingText={"5"}
                    profileImg={"/images/profile-avatar.png"}
                    usernameText={"使用者名稱"}
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
        </div>
    )
}

export default ArtworkConsumerProfilePage