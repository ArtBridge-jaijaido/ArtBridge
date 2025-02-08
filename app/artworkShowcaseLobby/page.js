"use client";
import React, { useState, useEffect, useRef } from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkRecommendation, artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';

import MasonryGrid from '@/components/Masonry/MasonryGrid.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkShowcaseLobby.css";

const ArtworkShowcaseLobby = () => {
    
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({
        recommendation: "推薦作品",
        category: "類別選擇",
        style: "風格選擇",
    });
    const ITEMSPERPAGE = 20; 
    const dropdownRef = useRef(null);

    const testingImages = [
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
    ];

  
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
    
    const startIndex= (currentPage - 1) * ITEMSPERPAGE;
    const endIndex = currentPage * ITEMSPERPAGE;
    const currentImages =testingImages.slice(startIndex, endIndex); // 當前頁數據
    
   

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

    const totalPages = Math.ceil(testingImages.length / ITEMSPERPAGE); // 總頁數

    return (
        <div className={`artworkShowcaseLobbyPage ${notoSansTCClass}`}>
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
                <MasonryGrid 
                    images={currentImages}  
                    LikeImg={"/images/icons8-love-96-26.png"}
                />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default ArtworkShowcaseLobby
