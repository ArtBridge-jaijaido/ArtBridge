"use client";
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { updateEntrustPortfolio } from "@/services/artworkEntrustPortfolioService"; 
import "./ModallmageEntrustPortfolio.css";

const ModallmageEntrustPortfolio = ({ isOpen, onClose, data }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [tempSelectedCategory, setTempSelectedCategory] = useState("");
    const [tempSelectedStyles, setTempSelectedStyles] = useState([]);
    const [tempAssignedArtist, setTempAssignedArtist] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const categoryRef = useRef(null);
    const styleRef = useRef(null);

    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    useEffect(() => {
        if (isOpen) {
            setTempSelectedCategory(data.selectedCategory || ""); 
            setTempSelectedStyles(data.selectedStyles || []);
            setTempAssignedArtist(data.assignedArtist || "");
        }
    }, [isOpen, data]);

    const handleCategorySelect = (option) => {
        setTempSelectedCategory(option === tempSelectedCategory ? "" : option);
        setIsCategoryOpen(false);
    };

    const handleStyleSelect = (event, option) => {
        event.stopPropagation();
        if (tempSelectedStyles.includes(option)) {
            setTempSelectedStyles(prev => prev.filter(item => item !== option));
        } else if (tempSelectedStyles.length < 3) {
            setTempSelectedStyles(prev => [...prev, option]);
        } else {
            addToast("error", "最多只能選擇3項風格！");
        }
    };

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

    const handleSave = async () => {
        setIsLoading(true);

        if (!tempSelectedCategory) {
            addToast("error", "請選擇1項類別");
            setIsLoading(false);
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

        if (!data.userUid || !data.portfolioId) {
            addToast("error", "無法更新作品資料，缺少必要資訊");
            setIsLoading(false);
            return;
        }

        const response = await updateEntrustPortfolio(data.userUid, data.portfolioId, {
            selectedCategory: tempSelectedCategory,
            selectedStyles: tempSelectedStyles,
            assignedArtist: tempAssignedArtist,
        });

        if (response.success) {
            addToast("success", "作品更新成功！");
            onClose();
        } else {
            addToast("error", "更新失敗，請稍後再試");
        }

        setIsLoading(false);
    };

    const handleClose = () => {
        setTempSelectedCategory("");
        setTempSelectedStyles([]);
        setTempAssignedArtist("");
        onClose();
    };

    if (!isOpen || !data) return null;

    return (
        <div className="ModallmageEntrustPortfolio-overlay" onClick={handleClose}>
            <div className="ModallmageEntrustPortfolio-content" onClick={(e) => e.stopPropagation()}>
                <div className="ModallmageEntrustPortfolio-body">
                    <div className="ModallmageEntrustPortfolio-image-section">
                        <div className="ModallmageEntrustPortfolio-image-container">
                            <img src={data.exampleImageUrl} alt="Artwork" />
                            <button className="ModallmageEntrustPortfolio-close" onClick={handleClose}>X</button>
                        </div>
                    </div>

                    <div className="ModallmageEntrustPortfolio-select-section">
                        <div className="ModallmageEntrustPortfolio-category-width" ref={categoryRef}>
                            <div className="ModallmageEntrustPortfolio-dropdown-container">
                                <div
                                    id="category-dropdown"
                                    className={`ModallmageEntrustPortfolio-dropdown ${isCategoryOpen ? "open" : ""}`}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    類別選擇
                                    {isCategoryOpen && (
                                        <ul className="ModallmageEntrustPortfolio-dropdown-options">
                                            {filteredCategories.map((option, index) => (
                                                <li key={index} className="ModallmageEntrustPortfolio-dropdown-option">
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
                                <span className="ModallmageEntrustPortfolio-max-selection">(最多1項)</span>
                            </div>
                            <input
                                type="text"
                                value={tempSelectedCategory || "類別"}
                                readOnly
                                className={`ModallmageEntrustPortfolio-input-box ${tempSelectedCategory ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        <div className="ModallmageEntrustPortfolio-style-width" ref={styleRef}>
                            <div className="ModallmageEntrustPortfolio-dropdown-container">
                                <div
                                    id="style-dropdown"
                                    className={`ModallmageEntrustPortfolio-dropdown ${isStyleOpen ? "open" : ""}`}
                                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                                >
                                    風格選擇
                                    {isStyleOpen && (
                                        <ul className="ModallmageEntrustPortfolio-dropdown-options">
                                            {filteredStyles.map((option, index) => (
                                                <li key={index} className="ModallmageEntrustPortfolio-dropdown-option">
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
                                <span className="ModallmageEntrustPortfolio-max-selection">(最多3項)</span>
                            </div>
                            <input
                                type="text"
                                value={tempSelectedStyles.length > 0 ? tempSelectedStyles.join("、") : "風格1、風格2、風格3"}
                                readOnly
                                className={`ModallmageEntrustPortfolio-input-box ${tempSelectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        <div className="ModallmageEntrustPortfolio-artist-width">
                            <label className="ModallmageEntrustPortfolio-artist-label">合作繪師</label>
                            <input
                                type="text"
                                value={tempAssignedArtist}
                                onChange={(e) => setTempAssignedArtist(e.target.value)}
                                placeholder="請輸入繪師名稱"
                                className={`ModallmageEntrustPortfolio-input-box ${data.assignedArtist ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        <div className="ModallmageEntrustPortfolio-save-button">
                            <LoadingButton isLoading={isLoading} onClick={handleSave}>儲存</LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModallmageEntrustPortfolio;
