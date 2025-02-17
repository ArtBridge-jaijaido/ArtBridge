"use client";
import React, { useState, useEffect ,useRef } from "react";
import "./MarketUploadForm4.css";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';

const MarketUploadFormPage4 = ({ prev, next }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [styleLimitWarning, setStyleLimitWarning] = useState(false);
    
    const [reference, setReference] = useState("");
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);

    const categoryRef = useRef(null);
    const styleRef = useRef(null);
    const referenceRef = useRef(null);

    const referenceOptions = ["是", "否"];

    // 類別選擇（單選）
    const handleCategorySelect = (option) => {
        setSelectedCategory(option === selectedCategory ? "" : option);
    };

    // 風格選擇（最多 3 項）
    const handleStyleSelect = (option) => {
        setSelectedStyles((prevStyles) => {
            let newStyles;
            if (prevStyles.includes(option)) {
                newStyles = prevStyles.filter(item => item !== option); // 取消選擇
            } else if (prevStyles.length < 3) { // 阻止選擇第4項
                newStyles = [...prevStyles, option]; // 新增選擇
            } else {
                setStyleLimitWarning(true);
                return prevStyles;
            }
            setStyleLimitWarning(newStyles.length > 4);  // 只有當超過 3 項時才顯示警告
            return newStyles;
        });
    };

       // 監聽點擊外部事件來關閉選單
       useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
            if (styleRef.current && !styleRef.current.contains(event.target)) {
                setIsStyleOpen(false);
            }
            if (referenceRef.current && !referenceRef.current.contains(event.target)) {
                setIsReferenceOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="MarketUploadForm4-wrapper">
            <div className="MarketUploadForm4-container">
                {/* 第一行：類別選擇 & 風格選擇 */}
                <div className="MarketUploadForm4-row">
                    {/* 類別選擇 */}
                    <div className="MarketUploadForm4-group category-width" ref={categoryRef}>
                        <div className="dropdown-container">
                            <div 
                                id="category-dropdown" 
                                className={`dropdown ${isCategoryOpen ? "open" : ""}`} 
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                類別選擇
                                {isCategoryOpen && (
                                    <ul className="dropdown-options">
                                        {artMarketCategory.map((option, index) => (
                                            <li key={index} className="dropdown-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategory === option}
                                                    onChange={() => handleCategorySelect(option)}
                                                />
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <span className="max-selection">(最多1項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedCategory || "類別"}  
                            readOnly 
                            className={`input-box ${selectedCategory ? "black-text" : "gray-text"}`}
                        />
                    </div>

                    {/* 風格選擇 */}
                    <div className="MarketUploadForm4-group category-width" ref={styleRef}>
                        <div className="dropdown-container">
                            <div 
                                id="style-dropdown" 
                                className={`dropdown ${isStyleOpen ? "open" : ""}`} 
                                onClick={() => setIsStyleOpen(!isStyleOpen)}
                            >
                                風格選擇
                                {isStyleOpen && (
                                    <ul className="dropdown-options">
                                        {artMarketStyle.map((option, index) => (
                                            <li key={index} className="dropdown-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStyles.includes(option)}
                                                    onChange={() => handleStyleSelect(option)}
                                                />
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <span className="max-selection">(最多3項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedStyles.length > 0 ? selectedStyles.join("、") : "風格1、風格2、風格3"}  
                            readOnly 
                            className={`input-box ${selectedStyles.length > 0 ? "black-text" : "gray-text"}`}  
                        />
                        {styleLimitWarning && <p className="warning-text">最多只能選擇3項風格！</p>}
                    </div>
                </div>

                {/* 第二行：委託方是否提供參考圖 */}
                <div className="MarketUploadForm4-group full-width" ref={referenceRef}>
                    <label>委託方是否需要提供參考圖</label>
                    <div className={`dropdown ${isReferenceOpen ? "open" : ""}`} onClick={() => setIsReferenceOpen(!isReferenceOpen)}>
                        <div className={`dropdown-selected ${reference ? "black-text" : "gray-text"}`}>
                            {reference || "是/否"}
                        </div>
                        {isReferenceOpen && (
                            <div className="dropdown-options">
                                {referenceOptions.map((option, index) => (
                                    <div key={index} className="dropdown-option" onClick={() => {
                                        setReference(option);
                                        setIsReferenceOpen(false);
                                    }}>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 提示區域 */}
                <div className="MarketUploadForm4-hint">
                    如果需要更改/自訂接委託流程，請 <a href="#" className="text-link">點擊這裡</a>
                </div>

                {/* 按鈕區域 */}
                <div className="MarketUploadForm4-button-group">
                    <button className="MarketUploadForm4-prev" onClick={prev}>上一步</button>
                    <button className="MarketUploadForm4-next" onClick={next}>發佈</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage4;
