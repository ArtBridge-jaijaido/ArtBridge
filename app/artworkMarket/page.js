"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import CustomIconButton from '@/components/CustomButton/CustomIconButton.jsx';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import ArtworkSearch from '@/components/ArtworkSearch/ArtworkSearch.jsx'; 
import ArtworkCard from '@/components/ArtworkCard/ArtworkCard.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import { fetchPainterArtwork  } from "@/lib/artworkListener";
import {subscribeToUsers} from "@/lib/userListener";
import { useSelector } from 'react-redux';
import { artMarketProduct, artMarketCategory, artMarketStyle, artMarketPirceRange, artMarketDeadline } from '@/lib/artworkDropdownOptions.js';
import "./artworkMarket.css";

const ArtMarketPage = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // 追蹤哪個下拉選單是開啟狀態
    const [selectedOptions, setSelectedOptions] = useState({
        product: "價格最低",
        category: "類別選擇",
        style: "風格選擇",
        priceRange: "價格區間",
        deadline: "完稿時間",
    });
    const artworks = useSelector((state) => state.artwork.artworks);
    const [currentPage, setCurrentPage] = useState(1); // 目前頁數
    const ITEMSPERPAGE = 20; // 每頁顯示的商品數量
    const dropdownRef = useRef(null); // 用於追蹤下拉選單的容器
    const [isLoading, setIsLoading] = useState(true);
   
    // 觸發 artwork 監聽
     useEffect(() => {
        const unsubscribeToUsers = subscribeToUsers();

        return () => {
            unsubscribeToUsers(); // 頁面卸載時取消監聽
        };
    }, []);
    
    useEffect(() => {
        if (artworks.length) {
            setIsLoading(false);
        }
    }, [artworks]);

    useEffect(()=>{
        fetchPainterArtwork();
    },[selectedOptions, currentPage]);

   // 取得當前日期 (去掉時分秒)
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    // 根據風格 + 上架時間篩選作品
    const filteredArtworks = artworks.filter((artwork) => {
        const startDate = new Date(artwork.startDate);
        const endDate = new Date(artwork.endDate);

        // 確保 startDate 和 endDate 是有效的日期
        if (isNaN(startDate) || isNaN(endDate)) return false;

        // 檢查是否在上架時間內
        const isOnSale =  today <= endDate;

        // 類別過濾條件
        const isMatchingCategory = selectedOptions.category === "類別選擇" || 
                                selectedOptions.category === "全部" ||  
                                artwork.selectedCategory === selectedOptions.category;

       // 風格過濾條件
        const isMatchingStyle = selectedOptions.style === "風格選擇" ||
        selectedOptions.style === "全部" ||
        (Array.isArray(artwork.selectedStyles) && artwork.selectedStyles.includes(selectedOptions.style));

      
        // 價格區間過濾條件
        const isMatchingPriceRange = selectedOptions.priceRange === "價格區間" ||
        selectedOptions.priceRange === "全部" ||
        (selectedOptions.priceRange === "100-500元" && artwork.price <= 500) ||
        (selectedOptions.priceRange === "501-1000元" && artwork.price > 500 && artwork.price <= 1000) ||
        (selectedOptions.priceRange === "1001-2000元" && artwork.price > 1000 && artwork.price <= 2000) ||
        (selectedOptions.priceRange === "2001-3000元" && artwork.price > 2000 && artwork.price <= 3000) ||
        (selectedOptions.priceRange === "3001-4000元" && artwork.price > 3000 && artwork.price <= 4000) ||
        (selectedOptions.priceRange === "4001-5000元" && artwork.price > 4000 && artwork.price <= 5000) ||
        (selectedOptions.priceRange === "5000以上" && artwork.price > 5000);

        //完稿時間過濾條件
        const isMatchingDeadline = selectedOptions.deadline === "完稿時間" ||
        selectedOptions.deadline === "全部" ||
        (selectedOptions.deadline === "24小時以內" && artwork.completionTime=="24小時")||
        (selectedOptions.deadline === "3天內" && artwork.completionTime=="2～7天")||
        (selectedOptions.deadline === "5天內" && artwork.completionTime=="2～7天")||
        (selectedOptions.deadline === "7天內" && artwork.completionTime=="2～7天")||
        (selectedOptions.deadline === "14天內" && artwork.completionTime=="8～14天")


        return isOnSale &&  isMatchingCategory && isMatchingStyle && isMatchingPriceRange && isMatchingDeadline;
    });

    

    const currentItems = filteredArtworks.slice(
        (currentPage - 1) * ITEMSPERPAGE,
        currentPage * ITEMSPERPAGE
    );

    const totalPages = Math.ceil(filteredArtworks.length / ITEMSPERPAGE);
    
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


    return (
        <div className={`artMarket-page ${notoSansTCClass}`}>
             <div className={`artMarket-search-container ${isSearchOpen ? "moved" : ""}`}>
                <ArtworkSearch onSearchToggle={setIsSearchOpen} />
            </div>

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

            {filteredArtworks.length === 0 ? (
                <p>Sorry! 目前沒有相對應的市集</p>
                ) : (
                <div className="artMarket-product-container">
                    {isLoading ? (
                    <p>載入中...</p> // 可改成 Spinner 或 Loading 組件
                    ) : (
                    currentItems.map((artwork) => (
                        <ArtworkCard
                        key={artwork.artworkId}
                        imageSrc={artwork.exampleImageUrl || "/images/default-image.png"}
                        title={artwork.marketName}
                        price={artwork.price}
                        artistProfileImg={artwork.artistProfileImg || "/images/kv-min-4.png"}
                        artistNickName={artwork.artistNickName || "使用者名稱"}
                        artistUid={artwork.userUid}
                        artworkId={artwork.artworkId}
                        likedby={artwork.likedBy || []}
                        />
                    ))
                    )}
                </div>
                )}

                
            {/* 使用分頁元件 */}
            {filteredArtworks.length > 0 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

        </div>
    );
};

export default ArtMarketPage;
