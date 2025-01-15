"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import CustomIconButton from '@/components/CustomButton/CustomIconButton.jsx';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';

import ArtworkCard from '@/components/ArtworkCard/ArtworkCard.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import { artMarketProduct, artMarketCategory, artMarketStyle, artMarketPirceRange, artMarketDeadline } from '@/lib/artworkDropdownOptions.js';

import "./artworkMarket.css";

const ArtMarketPage = () => {
   

    const [openDropdown, setOpenDropdown] = useState(null); // 追蹤哪個下拉選單是開啟狀態
    const [selectedOptions, setSelectedOptions] = useState({
        product: "價格最低",
        category: "類別選擇",
        style: "風格選擇",
        priceRange: "價格區間",
        deadline: "完稿時間",
    });

    const [currentPage, setCurrentPage] = useState(1); // 目前頁數
    const ITEMSPERPAGE = 20; // 每頁顯示的商品數量
    const totalItems = 135; // 商品總數（可以從API獲取）
    const totalPages = Math.ceil(totalItems / ITEMSPERPAGE); // 總頁數

    const dropdownRef = useRef(null); // 用於追蹤下拉選單的容器

   
    
    const handleToggleDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    const handleOptionSelect = (id, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [id]: option,
        }));
        setOpenDropdown(null); // 關閉下拉選單
    };

    // 當用戶切換頁碼時
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

  

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentItems = Array.from({ length: totalItems }).slice(
        (currentPage - 1) * ITEMSPERPAGE,
        currentPage * ITEMSPERPAGE
    );


    return (
        <div className={`artMarket-page ${notoSansTCClass}`}>
            <div className="artMarket-iconButton-container" >
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-24h-service-56-1.png" alt="artMarket-icon" text="24H速貨" />
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-top-96-11.png" alt="artMarket-icon" text="收藏TOP" />
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-fire-100-1.png" alt="artMarket-icon" text="熱銷" />
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-time-48-1.png" alt="artMarket-icon" text="限時搶購" />
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-idea-40-1.png" alt="artMarket-icon" text="即將上架" />
                <CustomIconButton iconSrc="/images/artMarketImage/icons8-new-40-1.png" alt="artMarket-icon" text="最新上架" />
            </div>

            <div className="artMarket-dropdownButton-container"  ref={dropdownRef}>
                <ArtMarketDropButton
                    id="product"
                    buttonText={selectedOptions.product} // 顯示選擇的選項
                    options={artMarketProduct} // 下拉選單的選項
                    onOptionSelect={(option) => handleOptionSelect("product", option)} // 選擇選項時的處理函式
                    isOpen={openDropdown === "product"} // 是否開啟下拉選單
                    onToggleDropdown={() => handleToggleDropdown("product")} // 切換下拉選單開啟狀態
                />
                <ArtMarketDropButton
                    id="category"
                    buttonText={selectedOptions.category}
                    options={artMarketCategory}
                    onOptionSelect={(option) => handleOptionSelect("category", option)}
                    isOpen={openDropdown === "category"}
                    onToggleDropdown={() => handleToggleDropdown("category")}
                />
                <ArtMarketDropButton
                    id="style"
                    buttonText={selectedOptions.style}
                    options={artMarketStyle}
                    onOptionSelect={(option) => handleOptionSelect("style", option)}
                    isOpen={openDropdown === "style"} 
                    onToggleDropdown={() => handleToggleDropdown("style")}
                />
                <ArtMarketDropButton
                    id="priceRange"
                    buttonText={selectedOptions.priceRange}
                    options={artMarketPirceRange}
                    onOptionSelect={(option) => handleOptionSelect("priceRange", option)}
                    isOpen={openDropdown === "priceRange"}
                    onToggleDropdown={() => handleToggleDropdown("priceRange")}
                />
                <ArtMarketDropButton
                    id="deadline"
                    buttonText={selectedOptions.deadline}
                    options={artMarketDeadline}
                    onOptionSelect={(option) => handleOptionSelect("deadline", option)}
                    isOpen={openDropdown === "deadline"}
                    onToggleDropdown={() => handleToggleDropdown("deadline")}
                />
            </div>

            <div className="artMarket-product-container">
                {/* 渲染商品列表 */}
                {currentItems.map((_, index) => ( 
                    <ArtworkCard
                        key={index}
                        imageSrc={"/images/testing-Arkwork-image.png"}
                        title={"網站測試用商品圖"}
                        price={"1000"}
                        artistProfileImg={"/images/testing-artist-profile-image.png"}
                        artistNickName={"王小美"}
                    />
                ))}
            </div>
                
            {/* 使用分頁元件 */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

        </div>
    );
};

export default ArtMarketPage;
