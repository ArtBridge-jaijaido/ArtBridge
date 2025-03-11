"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/ToastContext.js";
import { artMarketCategory, artMarketStyle, downloadOption } from '@/lib/artworkDropdownOptions.js';
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { uploadPortfolio } from "@/services/artworkPortfolioService";
import { useSelector } from "react-redux";

import "./PortfolioUploadForm.css";

const PortfolioUploadForm = ({ formData = {}, onSubmit }) => {
    const router = useRouter();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [exampleImage, setExampleImage] = useState(formData.exampleImage || null);
    const [exampleImageName, setExampleImageName] = useState(formData.exampleImageName || "");
    const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || "");
    const [selectedStyles, setSelectedStyles] = useState(formData.selectedStyles || []);
    const [download, setDownload] = useState(formData.download || "");


    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    const categoryRef = useRef(null);
    const styleRef = useRef(null);
    const downloadRef = useRef(null);

    const downloadOptions = downloadOption;
    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");

    const handleExampleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (exampleImage?.preview) {
                URL.revokeObjectURL(exampleImage.preview); 
            }

            const previewURL = URL.createObjectURL(file);
            console.log("Preview URL:", previewURL);

            setExampleImage({
                file,
                preview: previewURL
            });
            setExampleImageName(file.name);
        }
    };
    useEffect(() => {
        return () => {
            if (exampleImage?.preview) {
                URL.revokeObjectURL(exampleImage.preview);
            }
        };
    }, []);



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
            if (downloadRef.current && !downloadRef.current.contains(event.target)) {
                setIsDownloadOpen(false);
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
        if (!download) {
            addToast("error", "請選擇是否需要下載！");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true); // 啟用 Loading 狀態

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
                download
            };
            console.log("Form Data:", data);

            if (onSubmit) {
                await onSubmit(data);

            }

            //  上傳 Portfolio 到 Firebase
            const response = await uploadPortfolio(userUid, userSerialId, data);

            if (response.success) {
                addToast("success", "作品發布成功！");
                setTimeout(() => {
                    router.push("/artworkPainterPortfolio");
                }, 1000);

            } else {
                console.error("作品上傳失敗:", response.message);
                addToast("error", "發布失敗，請稍後再試！");
            }
        } catch (error) {

            addToast("error", "發布失敗，請稍後再試！");
        } finally {
            setIsSubmitting(false);

        }
    };


    return (
        <div className="PortfolioUploadForm-wrapper">
            <div className="PortfolioUploadForm-container">
                <div className="PortfolioUploadForm-grid">
                    {/* 左側圖片上傳 */}
                    <div className="PortfolioUploadForm-image-upload">
                        <label>作品</label>
                        <div className="PortfolioUploadForm-uploadImg-box">
                            {exampleImage?.preview ? (
                                <img src={exampleImage.preview} alt="範例圖片" className="PortfolioUploadForm-preview" />
                            ) : (
                                <span className="PortfolioUploadForm-gray-text">請上傳範例圖片 (JPG, PNG, GIF)<br />最多 15MB</span>
                            )}
                            <input type="file" accept="image/*" onChange={handleExampleImageUpload} />
                        </div>
                    </div>

                    {/* 右邊表單區*/}
                    <div className="PortfolioUploadForm-form-area">
                        {/* 類別選擇 */}
                        <div className="PortfolioUploadForm-category-width" ref={categoryRef}>
                            <div className="PortfolioUploadForm-dropdown-container">
                                <div
                                    id="category-dropdown"
                                    className={`PortfolioUploadForm-dropdown ${isCategoryOpen ? "open" : ""}`}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    類別選擇
                                    {isCategoryOpen && (
                                        <ul className="PortfolioUploadForm-dropdown-options">
                                            {filteredCategories.map((option, index) => (
                                                <li key={index} className="PortfolioUploadForm-dropdown-option">
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
                                <span className="PortfolioUploadForm-max-selection">(最多1項)</span>
                            </div>
                            <input
                                type="text"
                                value={selectedCategory || "類別"}
                                readOnly
                                className={`PortfolioUploadForm-input-box ${selectedCategory ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 風格選擇 */}
                        <div className="PortfolioUploadForm-style-width" ref={styleRef}>
                            <div className="PortfolioUploadForm-dropdown-container">
                                <div
                                    id="style-dropdown"
                                    className={`PortfolioUploadForm-dropdown ${isStyleOpen ? "open" : ""}`}
                                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                                >
                                    風格選擇
                                    {isStyleOpen && (
                                        <ul className="PortfolioUploadForm-dropdown-options">
                                            {filteredStyles.map((option, index) => (
                                                <li key={index} className="PortfolioUploadForm-dropdown-option">
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
                                <span className="PortfolioUploadForm-max-selection">(最多3項)</span>
                            </div>
                            <input
                                type="text"
                                value={selectedStyles.length > 0 ? selectedStyles.join("、") : "風格1、風格2、風格3"}
                                readOnly
                                className={`PortfolioUploadForm-input-box ${selectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                            />
                        </div>

                        {/* 第二行：是否可以下載 */}
                        <div className="PortfolioUploadForm-download-width" ref={downloadRef}>
                            <label className="PortfolioUploadForm-download-label">是否可供下載</label>
                            <div className={`PortfolioUploadForm-dropdown ${isDownloadOpen ? "open" : ""}`} onClick={() => setIsDownloadOpen(!isDownloadOpen)}>
                                <div className={`PortfolioUploadForm-dropdown-selected ${download ? "black-text" : "gray-text"}`}>
                                    {download || "是/否"}
                                </div>
                                {isDownloadOpen && (
                                    <div className="PortfolioUploadForm-dropdown-options">
                                        {downloadOptions.map((option, index) => (
                                            <div key={index} className="PortfolioUploadForm-dropdown-option" onClick={() => {
                                                setDownload(option);
                                                setIsDownloadOpen(false);
                                            }}>
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 按鈕區域 */}
                <div className="PortfolioUploadForm-button-group">
                    <button className="PortfolioUploadForm-prev" onClick={() => router.push("/artworkPainterPortfolio")}>取消</button>
                    <LoadingButton isLoading={isSubmitting} onClick={handleSubmit} loadingText={"發布中"} >發佈</LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default PortfolioUploadForm;
