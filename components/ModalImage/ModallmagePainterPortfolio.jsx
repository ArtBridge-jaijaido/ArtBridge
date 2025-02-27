"use client";
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import "./ModallmagePainterPortfolio.css";

const ModallmagePainterPortfolio = ({ isOpen, onClose, data }) => {
    const { addToast } = useToast(); // 使用 addToast
    const [isLoading, setIsLoading] = useState(false);

    const [tempSelectedCategory, setTempSelectedCategory] = useState("");
    const [tempSelectedStyles, setTempSelectedStyles] = useState([]);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);

    const categoryRef = useRef(null);
    const styleRef = useRef(null);

    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    
    useEffect(() => {
        if (isOpen) {
            setTempSelectedCategory("");
            setTempSelectedStyles([]);
        }
    }, [isOpen, data?.src]);

    // 類別選擇（單選）
    const handleCategorySelect = (option) => {
        setTempSelectedCategory(option === tempSelectedCategory ? "" : option);
        setIsCategoryOpen(false);
    };

    // 風格選擇（最多 3 項）
    const handleStyleSelect = (event, option) => {
        event.stopPropagation();
        if (tempSelectedStyles.includes(option)) {
            setTempSelectedStyles(prevStyles => prevStyles.filter(item => item !== option));
        } else if (tempSelectedStyles.length < 3) {
            setTempSelectedStyles(prevStyles => [...prevStyles, option]);
        } else {
            addToast("error", "最多只能選擇3項風格！");
        }
    };
 
    // 關閉選單
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
            if (styleRef.current && !styleRef.current.contains(event.target)) {
                setIsStyleOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (tempSelectedStyles.length === 3) {
            setIsStyleOpen(false); 
        }
    }, [tempSelectedStyles]);
    
    // 儲存按鈕 
    const handleSave = () => {
        setIsLoading(true); 
    
        // 驗證失敗
        if (!tempSelectedCategory) {
            addToast("error", "請選擇1項類別");
            setIsLoading(false); // 檢查失敗後關閉 Loading
            return;
        }
    
        if (tempSelectedStyles.length === 0) {
            addToast("error", "請至少選擇1項風格");
            setIsLoading(false); 
            return;
        }
    
        if (tempSelectedStyles.length > 3) {
            addToast("error", "最多只能選擇3項風格");
            setIsLoading(false); 
            return;
        }
    
        console.log("選擇的類別:", tempSelectedCategory);
        console.log("選擇的風格:", tempSelectedStyles);

        addToast("success", "儲存成功！");

        setTimeout(() => {
            onClose();
            setIsLoading(false);
        }, 900);

    };
    
    const handleClose = () => {
        setTempSelectedCategory("");
        setTempSelectedStyles([]);
        onClose();
    };

    if (!isOpen || !data) return null;

    return (
        <div className="ModallmagePainterPortfolio-overlay" onClick={handleClose}>
            <div className="ModallmagePainterPortfolio-content" onClick={(e) => e.stopPropagation()}>
                <div className="ModallmagePainterPortfolio-body">
                    {/* 左側圖片區域 */}
                    <div className="ModallmagePainterPortfolio-image-section">
                        <div className="ModallmagePainterPortfolio-image-container">
                            <img src={data.src} alt="Artwork" />
                            <button className="ModallmagePainterPortfolio-close" onClick={handleClose}>X</button>
                                <div className="ModallmagePainterPortfolio-likesIcon-container">
                                    <img src="/images/icons8-love.png" alt="numberOfLikes" />
                                    <span className="ModallmagePainterPortfolio-likes-number">156</span>
                                </div>
                        </div>
                    </div> 

                    {/* 右側選擇欄 */}
                    <div className="ModallmagePainterPortfolio-select-section">
                  
                        {/* 類別選擇 */}
                        <div className="ModallmagePainterPortfolio-category-width" ref={categoryRef}>
                            <div className="ModallmagePainterPortfolio-dropdown-container">
                                <div
                                    id="category-dropdown"
                                    className={`ModallmagePainterPortfolio-dropdown ${isCategoryOpen ? "open" : ""}`}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    類別選擇
                                    {isCategoryOpen && (
                                        <ul className="ModallmagePainterPortfolio-dropdown-options">
                                            {filteredCategories.map((option, index) => (
                                                <li key={index} className="ModallmagePainterPortfolio-dropdown-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempSelectedCategory === option}
                                                        onChange={() => handleCategorySelect(option)}
                                                    />
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <span className="ModallmagePainterPortfolio-max-selection">(最多1項)</span>
                            </div>
                            <input
                                type="text"
                                value={tempSelectedCategory || "類別"}
                                readOnly
                                className={`ModallmagePainterPortfolio-input-box ${tempSelectedCategory ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 風格選擇 */}
                        <div className="ModallmagePainterPortfolio-style-width" ref={styleRef}>
                            <div className="ModallmagePainterPortfolio-dropdown-container">
                                <div
                                    id="style-dropdown"
                                    className={`ModallmagePainterPortfolio-dropdown ${isStyleOpen ? "open" : ""}`}
                                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                                >
                                    風格選擇
                                    {isStyleOpen && (
                                        <ul className="ModallmagePainterPortfolio-dropdown-options">
                                            {filteredStyles.map((option, index) => (
                                                <li key={index} className="ModallmagePainterPortfolio-dropdown-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempSelectedStyles.includes(option)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleStyleSelect(e, option)}
                                                    />
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <span className="ModallmagePainterPortfolio-max-selection">(最多3項)</span>
                            </div>
                            <input
                                type="text"
                                value={tempSelectedStyles.length > 0 ? tempSelectedStyles.join("、") : "風格1、風格2、風格3"}
                                readOnly
                                className={`ModallmagePainterPortfolio-input-box ${tempSelectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 儲存按鈕 */}
                        <div className="ModallmagePainterPortfolio-save-button">
                            <LoadingButton  isLoading={isLoading} onClick={handleSave}>儲存</LoadingButton >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModallmagePainterPortfolio;
