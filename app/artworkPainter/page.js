"use client";   
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import ToggleButton from '@/components/CustomButton/ToggleButton.jsx';
import ArtworkPainterProfileCard from '@/components/ArtworkPainterProfileCard/ArtworkPainterProfileCard.jsx';
import { artworkPainter, artMarketCategory, artMarketStyle} from '@/lib/artworkDropdownOptions.js';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./artworkPainter.css";


const artworkPainterPage = () => {
    const [openDropdown, setOpenDropdown] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1); // 目前頁數
    const ITEMSPERPAGE = 20; // 每頁顯示的商品數量
    const totalItems = 135; // 商品總數（可以從API獲取）
    const totalPages = Math.ceil(totalItems / ITEMSPERPAGE); // 總頁數

    const [selectedOptions, setSelectedOptions] = useState({
        painter: "評價最高",
        category: "類別選擇",
        style: "風格選擇",
    });

    const [toggleStates, setToggleStates] = useState({
        isAvailable: false,
        isHighQuality: false, 
    });

    const handleToggle = (key) => {
        setToggleStates((prev) => ({
            ...prev,
            [key]: !prev[key], 
        }));
    };

    const dropdownRef = useRef(null); // 用於追蹤下拉選單的容器
    

    const handleToggleDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    const currentItems = Array.from({ length: totalItems }).slice(
        (currentPage - 1) * ITEMSPERPAGE,
        currentPage * ITEMSPERPAGE
    );




    return (
        <div className={`artworkPainterPage ${notoSansTCClass}`}>
            <div className="artworkPainter-button-container" ref={dropdownRef}>
                <ArtMarketDropButton
                    id="painter"
                    buttonText={selectedOptions.painter} // 顯示選擇的選項
                    options={artworkPainter} // 下拉選單的選項
                    onOptionSelect={(option) => handleOptionSelect("painter", option)} // 選擇選項時的處理函式
                    isOpen={openDropdown === "painter"} // 是否開啟下拉選單
                    onToggleDropdown={() => handleToggleDropdown("painter")} // 切換下拉選單開啟狀態
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

                <ToggleButton 
                    Title="檔期空閒" 
                    isToggled={toggleStates.isAvailable} 
                    handleToggle={() => handleToggle("isAvailable")} 
                />

                <ToggleButton 
                    Title="優質繪師" 
                    isToggled={toggleStates.isHighQuality} 
                    handleToggle={() => handleToggle("isHighQuality")} 
                />
            </div>

            <div className="artworkPainterProfileCard-container">
               {currentItems.map((item, index) => (
                    <ArtworkPainterProfileCard key={index} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

        </div>
    )
}

export default artworkPainterPage
