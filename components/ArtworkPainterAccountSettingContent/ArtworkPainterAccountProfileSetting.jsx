"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ArtworkPainterAccountProfileSetting.css";
import { uploadImage } from "@/services/storageService.js";
import { updateUserData } from "@/services/userService.js";
import { updateUser } from "@/app/redux/feature/userSlice.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";

const ArtworkPainterAccountProfileSetting = ({
  userPainterProfileBackgroundImg,
  userProfileAvatar,
  userNickname,
  userExclusiveId,
  userPainterProfileIntroduction
}) => {
  const defaultAvatar = "/images/kv-min-4.png";
  const defaultBg = "/images/painter-background.png";
  const [isFlipped, setIsFlipped] = useState(false);
  const [previewBg, setPreviewBg] = useState(userPainterProfileBackgroundImg || defaultBg);
  const [previewAvatar, setPreviewAvatar] = useState(userProfileAvatar || defaultAvatar);
  const { setIsLoading } = useLoading();
  const [imageLoaded, setImageLoaded] = useState({
    bg: false,
    avatar: false
  });
  const { user, isAuthLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const backgroundInputRef = useRef(null);
  const avatarInputRef = useRef(null);


  // **簡介**
  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState(userPainterProfileIntroduction || "請輸入您的個人簡介...");
  const [charCount, setCharCount] = useState(userPainterProfileIntroduction?.length || 0);

  const handleEditIntroduction = () => {
    setIsEditing(true);
  };

  const handleCancelIntroduction = () => {
    setIntroduction(userPainterProfileIntroduction || "請輸入您的個人簡介...");
    setIsEditing(false);
  };

  const handleIntroductionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 250) {
      setIntroduction(text);
      setCharCount(text.length);
    }
  };

  const handleSaveIntroduction = async () => {
    if (!user?.uid) return;

    try {
      const updatedData = { painterIntroduction: introduction.trim() };
      const response = await updateUserData(user.uid, updatedData);

      if (response.success) {
        dispatch(updateUser(updatedData));
        setIsEditing(false);
      } else {
        alert("❌ 更新失敗，請稍後再試！");
      }
    } catch (error) {
      console.error("更新自介失敗", error);
    }
  };

  const handleUserExclusiveIdClick = () => {
    setIsFlipped(!isFlipped);
  };


  // **確認圖片是否已載入**
  useEffect(() => {
    const bgImage = new Image();
    const avatarImage = new Image();

    bgImage.src = previewBg;
    avatarImage.src = previewAvatar;

    bgImage.onload = () => setImageLoaded(prev => ({ ...prev, bg: true }));
    avatarImage.onload = () => setImageLoaded(prev => ({ ...prev, avatar: true }));
  }, [previewBg, previewAvatar]);

  useEffect(() => {
    if (imageLoaded.bg && imageLoaded.avatar) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [imageLoaded, setIsLoading]);

  // **處理背景圖片變更**
  const handleProfileBackgroundImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // **前端即時預覽**
    const newBgPreview = URL.createObjectURL(file);
    setPreviewBg(newBgPreview);


    // **上傳至 Firebase Storage**
    try {

      const uploadedBgImageUrl = await uploadImage(file, `usersProfile/${user.uid}/painterBackgroundImg.jpg`);

      // 確保 Firebase 回傳 URL
      if (uploadedBgImageUrl) {
        setPreviewBg(uploadedBgImageUrl);

        // **更新使用者資料**
        const updatedData = { painterProfileBackgroundImg: uploadedBgImageUrl };
        const response = await updateUserData(user.uid, updatedData);

        if (response.success) {
          dispatch(updateUser(updatedData));

        } else {
          console.error("背景圖片上傳失敗", error);
        }
      }
    } catch (error) {
      console.error("背景圖片上傳失敗", error);
    }
  };

  // **處理頭像變更**
  const handleProfileAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // **前端即時預覽**
    const newAvatarPreview = URL.createObjectURL(file);
    setPreviewAvatar(newAvatarPreview);
    dispatch(updateUser({ profileAvatar: newAvatarPreview })); // 即時更新頭像

    // **上傳至 Firebase Storage**
    try {
      const uploadedAvatarImageUrl = await uploadImage(file, `usersProfile/${user.uid}/avatar.jpg`);

      if (uploadedAvatarImageUrl) {
        setPreviewAvatar(uploadedAvatarImageUrl);


        // **更新使用者資料** 
        const updatedData = { profileAvatar: uploadedAvatarImageUrl };
        const response = await updateUserData(user.uid, updatedData);
        if (response.success) {
          dispatch(updateUser(updatedData));

        } else {
          console.error("頭像上傳失敗", error);
        }
      }
    } catch (error) {
      console.error("頭像上傳失敗", error);
    }


  };

  const triggerBackgroundUpload = () => {
    if (backgroundInputRef.current) {
      backgroundInputRef.current.click();
    }
  };

  const triggerAvatarUpload = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };





  return (
    <div
      className="ArtworkPainterAccountProfileSetting-container"
    >
      <div className="ArtworkPainterAccountProfileSetting-container-top-part">
        {/* 背景圖 */}
        <img src={previewBg}
          alt="profile-backgroundImg"
          className="ArtworkPainterAccountProfileSetting-background-img"
        />

        {/* 隱藏的檔案選擇按鈕 */}
        <input
          type="file"
          accept="image/*"
          className="ArtworkPainterAccountProfileSetting-hidden-input"
          ref={backgroundInputRef}
          onChange={handleProfileBackgroundImgChange}
        />

        {/* 點擊按鈕時，觸發 input */}
        <button
          className="ArtworkPainterAccountProfileSetting-edit-btn ArtworkPainterAccountProfileSetting-background-edit-btn"
          onClick={triggerBackgroundUpload}
        >
          <img src="/images/icons8-create-52-2.png" alt="編輯背景" />
        </button>

        {/* 專屬ID */}
        <button
          className={`ArtworkPainterAccountProfileSetting-exclusiveId ${isFlipped ? "flipped" : ""}`}
          onClick={handleUserExclusiveIdClick}
        >
          <span>
            {isFlipped ? userExclusiveId : "查看專屬ID"}
          </span>
        </button>

        {/* 頭像 */}
        <div className="ArtworkPainterAccountProfileSetting-profile-container">
          <div className="ArtworkPainterAccountProfileSetting-profile-avatar">
            <img src={previewAvatar}
              alt="使用者頭像"
              className="ArtworkPainterAccountProfileSetting-avatar-img"
            />

            {/* 隱藏的檔案選擇按鈕 */}
            <input
              type="file"
              accept="image/*"
              className="ArtworkPainterAccountProfileSetting-hidden-input"
              ref={avatarInputRef}
              onChange={handleProfileAvatarChange}
            />

            {/* 點擊按鈕時，觸發頭像選擇 */}
            <button
              className="ArtworkPainterAccountProfileSetting-edit-btn ArtworkPainterAccountProfileSetting-avatar-edit-btn"
              onClick={triggerAvatarUpload}
            >
              <img src="/images/icons8-create-52-2.png" alt="編輯頭像" />
            </button>
          </div>

          {/* 使用者名稱 */}
          <div className="ArtworkPainterAccountProfileSetting-profile-username">{userNickname}</div>
        </div>
      </div>
      {/* 簡介 */}
      <div className="ArtworkPainterAccountProfileSetting-introduction">

        <div className="ArtworkPainterAccountProfileSetting-intro-header">
          <span className="ArtworkPainterAccountProfileSetting-intro-title">個人簡介 </span> <span className="ArtworkPainterAccountProfileSetting-intro-limit">-最多 250 字</span>
         
        </div>

        {isEditing ? (
          <div className="ArtworkPainterAccountProfileSetting-intro-edit-container">
            <textarea
              value={introduction}
              onChange={handleIntroductionChange}
              maxLength={250}
              className="ArtworkPainterAccountProfileSetting-intro-textarea"
            />
            <div className="ArtworkPainterAccountProfileSetting-intro-footer">
              <span className="ArtworkPainterAccountProfileSetting-char-count">{charCount}/250</span>
              <div className="intro-buttons">
                <button className="cancel-btn" onClick={handleCancelIntroduction}>取消</button>
                <button className="save-btn" onClick={handleSaveIntroduction}>儲存</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="ArtworkPainterAccountProfileSetting-intro-display">
            <p>{introduction}</p>
            <button className="ArtworkPainterAccountProfileSetting-intro-edit-btn" onClick={handleEditIntroduction}>
              <img src="/images/icons8-create-52-2.png" alt="編輯" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ArtworkPainterAccountProfileSetting;
