"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkCriteria, artMarketCategory, artMarketStyle, artMarketPirceRange, artMarketDeadline, artworkBusiness } from '@/lib/artworkDropdownOptions.js';
import ArtworkEntrustCard from '@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import ArtworkSearch from '@/components/ArtworkSearch/ArtworkSearch.jsx';
import { fetchAllEntrusts } from "@/lib/entrustListener.js";
import { useSelector } from 'react-redux';
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

    const entrusts = useSelector((state) => state.entrust.entrusts);
    const allUsers = useSelector((state) => state.user.allUsers);


    const [currentPage, setCurrentPage] = useState(1); // 目前頁數
    const [itemsPerPage, setItemsPerPage] = useState(16); //設定預設顯示的商品數量
    const totalItems = entrusts.length // 商品總數（可以從API獲取）
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
        fetchAllEntrusts();
    }, [selectedOptions, currentPage]);


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

    // 取得當前日期 (去掉時分秒)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEntrusts = entrusts.filter((entrust) => {
        const startDate = new Date(entrust.startDate);
        const endDate = new Date(entrust.endDate);

        // 確保 startDate 和 endDate 是有效的日期
        if (isNaN(startDate) || isNaN(endDate)) return false;

        // 檢查是否在上架時間內
        const isOnSale = today <= endDate;


        // 類別過濾條件
        const isMatchingCategory = selectedOptions.category === "類別選擇" 
        || selectedOptions.category ==="全部" ||
        entrust.selectedCategory === selectedOptions.category;

        // 風格過濾條件
        const isMatchingStyle = selectedOptions.style === "風格選擇"
        || selectedOptions.style ==="全部" ||
        entrust.selectedStyles.includes(selectedOptions.style);

        // 價格區間過濾條件
        const isMatchingPriceRange = selectedOptions.priceRange === "價格區間" ||
        selectedOptions.priceRange ==="全部" ||
        (selectedOptions.priceRange=== "100-500元" && entrust.price=== "100 ~ 500元")||
        (selectedOptions.priceRange === "501-1000元" && entrust.price=== "501 ~ 1000元") ||
        (selectedOptions.priceRange === "1001-2000元" && entrust.price=== "1001 ~ 2000元") ||
        (selectedOptions.priceRange === "2001-3000元" && entrust.price === "2001 ~ 3000元" )||
        (selectedOptions.priceRange === "3001-4000元" && entrust.price  === "3001 ~ 4000元") ||
        (selectedOptions.priceRange === "4001-5000元" && entrust.price  === "4001 ~ 5000元" )||
        (selectedOptions.priceRange === "5000元以上" && entrust.price  === "5001元 以上") 


          //完稿時間過濾條件
          const isMatchingDeadline = selectedOptions.deadline === "完稿時間" ||
          selectedOptions.deadline === "全部" ||
          (selectedOptions.deadline === "24小時以內" && entrust.completionTime == "24小時") ||
          (selectedOptions.deadline === "2～7天" && entrust.completionTime == "2～7天") ||
          (selectedOptions.deadline === "8～14天" && entrust.completionTime == "8～14天") ||
          (selectedOptions.deadline === "15～30天" && entrust.completionTime == "15～30天") ||
          (selectedOptions.deadline === "31天以上" && entrust.completionTime == "31天以上")

        // 商業用途過濾條件
        const isMatchingBusiness = selectedOptions.business === "商業用途" ||
        (selectedOptions.business === "商業用途"  && entrust.usage === "商業用途") ||
        (selectedOptions.business === "個人需求" && entrust.usage === "個人使用") 
       


        return isOnSale && isMatchingCategory && isMatchingStyle && isMatchingPriceRange &&isMatchingDeadline &&isMatchingBusiness;
    });


        const currentItems = filteredEntrusts.slice(
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

                <div className="artworkEntrustLobby-artworkEntrustCard-container">

                    {currentItems.map((entrust) => {
                        const user = allUsers[entrust.userUid];
                        return (
                            <ArtworkEntrustCard
                                key={entrust.entrustId}
                                EntrustImageUrl={entrust.exampleImageUrl}
                                marketName={entrust.marketName}
                                price={entrust.price}
                                description={entrust.description}
                                applicationCount={entrust.applicationCount}
                                categoryText={entrust.selectedCategory}
                                deadlineText={entrust.endDate}
                                usernameText={user?.nickname || "使用者名稱"}

                            />
                        );
                    })}
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