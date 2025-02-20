"use client";
import React, { useState } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./MarketUploadForm2.css";

const MarketUploadFormPage2 = ({ prev, next, formData }) => {
    const { addToast } = useToast();
    const [exampleImage, setExampleImage] = useState(formData.exampleImage || null);
    const [exampleImageName, setExampleImageName] = useState(formData.exampleImageName || ""); 
    const [supplementaryImages, setSupplementaryImages] = useState(formData.supplementaryImages || []);
    const [supplementaryImageName, setFileNames] = useState(formData.supplementaryImageName || []);
    

    const handleExampleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setExampleImage(URL.createObjectURL(file));
            setExampleImageName(file.name); 
        }
    };

    const handleSupplementaryImagesUpload = (event) => {
        event.preventDefault();
        const files = Array.from(event.target.files);
        handleFiles(files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        handleFiles(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDeleteSupplementaryImage = (index) => {
        const newImages = supplementaryImages.filter((_, i) => i !== index);
        const newFileNames = supplementaryImageName.filter((_, i) => i !== index);
        setSupplementaryImages(newImages);
        setFileNames(newFileNames);
    };

    const handleFiles = (files) => {
        if (files.length + supplementaryImages.length > 10) {
            addToast("error", "最多只能上傳 10 張補充圖片");
            return;
        }

        const newImages = files.map(file => URL.createObjectURL(file));
        const newFileNames = files.map(file => file.name);

        setSupplementaryImages([...supplementaryImages, ...newImages]);
        setFileNames([...supplementaryImageName, ...newFileNames]);
    };

    const handleNextClick = () => {
        if (!exampleImage) {
            addToast("error", "請上傳範例圖片！");
            return;
        }
        next({
            exampleImage,
            exampleImageName,
            supplementaryImages,
            supplementaryImageName
        });
    };

    return (
        <div className="MarketUploadForm2-wrapper">
            <div className="MarketUploadForm2-container">
                <div className="MarketUploadForm2-upload-row">
                    <div className="MarketUploadForm2-image-upload example">
                        <label>範例圖片 (1張)</label>
                        <div className="MarketUploadForm2-uploadImg-box">
                            {exampleImage ? (
                                <img src={exampleImage} alt="範例圖片" className="MarketUploadForm2-preview" />
                            ) : (
                                <span className="MarketUploadForm2-gray-text">請上傳範例圖片 (JPG, PNG, GIF) <br/>最多 15MB</span>
                            )}
                            <input type="file" accept="image/*" onChange={handleExampleImageUpload} />
                        </div>
                    </div>

                    <div className="MarketUploadForm2-image-upload supplementary">
                        <label>補充圖片 (10張)</label>
                        <div 
                            className="MarketUploadForm2-uploadImg-box small-box"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {supplementaryImages.length > 0 ? (
                                <img src={supplementaryImages[supplementaryImages.length - 1]} alt="補充圖片" className="MarketUploadForm2-preview" />
                            ) : (
                                <span className="MarketUploadForm2-gray-text">請拖曳或點擊上傳補充圖片 (JPG, PNG, GIF) <br/>單張 15MB 以下</span>
                            )}
                            <input type="file" accept="image/*" multiple onChange={handleSupplementaryImagesUpload} />
                        </div>

                        {supplementaryImageName.length > 0 && (
                            <div className="MarketUploadForm2-file-names">
                                {supplementaryImageName.map((name, index) => (
                                    <div key={index} className="MarketUploadForm2-file-name-container">
                                        <span className="MarketUploadForm2-file-name">{name}</span>
                                        <button className="MarketUploadForm2-delete-file" onClick={() => handleDeleteSupplementaryImage(index)}>✖</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="MarketUploadForm2-button-group">
                    <button className="MarketUploadForm2-prev" onClick={prev}>上一步</button>
                    <button className="MarketUploadForm2-next" onClick={handleNextClick}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage2;
