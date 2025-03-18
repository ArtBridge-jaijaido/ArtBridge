"use client";
import React, { useState, useEffect, useRef } from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkRecommendation, artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import ArtworkSearch from '@/components/ArtworkSearch/ArtworkSearch.jsx';
import MasonryGrid from '@/components/Masonry/MasonryGrid.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import {useImageLoading} from "@/app/contexts/ImageLoadingContext.js";
import { fetchPainterPortfolios } from '@/lib/painterPortfolioListener.js';
import { useSelector } from "react-redux";
import "./artworkShowcaseLobby.css";

const ArtworkShowcaseLobby = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { painterPortfolios, loading } = useSelector((state) => state.painterPortfolio);
    const [selectedOptions, setSelectedOptions] = useState({
        recommendation: "推薦作品",
        category: "類別選擇",
        style: "風格選擇",
    });
    const ITEMSPERPAGE = 20;
    const dropdownRef = useRef(null);

    const { setIsImageLoading, setIsEmpty  } = useImageLoading();
    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false); /* 為了確認圖片預載完成 避免pagenation 先出現 */
    const isDataFetched = useRef(false);
    const isCurrentImageUpdated = useRef(false); 

    const [filteredPortfolios, setFilteredPortfolios] = useState([]);
    const [latestImages, setLatestImages] = useState([]);

   useEffect(()=>{
    fetchPainterPortfolios(); // 取得作品集 
   },[selectedOptions, currentPage])

   

    //  **篩選符合類別的作品**
    useEffect(() => {
       
        const updatedFilteredPortfolios = painterPortfolios.filter(portfolio => {
            // 類別篩選
            const categoryMatch = selectedOptions.category === "類別選擇" || selectedOptions.category === "全部"
                ? true
                : portfolio.selectedCategory === selectedOptions.category;

            // 風格篩選
            const styleMatch = selectedOptions.style === "風格選擇" || selectedOptions.style === "全部"
                ? true
                : portfolio.selectedStyles.some(style => style === selectedOptions.style);

            return categoryMatch && styleMatch;
        });

        setFilteredPortfolios(updatedFilteredPortfolios); 
   
    }, [painterPortfolios, selectedOptions, currentPage]);

    

    useEffect(() => {

        setIsImageLoading(true);
        setIsMasonryReady(false);
        isCurrentImageUpdated.current = false; // 重置狀態
        isDataFetched.current = true;


        if(isPreloaded){
            setIsImageLoading(false);
        }

       
        return () => {
            setIsImageLoading(false); 
        };
      
    }, [selectedOptions,currentPage,isPreloaded]);


    // ✅ 當 Masonry 排列完成後，關閉 Loading
    const handleMasonryReady = () => {

    
        setTimeout(() => {
            setIsImageLoading(false);
            setIsMasonryReady(true);
           
        }, 1000);
    };

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

    const handlePageChange = (page) => {
    
        setCurrentPage(page); // 更新頁碼
    
    };

    const startIndex = (currentPage - 1) * ITEMSPERPAGE;
    const endIndex = currentPage * ITEMSPERPAGE;
    // const currentImages = filteredPortfolios.slice(startIndex, endIndex); // 當前頁數據

    useEffect(() => {
        setLatestImages(filteredPortfolios.slice(startIndex, endIndex));
    }, [filteredPortfolios, currentPage]);
    
    
    

    useEffect(() => {
        const totalFilteredPages = Math.ceil(filteredPortfolios.length / ITEMSPERPAGE);
        
        isCurrentImageUpdated.current = true;

        // 🔥 如果當前頁數 > 總頁數，則回到第一頁
        if (currentPage > totalFilteredPages) {
            setCurrentPage(1);
        }
    }, [filteredPortfolios, currentPage]);

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

   
    const totalPages = Math.ceil(filteredPortfolios.length / ITEMSPERPAGE); // 總頁數



    return (
        <div className={`artworkShowcaseLobbyPage ${notoSansTCClass}`}>
            <div className={`artworkShowcaseLobbyPage-search-container ${isSearchOpen ? "moved" : ""}`}>
                <ArtworkSearch onSearchToggle={setIsSearchOpen} />
            </div>

            <div className="artworkShowcaseLobby-button-container" ref={dropdownRef}>
                <ArtMarketDropButton
                    id="recommendation"
                    buttonText={selectedOptions.recommendation}
                    options={artworkRecommendation}
                    onOptionSelect={(option) => handleOptionSelect("recommendation", option)}
                    isOpen={openDropdown === "recommendation"}
                    onToggleDropdown={() => handleToggleDropdown("recommendation")}
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
            </div>
            <div className="artworkShowcaseLobby-artworks-container">
                {isDataFetched.current&&filteredPortfolios.length === 0 ? (
                    <div className="artworkShowcaseLobby-no-artworks" >
                        Sorry! 目前沒有相對應的作品
                    </div>
                ) : (
                    isCurrentImageUpdated&&<MasonryGrid
                        images={latestImages}
                        onMasonryReady={handleMasonryReady} 
                        isMasonryReady={isMasonryReady}
                        setIsPreloaded={setIsPreloaded}
                        isPreloaded={isPreloaded}
                    />
                )}
            </div>



            { isPreloaded&& filteredPortfolios.length != 0 && isMasonryReady&&<Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />}

        </div>
    )
}

export default ArtworkShowcaseLobby
