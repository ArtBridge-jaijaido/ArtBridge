"use client";
import React, { useState, useEffect,useRef } from "react";
import "./ArtworkSearch.css";

const ArtworkSearch = ({ onSearchToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchRef = useRef(null);

    const toggleSearch = (e) => {
        e.stopPropagation(); // 避免點擊按鈕時馬上觸發關閉事件
        setIsOpen((prev) => !prev);
    };

    //確保點擊相同頁面時搜尋框收起
    useEffect(() => {
        
        const handleClickOutside = (e) => {
              // 檢查是否點擊的是 <a> 標籤（超連結）
              if (e.target.tagName === "A") {
                setIsOpen(false);
                return;
            }
            
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
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
