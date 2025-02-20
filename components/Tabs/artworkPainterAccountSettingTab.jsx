"use client";
import React, { useState, useEffect } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import "./artworkPainterAccountSettingTab.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData, getUserData } from "@/services/userService.js";
import { updateUser } from "@/app/redux/feature/userSlice.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import DatePicker from "@/components/DatePicker/DatePicker.jsx";
import ArtworkPainterAccountProfileSetting from "@/components/ArtworkPainterAccountSettingContent/ArtworkPainterAccountProfileSetting.jsx";
import ArtworkPainterAccountSettingBlockList from "@/components/ArtworkPainterAccountSettingContent/ArtworkPainterAccountSettingBlockList.jsx";
import ArtworkPainterAccountSettingVerify from "@/components/ArtworkPainterAccountSettingContent/ArtworkPainterAccountSettingVerify.jsx";
import { uploadImage } from "@/services/storageService.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";

const ArtworkPainterAccountSettingTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const { user, isAuthLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBirthday, setSelectedBirthday] = useState("");
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // **本地預覽 & Firebase URL**
  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(user?.frontImageUrl || "");
  const [backImageUrl, setBackImageUrl] = useState(user?.backImageUrl || "");

  // **更新表單資料**
  useEffect(() => {

    setFormData((prevData) => ({
      ...prevData,
      nickname: user?.nickname || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }));

    if (user?.birthday) {
      const birthdayDate = new Date(user.birthday); // 轉換成 Date 物件
      const localDate = new Date(birthdayDate.getTime() - birthdayDate.getTimezoneOffset() * 60000);
      setSelectedBirthday(localDate.toISOString().split("T")[0]); // 轉為 YYYY-MM-DD 格式
    } else {
      setSelectedBirthday("");
    }

    if (user?.gender) {
      setSelectedGender(user.gender);
    } else {
      setSelectedGender("");
    }

    if (user?.frontImageUrl) setFrontImageUrl(user.frontImageUrl);
    if (user?.backImageUrl) setBackImageUrl(user.backImageUrl);

  }, [user]);


  // **處理圖片選擇，但不馬上上傳**
  const handleImageSelect = (event, isFront) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (isFront) {
      setSelectedFrontImage({ file, preview: previewUrl });
    } else {
      setSelectedBackImage({ file, preview: previewUrl });
    }
  };



  const { setIsLoading } = useLoading();

  useEffect(() => {
    let timeout;

    if (isAuthLoading) {
      setIsLoading(true);
    } else {
      timeout = setTimeout(() => setIsLoading(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [isAuthLoading, setIsLoading]);


  const handleFormDataChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }


  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
     
      let updatedFrontImageUrl = frontImageUrl;
      let updatedBackImageUrl = backImageUrl;

      if (selectedFrontImage?.file) {
        updatedFrontImageUrl = await uploadImage(
          selectedFrontImage.file,
          `usersIdImage/${user.uid}/IdFrontImage.jpg`
        );
      }

      if (selectedBackImage?.file) {
        updatedBackImageUrl = await uploadImage(
          selectedBackImage.file,
          `usersIdImage/${user.uid}/IdBackImage.jpg`
        );
      }

      const updatedData = {
        nickname: formData.nickname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        frontImageUrl: updatedFrontImageUrl,
        backImageUrl: updatedBackImageUrl,
        gender: selectedGender,
        birthday: selectedBirthday,
      };

      const response = await updateUserData(user.uid, updatedData);

      if (response.success) {
        addToast("success", "使用者資料已更新！");
        dispatch(updateUser(updatedData));

        // 更新 Firebase 圖片 URL，確保前端顯示 Firebase 下載的圖片
        setFrontImageUrl(updatedFrontImageUrl);
        setBackImageUrl(updatedBackImageUrl);

        // 清除選擇的圖片，但保留 Firebase 圖片 URL
        setSelectedFrontImage(null);
        setSelectedBackImage(null);
      } else {
        alert(`❌ 更新失敗: ${response.message}`);
      }
    } catch (error) {
      console.error("更新使用者資料失敗", error);
      addToast("error", "更新使用者資料失敗");
    } finally {
      setIsSaving(false);
    }
  };

  /* 封鎖名單  for testing*/
  const blockedUsers = [
    {
      id: 1,
      avatar: "/images/kv-min-4.png",
      username: "使用者名稱",
      userID: "A123456",
    },
    {
      id: 2,
      avatar: "/images/kv-min-4.png",
      username: "使用者名稱",
      userID: "A123456",
    },{
      id: 3,
      avatar: "/images/kv-min-4.png",
      username: "使用者名稱",
      userID: "A123456",
    },
    {
      id: 4,
      avatar: "/images/kv-min-4.png",
      username: "使用者名稱",
      userID: "A123456",
    },
  ];

  const handleUnblock = (id) => {
    console.log("解除封鎖使用者ID:", id);
  };
  
  const handleReport = (id) => {
    console.log("檢舉使用者ID:", id);
  };


  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="artworkPainterAccountSetting-tabs-container">
      {/* 選項按鈕 */}
      <div className="artworkPainterAccountSetting-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`artworkPainterAccountSetting-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className={`artworkPainterAccountSetting-tab-content ${notoSansTCClass}`}>
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "帳號設定":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-accountSetting">
                    <div className="artworkPainterAccountSetting-form-container">
                      {/* 第一行 */}
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-nickname">
                        <label>暱稱<span className="artworkPainterAccountSetting-required">*</span></label>
                        <input type="text"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleFormDataChange}
                          placeholder={"請輸入暱稱"}
                        />
                      </div>
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-birthday">
                        <label>出生年月日<span className="artworkPainterAccountSetting-required">*</span></label>
                        <DatePicker
                          value={selectedBirthday}
                          onChange={(date) => setSelectedBirthday(date)}
                        />
                      </div>
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-id">
                        <label>身分證<span className="artworkPainterAccountSetting-required">*</span>  <span className="artworkPainterAccountSetting-pending">⚠️官方驗證中</span></label>

                        <div className="artworkPainterAccountSetting-id-image-container">
                          {/* 正面 */}
                          <div className="artworkPainterAccountSetting-id-image">
                            {selectedFrontImage?.preview ? (
                              <img src={selectedFrontImage.preview} alt="身分證正面" />
                            ) : frontImageUrl ? (
                              <img src={frontImageUrl} alt="身分證正面" />
                            ) : (
                              <span>正面</span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageSelect(e, true)}
                              className="upload-input"
                            />
                          </div>


                          {/* 反面 */}
                          <div className="artworkPainterAccountSetting-id-image">
                            {selectedBackImage?.preview ? (
                              <img src={selectedBackImage.preview} alt="身分證反面" />
                            ) : backImageUrl ? (
                              <img src={backImageUrl} alt="身分證反面" />
                            ) : (
                              <span>反面</span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageSelect(e, false)}
                              className="upload-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 第二行 */}
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-email">
                        <label>電子郵件<span className="artworkPainterAccountSetting-required">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder={"請輸入電子郵件"}
                          onChange={handleFormDataChange}
                        />
                      </div>
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-phone">
                        <label>手機號碼<span className="artworkPainterAccountSetting-required">*</span></label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          placeholder={"請輸入手機號碼"}
                          onChange={handleFormDataChange}
                        />
                      </div>

                      {/* 第三行 */}
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-gender">
                        <label>性別<span className="artworkPainterAccountSetting-required">*</span></label>
                        <select value={selectedGender} onChange={handleGenderChange}>
                          <option value="">請選擇</option>
                          <option value="male">男</option>
                          <option value="female">女</option>
                          <option value="preferNotToSay">不透露</option>
                        </select>
                      </div>
                    </div>

                    {/* 儲存按鈕 */}
                    <div className="artworkPainterAccountSetting-save-button-container">
                      <LoadingButton isLoading={isSaving} onClick={handleSave}>
                        儲存
                      </LoadingButton>
                    </div>

                  </div>
                );
              case "個人檔案設定":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-profileSetting">
                   <ArtworkPainterAccountProfileSetting
                      userPainterProfileBackgroundImg={user?.painterProfileBackgroundImg}
                      userProfileAvatar={user?.profileAvatar}
                      userPainterProfileIntroduction={user?.painterIntroduction||"請寫下你的自我介紹"}
                      userExclusiveId={user?.userSerialId?user.userSerialId:"A123456"}
                      userNickname={user?.nickname}
                    />
                  </div>
                );
              case "封鎖名單":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-blockList">
                       <ArtworkPainterAccountSettingBlockList
                          blockedUsers={blockedUsers}
                          onUnblock={handleUnblock}
                          onReport={handleReport}
                        />
                  </div>

                );
              case "官方驗證🚨":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-officialVerification">
                     <ArtworkPainterAccountSettingVerify/>
                  </div>
                );
              default:
                return null;
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ArtworkPainterAccountSettingTabs;
