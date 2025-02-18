"use client";
import React, { useState, useRef } from "react";
import "./ArtworkPainterAccountSettingVerify.css";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";

const ArtworkPainterAccountSettingVerify = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState(Array(3).fill(null));
  const [selectedProcessFile, setSelectedProcessFile] = useState(null);
  const maxFileSize = 15 * 1024 * 1024; // 15MB

  // **使用 useRef 來隱藏 input**
  const imageInputRefs = useRef([]);
  const processFileInputRef = useRef(null);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檢查檔案大小
    if (file.size > maxFileSize) {
      alert("檔案大小不能超過 15MB");
      return;
    }

    // 釋放舊的 URL (防止記憶體洩漏)
    if (selectedImages[index]) {
      URL.revokeObjectURL(selectedImages[index].preview);
    }

    // 創建新的預覽 URL
    const previewUrl = URL.createObjectURL(file);

    // 更新圖片狀態
    const updatedImages = [...selectedImages];
    updatedImages[index] = { file, preview: previewUrl };
    setSelectedImages(updatedImages);
  };

  const handleProcessFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檢查檔案大小
    if (file.size > maxFileSize) {
      alert("檔案大小不能超過 15MB");
      return;
    }

    setSelectedProcessFile(file);
  };

  const handleUpload = () => {
    setIsSaving(true);
    // 處理上傳邏輯
    setTimeout(() => {
      setIsSaving(false);
      alert("上傳成功");
    }, 2000);
  };

  return (
    <div className="artworkPainterAccountSettingVerify-container">
      {/* 標題 */}
      <div className="artworkPainterAccountSettingVerify-title">
        <h1>請上傳作品3張及作畫過程1份</h1>
        <span className="artworkPainterAccountSettingVerify-required">*</span>
        <span className="artworkPainterAccountSettingVerify-pending">⚠️官方驗證中</span>
      </div>

      {/* 上傳作品 */}
      <div className="artworkPainterAccountSettingVerify-upload-section">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="artworkPainterAccountSettingVerify-upload-box"
            onClick={() => imageInputRefs.current[index]?.click()} // 觸發 input
          >
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              ref={(el) => (imageInputRefs.current[index] = el)}
              onChange={(e) => handleImageUpload(e, index)}
              style={{ display: "none" }} // 隱藏 input
            />

            {/* 顯示圖片預覽 */}
            {selectedImages[index] ? (
              <img
                src={selectedImages[index].preview}
                alt="上傳的圖片"
                className="artworkPainterAccountSettingVerify-preview"
              />
            ) : (
              <span>JPG, PNG, GIF (最大15MB)</span>
            )}
          </div>
        ))}

        {/* 作畫過程上傳框 (MP4 或 PDF) */}
        <div
          className="artworkPainterAccountSettingVerify-upload-box"
          onClick={() => processFileInputRef.current?.click()} // 觸發 input
        >
          <input
            type="file"
            accept="video/mp4, application/pdf"
            ref={processFileInputRef}
            onChange={handleProcessFileUpload}
            style={{ display: "none" }} // 隱藏 input
          />
          {selectedProcessFile ? <p>{selectedProcessFile.name}</p> : <span>MP4, PDF (最大15MB)</span>}
        </div>
      </div>

      {/* 說明區塊 */}
      <div className="artworkPainterAccountSettingVerify-info">
        <h2>說明</h2>
        <p>繪師需要通過驗證，才可以使用各項功能，驗證方式如下:</p>
        <p>1. 上傳3張您的作品</p>
        <p>2. 上傳一份您的作畫過程，可以是錄製縮時影片，也可以將您作畫的每個階段拍下，做成一份PTT或是Word，儲存為PDF檔即可上傳</p>
      </div>

      {/* 確認上傳按鈕 */}
      <div className="artworkPainterAccountSettingVerify-submit-container">
        <LoadingButton isLoading={isSaving} onClick={handleUpload}>
          確認上傳
        </LoadingButton>
      </div>
    </div>
  );
};

export default ArtworkPainterAccountSettingVerify;
