"use client";
import React, { useState, useEffect } from "react";
import "./ArtworkSearch.css";

const ArtworkSearch = ({ onSearchToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const toggleSearch = (e) => {
        e.stopPropagation(); // 避免點擊按鈕時馬上觸發關閉事件
        setIsOpen((prev) => !prev);
    };

    //確保點擊相同頁面時搜尋框收起
    useEffect(() => {
        const handleClick = () => setIsOpen(false);

        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

     useEffect(() => {
        if (onSearchToggle) {
            onSearchToggle(isOpen);
        }
    }, [isOpen, onSearchToggle]);

 
    return (
        <div className={`ArtworkSearch-container ${isOpen ? "moved" : ""}`}>
            {/* 搜尋按鈕 */}
            <button className="ArtworkSearch-button" onClick={toggleSearch}>
                <img src="/images/search-icon.png" alt="Search" className="ArtworkSearch-icon" />
            </button>

            {/* 搜尋框 */}
            {isOpen && (
                <div className={`ArtworkSearch-box ${isOpen ? "expanded" : ""}`}>
                    <input
                        type="text"
                        className="ArtworkSearch-input"
                        placeholder="請輸入關鍵字..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="ArtworkSearch-submit">✔</button>
                </div>
            )}
        </div>
    );
};

export default ArtworkSearch;
