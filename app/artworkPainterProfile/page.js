"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {
     const [currentPage, setCurrentPage] = useState(1); // 目前頁數
        const [itemsPerPage, setItemsPerPage] = useState(1); //設定預設顯示的商品數量
        const totalItems = 135; // 商品總數（可以從API獲取）
        const totalPages = Math.ceil(totalItems / itemsPerPage); // 總頁數
        

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
                    <ArtworkPainterDetail key={index} />
                ))}
            </div>
             {/* 使用分頁元件 */}
             <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default ArtworkPainterProfilePage