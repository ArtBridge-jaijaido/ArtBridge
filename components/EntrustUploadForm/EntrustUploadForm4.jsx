"use client";
import React, { useState, useEffect ,useRef } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle, EntrustUsageOptions} from '@/lib/artworkDropdownOptions.js';
import Dropdown from "@/components/Dropdown/Dropdown.jsx";
import "./EntrustUploadForm4.css";

const EntrustUploadForm4 = ({ prev, next, formData }) => {
    const { addToast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || "");
    const [selectedStyles, setSelectedStyles] = useState(formData.selectedStyles || []);
    const [usage, setUsage] = useState(formData.usage || "");

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const categoryRef = useRef(null);
    const styleRef = useRef(null);

    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    const handleCategorySelect = (option) => {
        setSelectedCategory(option === selectedCategory ? "" : option);
        setIsCategoryOpen(false);
    };

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
        if (!usage) {
            addToast("error", "請選擇用途！");
            return false;
        }
        return true;
    };

    const handleNextClick = () => {
        if (!validateForm()) return;
        next({
            selectedCategory,
            selectedStyles,
            usage
        });
    };

    return (
        <div className="EntrustUploadForm4-wrapper">
            <div className="EntrustUploadForm4-container">
                <div className="EntrustUploadForm4-row">
                    <div className="EntrustUploadForm4-group category-width" ref={categoryRef}>
                        <div className="EntrustUploadForm4-dropdown-container">
                            <div 
                                id="category-dropdown" 
                                className={`EntrustUploadForm4-dropdown ${isCategoryOpen ? "open" : ""}`} 
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                類別選擇
                                {isCategoryOpen && (
                                    <ul className="EntrustUploadForm4-dropdown-options">
                                        {filteredCategories.map((option, index) => (
                                            <li key={index} className="EntrustUploadForm4-dropdown-option">
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
                            <span className="EntrustUploadForm4-max-selection">(最多1項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedCategory || "類別"}  
                            readOnly 
                            className={`EntrustUploadForm4-input-box ${selectedCategory ? "black-text" : "gray-text"}`}
                        />
                    </div>

                    <div className="EntrustUploadForm4-group category-width" ref={styleRef}>
                        <div className="EntrustUploadForm4-dropdown-container">
                            <div 
                                id="style-dropdown" 
                                className={`EntrustUploadForm4-dropdown ${isStyleOpen ? "open" : ""}`} 
                                onClick={() => setIsStyleOpen(!isStyleOpen)}
                            >
                                風格選擇
                                {isStyleOpen && (
                                    <ul className="EntrustUploadForm4-dropdown-options">
                                        {filteredStyles.map((option, index) => (
                                            <li key={index} className="EntrustUploadForm4-dropdown-option">
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
                            <span className="EntrustUploadForm4-max-selection">(最多3項)</span>
                        </div>
                        <input 
                            type="text" 
                            value={selectedStyles.length > 0 ? selectedStyles.join("、") : "風格1、風格2、風格3"}  
                            readOnly 
                            className={`EntrustUploadForm4-input-box ${selectedStyles.length > 0 ? "black-text" : "gray-text"}`}  
                        />
                    </div>
                </div>

                <div className="EntrustUploadForm4-group full-width">
                    <label className="EntrustUploadForm4-reference-label">用途選擇</label>
                    <Dropdown
                        options={EntrustUsageOptions}
                        value={usage}
                        onSelect={(val) => setUsage(val)}
                        placeholder="商業用途/個人使用"
                    />
                </div>

                <div className="EntrustUploadForm4-button-group">
                  <button className="EntrustUploadForm4-prev" onClick={prev}>上一步</button>
                  <button className="EntrustUploadForm4-next" onClick={handleNextClick}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default EntrustUploadForm4;
