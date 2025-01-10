"use client";   
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import ToggleButton from '@/components/CustomButton/ToggleButton.jsx';
import { artworkPainter, artMarketCategory, artMarketStyle} from '@/lib/artworkDropdownOptions.js';
import "./artworkPainter.css";


const artworkPainterPage = () => {
    const [openDropdown, setOpenDropdown] = useState(null); // 追蹤哪個下拉選單是開啟狀態   
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



        </div>
    )
}

export default artworkPainterPage
