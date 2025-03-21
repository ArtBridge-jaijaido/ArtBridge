"use client";
import React, { useState, useEffect, useRef } from "react";
import "./ArticleUploadForm.css";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { useNavigation } from "@/lib/functions.js";
import { useSelector } from "react-redux";
import { uploadArticle} from "@/services/artworkArticleService";


const ArticleUploadForm = () => {
    const { user } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        exampleImage: "",
        title: "",
        innerContext: "",
        selectedCategory: "",
        selectedStyles: [],
    });
    const { addToast } = useToast();
    const navigate = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const categoryRef = useRef(null);
    const styleRef = useRef(null);
    const filteredStyles = artMarketStyle.filter(option => option !== "全部");
    const filteredCategories = artMarketCategory.filter(option => option !== "全部");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // 照片上傳
    const handleExampleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                addToast("error", "檔案大小超過 15MB");
                return;
            }

            if (formData.exampleImage) {
                URL.revokeObjectURL(formData.exampleImage.preview);
            }

            const preview = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                exampleImage: { file, preview }
            }));
        }
    };


    // 類別選擇（單選）
    const handleCategorySelect = (option) => {
        setFormData(prev => ({
            ...prev,
            selectedCategory: prev.selectedCategory === option ? "" : option
        }));
        setIsCategoryOpen(false);
    };

    // 風格選擇（最多 3 項）
    const handleStyleSelect = (event, option) => {
        event.stopPropagation();

        if (formData.selectedStyles.length === 3 && !formData.selectedStyles.includes(option)) {
            addToast("error", "最多只能選擇 3 項風格");
            return;
        }

        setFormData(prev => {
            let updatedStyles;
            if (prev.selectedStyles.includes(option)) {
                updatedStyles = prev.selectedStyles.filter(item => item !== option);
            } else if (prev.selectedStyles.length < 3) {
                updatedStyles = [...prev.selectedStyles, option];
            } else {

                return prev; // 不要變更 state
            }
            return { ...prev, selectedStyles: updatedStyles };
        });
    };

    // 關閉選單
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 如果點擊的地方不在 styleRef 或 categoryRef 內，就關閉選單
            if (styleRef.current && !styleRef.current.contains(event.target)) {
                setIsStyleOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    const validateForm = () => {

        if (!formData.title) {
            addToast("error", "請輸入標題！");
            return false;
        }else if (formData.title.length > 12) {
            addToast("error", "標題字數不得超過 12 字！");
            return false;
        }

        if (!formData.innerContext) {
            addToast("error", "請輸入內文！");
            return false;
        }

        if (!formData.exampleImage) {
            addToast("error", "請上傳範例圖片！");
            return false;
        }
        if (!formData.selectedCategory) {
            addToast("error", "請選擇類別！");
            return false;
        }
        if (formData.selectedStyles.length === 0) {
            addToast("error", "請選擇至少一個風格！");
            return false;
        }
     
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        console.log("提交的資料：", formData);

        

        try {
            const userSerialId = user?.userSerialId;
            const userUid = user?.uid;
            const response = await uploadArticle(userUid,userSerialId,formData);

            if (response.success) {
                addToast("success", response.message);
                navigate("/artworkPainterArticle");
            } else {
                addToast("error", response.message);
            }
        }catch (error) {
           
            addToast("error", "發布失敗，請稍後再試");
        }finally{
            setIsSubmitting(false);
        }

    };

    return (
        <div className="ArticleUploadForm-wrapper">
            <div className="ArticleUploadForm-container">
                <div className="ArticleUploadForm-grid">

                    {/* 左側 - 文章圖片上傳 */}
                    <div className="ArticleUploadForm-image-upload">
                        <label className="ArticleUploadForm-label">文章圖片</label>
                     
                        <label htmlFor="imageUpload" className="ArticleUploadForm-image-box">
                            {formData.exampleImage ? (
                                <img src={formData.exampleImage.preview} alt="example" className="ArticleUploadForm-image-preview" />
                            ) : (
                            <div className="ArticleUploadForm-image-placeholder">
                                請上傳範例圖片 (JPG, PNG, GIF) <br /> 最多15MB
                            </div>
                            )}

                            <input type="file" id="imageUpload" accept="image/*" style={{ display: "none" }} onChange={handleExampleImageUpload}/>
                        </label>
                    </div>

                    {/* 右側 - 標題 & 內文 */}
                    <div className="ArticleUploadForm-text-section">
                        <label className="ArticleUploadForm-label">標題</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="請輸入標題 (最多12字)"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="ArticleUploadForm-input"
                            maxLength={12}
                        />

                        <label className="ArticleUploadForm-label">內文</label>
                        <textarea
                            name="innerContext"
                            placeholder="請輸入內文"
                            value={formData.innerContext}
                            onChange={handleInputChange}
                            className="ArticleUploadForm-textarea"
                        />
                    </div>
                    

                    
                    {/* 下方 - 左側分類  */}
                    <div className="ArticleUploadForm-dropdowns">
                        {/* 分類選擇 */}
                        <div className="ArticleUploadForm-category-width" ref={categoryRef}>
                            <div className="ArticleUploadForm-dropdown-container">
                                <div
                                    id="ArticleUploadForm-dropdown-btn"
                                    className={`ArticleUploadForm-dropdown ${isCategoryOpen ? "open" : ""}`}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    分類選擇
                                    {isCategoryOpen && (
                                        <ul className="ArticleUploadForm-dropdown-options">
                                            {filteredCategories.map((option, index) => (
                                                <li key={index} className="ArticleUploadForm-dropdown-option">
                                                    <input
                                                        type="checkbox"
                                                        name="category"
                                                        checked={formData.selectedCategory === option}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => handleCategorySelect(option)}
                                                    />
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                     
                                </div>
                                <span className="ArticleUploadForm-max-selection">(最多1項)</span>
                            </div>
                            <input
                                type="text"
                                value={formData.selectedCategory || "請選擇分類"}
                                readOnly
                                className={`ArticleUploadForm-input-box ${formData.selectedCategory ? "black-text" : "gray-text"}`}
                            />
                        </div>
                    </div>
                    {/* 下方 - 右側風格  */}
                    <div className="ArticleUploadForm-dropdowns">
                        {/* 風格選擇 */}
                        <div className="ArticleUploadForm-style-width" ref={styleRef}>
                            <div className="ArticleUploadForm-dropdown-container">
                                <div
                                    id="ArticleUploadForm-dropdown-btn"
                                    className={`ArticleUploadForm-dropdown ${isStyleOpen ? "open" : ""}`}
                                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                                >
                                    風格選擇
                                    {isStyleOpen && (
                                        <ul className="ArticleUploadForm-dropdown-options">
                                            {filteredStyles.map((option, index) => (
                                                <li key={index} className="ArticleUploadForm-dropdown-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selectedStyles.includes(option)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleStyleSelect(e, option)}
                                                    />
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <span className="ArticleUploadForm-max-selection">(最多3項)</span>
                            </div>
                            <input
                                type="text"
                                value={formData.selectedStyles.length > 0 ? formData.selectedStyles.join("、") : "風格1、風格2、風格3"}
                                readOnly
                                className={`ArticleUploadForm-input-box ${formData.selectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                            />
                        </div>

                    </div>

                </div>

                <div className="ArticleUploadForm-button-group">
                <button className="ArticleUploadForm-prev" onClick={() => navigate("/artworkPainterArticle")}>
                    取消
                    </button>
                    <LoadingButton  isLoading={isSubmitting} onClick={handleSubmit} loadingText={"發布中"} >發佈</LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default ArticleUploadForm;
