"use client";
import React, { useState } from "react";
import "./MarketUploadForm2.css";

const MarketUploadFormPage2 = ({ prev, next }) => {
    const [exampleImage, setExampleImage] = useState(null);
    const [supplementaryImages, setSupplementaryImages] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    // 主要圖片上傳
    const handleExampleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setExampleImage(URL.createObjectURL(file));
        }
    };

    // 補充圖片上傳
    const handleSupplementaryImagesUpload = (event) => {
        event.preventDefault();
        const files = Array.from(event.target.files);
        handleFiles(files);
    };

    // 讓補充圖片可以拖曳上傳
    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        handleFiles(files);
    };

    // 防止拖曳時開啟檔案
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // 刪除單個補充圖片
    const handleDeleteSupplementaryImage = (index) => {
        const newImages = supplementaryImages.filter((_, i) => i !== index);
        const newFileNames = fileNames.filter((_, i) => i !== index);
        setSupplementaryImages(newImages);
        setFileNames(newFileNames);
    };

    // 共用處理檔案上傳的函數
    const handleFiles = (files) => {
        if (files.length + supplementaryImages.length > 10) {
            alert("最多只能上傳 10 張補充圖片");
            return;
        }

        const newImages = files.map(file => URL.createObjectURL(file));
        const newFileNames = files.map(file => file.name);

        setSupplementaryImages([...supplementaryImages, ...newImages]);
        setFileNames([...fileNames, ...newFileNames]);
    };

    return (
        <div className="MarketUploadForm2-wrapper">
            <div className="MarketUploadForm2-container">
                {/* 兩個上傳框區域 */}
                <div className="MarketUploadForm2-upload-row">
                    {/* 範例圖片 */}
                    <div className="MarketUploadForm2-image-upload example">
                        <label>範例圖片 (1張)</label>
                        <div className="MarketUploadForm2-upload-box">
                            {exampleImage ? (
                                <img src={exampleImage} alt="範例圖片" className="MarketUploadForm2-preview" />
                            ) : (
                                <span className="MarketUploadForm2-gray-text">請上傳範例圖片 (JPG, PNG, GIF) <br/>最多 15MB</span>
                            )}
                            <input type="file" accept="image/*" onChange={handleExampleImageUpload} />
                        </div>
                    </div>

                    {/* 補充圖片 */}
                    <div className="MarketUploadForm2-image-upload supplementary">
                        <label>補充圖片 (10張)</label>
                        <div 
                            className="MarketUploadForm2-upload-box small-box"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {supplementaryImages.length > 0 ? (
                                <img src={supplementaryImages[0]} alt="補充圖片" className="MarketUploadForm2-preview" />
                            ) : (
                                <span className="MarketUploadForm2-gray-text">請拖曳或點擊上傳補充圖片 (JPG, PNG, GIF) <br/>單張 15MB 以下</span>
                            )}
                            <input type="file" accept="image/*" multiple onChange={handleSupplementaryImagesUpload} />
                        </div>
                        
                        {/* 顯示檔名 + 刪除按鈕 */}
                        {fileNames.length > 0 && (
                            <div className="MarketUploadForm2-file-names">
                                {fileNames.map((name, index) => (
                                    <div key={index} className="file-name-container">
                                        <span className="file-name">{name}</span>
                                        <button className="delete-file" onClick={() => handleDeleteSupplementaryImage(index)}>✖</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 按鈕區域 */}
                <div className="MarketUploadForm2-button-group">
                    <button className="MarketUploadForm2-prev" onClick={prev}>上一步</button>
                    <button className="MarketUploadForm2-next" onClick={next}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage2;
