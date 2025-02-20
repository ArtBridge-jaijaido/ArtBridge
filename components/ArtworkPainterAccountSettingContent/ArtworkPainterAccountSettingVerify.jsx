"use client";
import React, { useState, useRef, useEffect } from "react";
import "./ArtworkPainterAccountSettingVerify.css";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { useToast } from "@/app/contexts/ToastContext.js";
import { uploadImage } from "@/services/storageService.js";
import { updateUserData } from "@/services/userService.js";
import { updateUser } from "@/app/redux/feature/userSlice.js";
import { useSelector, useDispatch } from "react-redux";

const ArtworkPainterAccountSettingVerify = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState(Array(3).fill(null)); // 3張作品圖片
  const [selectedProcessFile, setSelectedProcessFile] = useState(null);      // 作畫過程檔案
  const maxFileSize = 15 * 1024 * 1024; // 15MB
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // **使用 useRef 來隱藏 input**
  const imageInputRefs = useRef([]);
  const processFileInputRef = useRef(null);

  useEffect(() => {
    if (user?.verifyThreeArtwork && user.verifyThreeArtwork.length > 0) {
      setSelectedImages(
        user.verifyThreeArtwork.map((imageUrl) => ({
          file: null,
          preview: imageUrl,
        }))
      );
    }

    if (user?.verifyProcessFile?.url) {
      setSelectedProcessFile({
        file: null,
        preview: user.verifyProcessFile.url, // URL
        name: user.verifyProcessFile.name,  // 原始檔案名稱
      });
    }
  }, [user]);

  const triggerImageUpload = (index) => {
    if (imageInputRefs.current[index]) {
      imageInputRefs.current[index].click();
    }
  };

  const triggerProcessFileUpload = () => {
    if (processFileInputRef.current) {
      processFileInputRef.current.click();
    }
  };


  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檢查檔案大小
    if (file.size > maxFileSize) {
      addToast("error", "檔案大小不能超過 15MB");
      return;
    }

    // 檢查檔案類型
    if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)) {
      addToast("error", "檔案格式只能為 JPG, PNG, GIF");
      return;
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
      addToast("error", "檔案大小不能超過 15MB");
      return;
    }

    // 檢查檔案類型
    if (!["video/mp4", "application/pdf"].includes(file.type)) {
      addToast("error", "檔案格式只能為 MP4, PDF");
      return;
    }

    // 取得預覽 URL
    const filePreview = URL.createObjectURL(file);

    setSelectedProcessFile({ file, preview: filePreview, name: file.name });
  };

  const handleUpload = async () => {
    if (!user?.uid) {
      return;
    }

    setIsSaving(true);

    try {
      // 取得已存在的圖片 URL，確保未變更的圖片不會被刪除
      const existingImages = user.verifyThreeArtwork || [];
      const existingProcessFile = user.verifyProcessFile || null;

      // 確保 `selectedImages` 陣列中的圖片是完整的
      const finalImages = selectedImages.map((image, index) => {
        if (image?.file) {
          return image; // 已經選擇要上傳的新圖片
        } else {
          return { file: null, preview: existingImages[index] || null }; // 保留舊圖片 URL
        }
      });

      // **並行上傳所有新圖片(作品驗證)**
      const uploadPromises = finalImages.map(async (image, index) => {
        if (image.file) {
          const storagePath = `usersProfile/${user.uid}/accountSettingVerifyArtworks/verifyArtwork${index + 1}`;
          return await uploadImage(image.file, storagePath);
        }
        return image.preview;
      });

      // **處理 MP4 / PDF 上傳**
      let uploadedProcessFile = existingProcessFile;
      if (selectedProcessFile?.file) {
        const processFilePath = `usersProfile/${user.uid}/accountSettingVerifyArtworks/verifyProcessFile`;
        const fileUrl = await uploadImage(selectedProcessFile.file, processFilePath);
        
        uploadedProcessFile = {
          url: fileUrl,
          name: selectedProcessFile.file.name, // **存儲原始檔案名稱**
        };
      }

      // 等待所有圖片上傳完成
      const uploadedImageUrls = await Promise.all(uploadPromises);

      // **更新 Firebase Firestore**
      const updatedData = {
        verifyThreeArtwork: uploadedImageUrls,
        verifyProcessFile: uploadedProcessFile
      };
      await updateUserData(user.uid, updatedData);

      // **更新 Redux store**
      dispatch(updateUser(updatedData));

      addToast("success", "驗證作品與作畫過程上傳成功！");
    } catch (error) {
      console.error("驗證作品上傳失敗:", error);
      addToast("error", "驗證作品上傳失敗，請稍後再試！");
    } finally {
      setIsSaving(false);
    }
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
            onClick={() => triggerImageUpload(index)} // 觸發 input
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
            onClick={triggerProcessFileUpload} // 觸發 input
          >
            <input
              type="file"
              accept="video/mp4, application/pdf"
              ref={processFileInputRef}
              onChange={handleProcessFileUpload}
              style={{ display: "none" }} // 隱藏 input
            />
            {selectedProcessFile?.name ? (
              <p>{selectedProcessFile.file ? selectedProcessFile.file.name : selectedProcessFile.name}</p>
            ) : (
              <span>MP4, PDF (最大15MB)</span>
            )}
          </div>

      </div>

      {/* 說明區塊 */}
      <div className="artworkPainterAccountSettingVerify-info">
        <h2>說明</h2>
        <p>繪師需要通過驗證，才可以使用各項功能，驗證方式如下:</p>
        <p>1. 上傳3張您的作品</p>
        <p>2. 上傳一份您的作畫過程，可以是錄製縮時影片，也可以將您作畫的每個階段拍下，做成一份PTT或是Word，再將檔案儲存為PDF檔即可上傳</p>
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
