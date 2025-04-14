"use client"
import React, { useState, useEffect, useRef } from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkCriteria, artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import MasonryArtCommunity from '@/components/Masonry/MasonryArtCommunity.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import ArtworkSearch from '@/components/ArtworkSearch/ArtworkSearch.jsx';
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
import { fetchPainterArticles } from '@/lib/painterArticleListener';
import { useSelector } from "react-redux";
import "./artworkCommunity.css";

const ArtworkCommunity = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { painterArticles, loading } = useSelector((state) => state.painterArticle);
    const [selectedOptions, setSelectedOptions] = useState({
        latestRelease: "最新發布",
        category: "類別選擇",
        style: "風格選擇",
    });
    const ITEMSPERPAGE = 20;
    const dropdownRef = useRef(null);

    const { setIsImageLoading, setIsEmpty } = useImageLoading();
    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false); /* 為了確認圖片預載完成 避免pagenation 先出現 */
    const isDataFetched = useRef(false);
    const isCurrentImageUpdated = useRef(false);

    const [filteredArticles, setFilteredArticles] = useState([]);
    const [latestImages, setLatestImages] = useState([]);

    useEffect(() => {
        fetchPainterArticles(); // 取得文章
    }, [selectedOptions, currentPage])

   


    const handleToggleDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    // **篩選符合類別風格的文章**
    useEffect(() => {
        const updatedFilteredArticles = painterArticles.filter(article => {
            // 類別篩選
            const categoryMatch = selectedOptions.category === "類別選擇" || selectedOptions.category === "全部"
                ? true
                : article.selectedCategory === selectedOptions.category;

            // 風格篩選
            const styleMatch = selectedOptions.style === "風格選擇" || selectedOptions.style === "全部"
                ? true
                : article.selectedStyles.some(style => style === selectedOptions.style);

            return categoryMatch && styleMatch;
        });

        setFilteredArticles(updatedFilteredArticles);
    }, [painterArticles, selectedOptions, currentPage]);


    const handleOptionSelect = (id, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [id]: option,
        }));
        setOpenDropdown(null); // 關閉下拉選單
    };


    useEffect(() => {

        setIsImageLoading(true);
        setIsMasonryReady(false);
        isCurrentImageUpdated.current = false; // 重置狀態
        isDataFetched.current = true;


        if (isPreloaded) {
            setIsImageLoading(false);
        }


        return () => {
            setIsImageLoading(false);
        };

    }, [selectedOptions, currentPage, isPreloaded]);



    // ✅ 當 Masonry 排列完成後，關閉 Loading
    const handleMasonryReady = () => {


        setTimeout(() => {
            setIsImageLoading(false);
            setIsMasonryReady(true);

        }, 1000);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // 更新頁碼
    };

    const startIndex = (currentPage - 1) * ITEMSPERPAGE;
    const endIndex = currentPage * ITEMSPERPAGE;
    // const currentImages = testingImages.slice(startIndex, endIndex); // 當前頁數據
    useEffect(() => {
        setLatestImages(filteredArticles.slice(startIndex, endIndex));
    }, [filteredArticles, currentPage]);

    useEffect(() => {
        const totalArticles = Math.ceil(filteredArticles.length / ITEMSPERPAGE);
        isCurrentImageUpdated.current = true;

        // 如果當前頁數 > 總頁數，則回到第一頁
        if (currentPage > totalArticles) {
            setCurrentPage(1);
        }
    },[filteredArticles, currentPage]);


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

    const totalPages = Math.ceil(filteredArticles.length / ITEMSPERPAGE);


    return (
        <div className={`artworkCommunityPage ${notoSansTCClass}`}>
            <div className={`artworkCommunityPage-search-container ${isSearchOpen ? "moved" : ""}`}>
                <ArtworkSearch onSearchToggle={setIsSearchOpen} />
            </div>

            <div className="artworkCommunity-button-container" ref={dropdownRef}>
                <ArtMarketDropButton
                    id="latestRelease"
                    buttonText={selectedOptions.latestRelease}
                    options={artworkCriteria}
                    onOptionSelect={(option) => handleOptionSelect("latestRelease", option)}
                    isOpen={openDropdown === "latestRelease"}
                    onToggleDropdown={() => handleToggleDropdown("latestRelease")}
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

            <div className="artworkCommunity-artworks-container">
                {isDataFetched.current&&filteredArticles.length === 0 ? (
                    <div className="artworkShowcaseLobby-no-artworks" >
                        Sorry! 目前沒有相對應的文章
                    </div>
                ) : (
                    isCurrentImageUpdated&&<MasonryArtCommunity 
                    images={latestImages} 
                    onMasonryReady={handleMasonryReady} 
                    isMasonryReady={isMasonryReady}
                    setIsPreloaded={setIsPreloaded}
                    isPreloaded={isPreloaded}
                />
                )}
            </div>

            { isPreloaded&&filteredArticles.length != 0 && isMasonryReady&&<Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />}

        </div>
    )
}

export default ArtworkCommunity;
