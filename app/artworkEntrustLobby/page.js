"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import {artworkCriteria,artMarketCategory, artMarketStyle, artMarketPirceRange, artMarketDeadline,artworkBusiness} from '@/lib/artworkDropdownOptions.js';
import ArtworkEntrustCard from '@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import ArtworkSearch from '@/components/ArtworkSearch/ArtworkSearch.jsx'; 
import "./artworkEntrustLobby.css";

const ArtworkEntrustLobby = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({
        criteria: "最新發布",
        category: "類別選擇",
        style: "風格選擇",
        priceRange: "價格區間",
        deadline: "完稿時間",
        business: "商業用途",
    });
   
    const [currentPage, setCurrentPage] = useState(1); // 目前頁數
    const [itemsPerPage, setItemsPerPage] = useState(16); //設定預設顯示的商品數量
    const totalItems = 135; // 商品總數（可以從API獲取）
    const totalPages = Math.ceil(totalItems / itemsPerPage); // 總頁數
    
    const dropdownRef = useRef(null);// 用於追蹤下拉選單的容器
    
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
            //設定每種螢幕大小顯示的商品數目
            const updateItemsPerPage = () => {
                if (window.innerWidth < 768) {
                    setItemsPerPage(10); // Set to 10 items for smaller screens
                } else {
                    setItemsPerPage(16); // Default to 16 items for larger screens
                }
            };
            // Initial check
            updateItemsPerPage(); 
            // Add event listener for window resize
            window.addEventListener("resize", updateItemsPerPage);

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
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        
    //按鈕
    return (
        <div className={`artworkEntrustLobbyPage ${notoSansTCClass}`}>
            <div className={`artworkEntrustLobbyPage-search-container ${isSearchOpen ? "moved" : ""}`}>
                <ArtworkSearch onSearchToggle={setIsSearchOpen} />
            </div>
            <div className="artworkEntrustLobby-button-container" ref={dropdownRef}>
                <ArtMarketDropButton
                    id="criteria"
                    buttonText={selectedOptions.criteria}
                    options={artworkCriteria}
                    onOptionSelect={(option) => handleOptionSelect("criteria", option)}
                    isOpen={openDropdown === "criteria"}
                    onToggleDropdown={() => handleToggleDropdown("criteria")}
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
                <ArtMarketDropButton
                    id="business"
                    buttonText={selectedOptions.business}
                    options={artworkBusiness}
                    onOptionSelect={(option) => handleOptionSelect("business", option)}
                    isOpen={openDropdown === "business"}
                    onToggleDropdown={() => handleToggleDropdown("business")}
                />
            </div>
            <div className="artworkEntrustCard-container">
               {currentItems.map((_, index) => (
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
            
             {/* 使用分頁元件 */}
             <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

    

export default ArtworkEntrustLobby;