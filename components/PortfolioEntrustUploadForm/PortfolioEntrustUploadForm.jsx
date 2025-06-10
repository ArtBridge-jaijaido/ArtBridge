"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { useSelector, useDispatch } from "react-redux";

import { uploadEntrustPortfolio } from "@/services/artworkEntrustPortfolioService";
import { addEntrustPortfolio } from "@/app/redux/feature/entrustPortfolioSlice";
import "./PortfolioEntrustUploadForm.css";

const PortfolioEntrustUploadForm = ({ formData = {}, onSubmit }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [exampleImage, setExampleImage] = useState(formData.exampleImage || null);
    const [exampleImageName, setExampleImageName] = useState(formData.exampleImageName || "");
    const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || "");
    const [selectedStyles, setSelectedStyles] = useState(formData.selectedStyles || []);
    const [assignedArtist, setAssignedArtist] = useState(formData.assignedArtist || "");


    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);

    const categoryRef = useRef(null);
    const styleRef = useRef(null);

    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    const handleExampleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (exampleImage?.preview) URL.revokeObjectURL(exampleImage.preview);
            const previewURL = URL.createObjectURL(file);
            setExampleImage({ file, preview: previewURL });
            setExampleImageName(file.name);
        }
    };

    useEffect(() => {
        return () => {
            if (exampleImage?.preview) URL.revokeObjectURL(exampleImage.preview);
        };
    }, []);

    const handleCategorySelect = (option) => {
        setSelectedCategory(option === selectedCategory ? "" : option);
        setIsCategoryOpen(false);
    };

    const handleStyleSelect = (event, option) => {
        event.stopPropagation();
        if (selectedStyles.includes(option)) {
            setSelectedStyles(prev => prev.filter(item => item !== option));
        } else if (selectedStyles.length < 3) {
            setSelectedStyles(prev => [...prev, option]);
        } else {
            addToast("error", "最多只能選擇3項風格！");
        }
    };

    const handleArtistInputChange = (e) => {
        setAssignedArtist(e.target.value);
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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedStyles.length === 3) {
            setIsStyleOpen(false);
        }
    }, [selectedStyles]);

    const validateForm = () => {
        if (!exampleImage) {
            addToast("error", "請上傳範例圖片！");
            return false;
        }
        if (!selectedCategory) {
            addToast("error", "請選擇類別！");
            return false;
        }
        if (selectedStyles.length === 0) {
            addToast("error", "請選擇至少一個風格！");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const userSerialId = user?.userSerialId;
            const userUid = user?.uid;
            const data = {
                exampleImage: {
                    name: exampleImage.file.name,
                    file: exampleImage.file,
                    preview: exampleImage.preview
                },
                exampleImageName,
                selectedCategory,
                selectedStyles,
                assignedArtist
            };

            if (onSubmit) await onSubmit(data);

            const response = await uploadEntrustPortfolio(userUid, userSerialId, data);
            if (response.success) {
                dispatch(addEntrustPortfolio(response.portfolioData));
                addToast("success", "作品發布成功！");
                setTimeout(() => router.push("/artworkEntrustPortfolio"), 1000);
            } else {
                console.error("上傳失敗:", response.message);
                addToast("error", "發布失敗，請稍後再試！");
            }
        } catch (error) {
            console.error("上傳錯誤:", error);
            addToast("error", "發布失敗，請稍後再試！");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="PortfolioEntrustUploadForm-wrapper">
            <div className="PortfolioEntrustUploadForm-container">
                <div className="PortfolioEntrustUploadForm-grid">
                    {/* 左側圖片 */}
                    <div className="PortfolioEntrustUploadForm-image-upload">
                        <label>作品</label>
                        <div className="PortfolioEntrustUploadForm-uploadImg-box">
                            {exampleImage?.preview ? (
                                <img src={exampleImage.preview} alt="預覽" className="PortfolioEntrustUploadForm-preview" />
                            ) : (
                                <span className="PortfolioEntrustUploadForm-gray-text">請上傳範例圖片 (JPG, PNG, GIF)<br />最多 15MB</span>
                            )}
                            <input type="file" accept="image/*" onChange={handleExampleImageUpload} />
                        </div>
                    </div>

                    {/* 右側表單 */}
                    <div className="PortfolioEntrustUploadForm-form-area">
                        {/* 類別 */}
                        <div className="PortfolioEntrustUploadForm-category-width" ref={categoryRef}>
                            <div className="PortfolioEntrustUploadForm-dropdown-container">
                                <div
                                    id="category-dropdown"
                                    className={`PortfolioEntrustUploadForm-dropdown ${isCategoryOpen ? "open" : ""}`}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    類別選擇
                                    {isCategoryOpen && (
                                        <ul className="PortfolioEntrustUploadForm-dropdown-options">
                                            {filteredCategories.map((option, index) => (
                                                <li key={index} className="PortfolioEntrustUploadForm-dropdown-option">
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
                                <span className="PortfolioEntrustUploadForm-max-selection">(最多1項)</span>
                            </div>
                            <input
                                type="text"
                                value={selectedCategory || "類別"}
                                readOnly
                                className={`PortfolioEntrustUploadForm-input-box ${selectedCategory ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 風格 */}
                        <div className="PortfolioEntrustUploadForm-style-width" ref={styleRef}>
                            <div className="PortfolioEntrustUploadForm-dropdown-container">
                                <div
                                    id="style-dropdown"
                                    className={`PortfolioEntrustUploadForm-dropdown ${isStyleOpen ? "open" : ""}`}
                                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                                >
                                    風格選擇
                                    {isStyleOpen && (
                                        <ul className="PortfolioEntrustUploadForm-dropdown-options">
                                            {filteredStyles.map((option, index) => (
                                                <li key={index} className="PortfolioEntrustUploadForm-dropdown-option">
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
                                <span className="PortfolioEntrustUploadForm-max-selection">(最多3項)</span>
                            </div>
                            <input
                                type="text"
                                value={selectedStyles.length > 0 ? selectedStyles.join("、") : "風格1、風格2、風格3"}
                                readOnly
                                className={`PortfolioEntrustUploadForm-input-box ${selectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 指定繪師 */}
                        <div className="PortfolioEntrustUploadForm-artist-width">
                            <label style={{ fontWeight: 'bold', marginBottom: '10px', color: '#4F4F4F', fontSize: '18px' }}>指定一名繪師</label>
                            <input
                                type="text"
                                placeholder="請輸入繪師名稱"
                                value={assignedArtist}
                                onChange={handleArtistInputChange}
                                className="PortfolioEntrustUploadForm-input-box"
                            />
                        </div>
                    </div>
                </div>

                {/* 按鈕區 */}
                <div className="PortfolioEntrustUploadForm-button-group">
                    <button className="PortfolioEntrustUploadForm-prev" onClick={() => router.push("/artworkEntrustPortfolio")}>取消</button>
                    <LoadingButton isLoading={isSubmitting} onClick={handleSubmit} loadingText={"發布中"}>發佈</LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default PortfolioEntrustUploadForm;
