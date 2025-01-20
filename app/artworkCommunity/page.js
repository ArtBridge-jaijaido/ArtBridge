"use client"
import React, { useState, useEffect, useRef } from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkCriteria, artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import MasonryArtCommunity from '@/components/Masonry/MasonryArtCommunity.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkCommunity.css";

const ArtworkCommunity = () => {

    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({
        latestRelease: "最新發布",
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

    const startIndex = (currentPage - 1) * ITEMSPERPAGE;
    const endIndex = currentPage * ITEMSPERPAGE;
    const currentImages = testingImages.slice(startIndex, endIndex); // 當前頁數據


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

    const totalPages = Math.ceil(testingImages.length / ITEMSPERPAGE);


    return (
        <div className={`artworkCommunityPage ${notoSansTCClass}`}>
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
                <MasonryArtCommunity images={currentImages} />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

        </div>
    )
}

export default ArtworkCommunity;
