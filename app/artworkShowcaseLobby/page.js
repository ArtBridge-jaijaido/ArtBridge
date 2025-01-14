"use client";
import React, { useState, useEffect, useRef } from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artworkRecommendation, artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import MasonryGrid from '@/components/Masonry/MasonryComponent.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkShowcaseLobby.css";

const artworkShowcaseLobby = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const [selectedOptions, setSelectedOptions] = useState({
        recommendation: "推薦作品",
        category: "類別選擇",
        style: "風格選擇",
    });

    const dropdownRef = useRef(null);

    const testingImages = [
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
        "images/testing-Arkwork-image.png",
    ];

    const columnWidths = [190, 206, 317, 236, 256];

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
                <MasonryGrid images={testingImages} columns={5} columnWidths={columnWidths}/>
            </div>
        </div>
    )
}

export default artworkShowcaseLobby
