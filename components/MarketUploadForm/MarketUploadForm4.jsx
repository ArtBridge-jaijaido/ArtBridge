"use client";
import React, { useState, useEffect ,useRef } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle, referOptions } from '@/lib/artworkDropdownOptions.js';
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx"; 
import "./MarketUploadForm4.css";

const MarketUploadFormPage4 = ({ prev, next,formData }) => {
    const { addToast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || "");
    const [selectedStyles, setSelectedStyles] = useState(formData.selectedStyles || []);
    const [reference, setReference] = useState(formData.reference || "");


    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const categoryRef = useRef(null);
    const styleRef = useRef(null);
    const referenceRef = useRef(null);

    const referenceOptions = referOptions;
    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    // 類別選擇（單選）
    const handleCategorySelect = (option) => {
        setSelectedCategory(option === selectedCategory ? "" : option);
        setIsCategoryOpen(false);
    };

    // 風格選擇（最多 3 項）
    const handleStyleSelect = (event, option) => {
        event.stopPropagation();
    
        if (selectedStyles.includes(option)) {
            setSelectedStyles(prevStyles => prevStyles.filter(item => item !== option));
        } else if (selectedStyles.length < 3) {
            setSelectedStyles(prevStyles => [...prevStyles, option]);
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
            if (referenceRef.current && !referenceRef.current.contains(event.target)) {
                setIsReferenceOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedStyles.length === 3) {
            setIsStyleOpen(false); 
        }
    }, [selectedStyles]);
    
    
    const validateForm = () => {
        if (!selectedCategory) {
            addToast("error", "請選擇類別！");
            return false;
        }
        if (selectedStyles.length === 0) {
            addToast("error", "請選擇至少一個風格！");
            return false;
        }
        if (!reference) {
            addToast("error", "請選擇是否需要提供參考圖！");
            return false;
        }
        return true;
    };

    const handlePublishClick = async () => {
        if (!validateForm()) return;

        setIsLoading(true); 
        try {
            await next({
                selectedCategory,
                selectedStyles,
                reference
            });
         
        } catch (error) {
            console.error("上傳失敗:", error);
            addToast("error", "上傳失敗，請稍後再試");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="MarketUploadForm4-wrapper">
            <div className="MarketUploadForm4-container">
                {/* 第一行：類別選擇 & 風格選擇 */}
                <div className="MarketUploadForm4-row">
                    {/* 類別選擇 */}
                    <div className="MarketUploadForm4-group category-width" ref={categoryRef}>
                        <div className="MarketUploadForm4-dropdown-container">
                            <div 
                                id="category-dropdown" 
                                className={`MarketUploadForm4-dropdown ${isCategoryOpen ? "open" : ""}`} 
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                類別選擇
                                {isCategoryOpen && (
                                    <ul className="MarketUploadForm4-dropdown-options">
                                        {filteredCategories.map((option, index) => (
                                            <li key={index} className="MarketUploadForm4-dropdown-option">
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
                            <span className="MarketUploadForm4-max-selection">(最多1項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedCategory || "類別"}  
                            readOnly 
                            className={`MarketUploadForm4-input-box ${selectedCategory ? "black-text" : "gray-text"}`}
                        />
                    </div>

                    {/* 風格選擇 */}
                    <div className="MarketUploadForm4-group category-width" ref={styleRef}>
                        <div className="MarketUploadForm4-dropdown-container">
                            <div 
                                id="style-dropdown" 
                                className={`MarketUploadForm4-dropdown ${isStyleOpen ? "open" : ""}`} 
                                onClick={() => setIsStyleOpen(!isStyleOpen)}
                            >
                                風格選擇
                                {isStyleOpen && (
                                    <ul className="MarketUploadForm4-dropdown-options">
                                        {filteredStyles.map((option, index) => (
                                            <li key={index} className="MarketUploadForm4-dropdown-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStyles.includes(option)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleStyleSelect(e, option)}
                                                />
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <span className="MarketUploadForm4-max-selection">(最多3項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedStyles.length > 0 ? selectedStyles.join("、") : "風格1、風格2、風格3"}  
                            readOnly 
                            className={`MarketUploadForm4-input-box ${selectedStyles.length > 0 ? "black-text" : "gray-text"}`}  
                        />
                    </div>
                </div>

                {/* 第二行：委託方是否提供參考圖 */}
                <div className="MarketUploadForm4-group full-width" ref={referenceRef}>
                    <label className="MarketUploadForm4-reference-label">委託方是否需要提供參考圖</label>
                    <div className={`MarketUploadForm4-dropdown ${isReferenceOpen ? "open" : ""}`} onClick={() => setIsReferenceOpen(!isReferenceOpen)}>
                        <div className={`MarketUploadForm4-dropdown-selected ${reference ? "black-text" : "gray-text"}`}>
                            {reference || "是/否"}
                        </div>
                        {isReferenceOpen && (
                            <div className="MarketUploadForm4-dropdown-options">
                                {referenceOptions.map((option, index) => (
                                    <div key={index} className="MarketUploadForm4-dropdown-option" onClick={() => {
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
                    如果需要更改/自訂接委託流程，請 <a href="#" className="MarketUploadForm4-text-link">點擊這裡</a>
                </div>

                {/* 按鈕區域 */}
                <div className="MarketUploadForm4-button-group">
                    <button className="MarketUploadForm4-prev" onClick={prev}>上一步</button>
                    <LoadingButton
                        isLoading={isLoading}
                        onClick={handlePublishClick}
                        loadingText="發佈中..."
                        className="MarketUploadForm4-next"
                    >
                        發佈
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage4;
