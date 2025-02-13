"use client";
import React, { useState, useEffect } from "react";
import "./artworkPainterAccountSettingTab.css";
import { useSelector,useDispatch} from "react-redux";
import { updateUserData } from "@/services/userService.js"; 
import { updateUser } from "@/app/redux/feature/userSlice.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";

import DatePicker from "@/components/DatePicker/DatePicker.jsx";


const ArtworkPainterAccountSettingTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const { user, isAuthLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBirthday, setSelectedBirthday] = useState("");

  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      nickname: user?.nickname || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }));
  }, [user]); 


  
  // **前端暫存圖片**
  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);

    // **處理圖片選擇，但不馬上上傳**
    const handleImageSelect = (event, isFront) => {
      const file = event.target.files[0];
      if (!file) return;
  
      // 更新前端圖片預覽
      if (isFront) {
        setSelectedFrontImage(URL.createObjectURL(file));
      } else {
        setSelectedBackImage(URL.createObjectURL(file));
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

  const handleImageUpload = async () => {
    if (!user?.uid) return;

    try {
      if (selectedFrontImage) {
        const frontRef = ref(storage, `users/${user.uid}/frontImage`);
        await uploadBytes(frontRef, selectedFrontImage);
      }

      if (selectedBackImage) {
        const backRef = ref(storage, `users/${user.uid}/backImage`);
        await uploadBytes(backRef, selectedBackImage);
      }

      alert("圖片已成功上傳到 Firebase Storage！");
    } catch (error) {
      console.error("上傳失敗:", error);
    }
  };

  const handleFormDataChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }


  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleSave = async () => {
    if (!user?.uid) return; // 確保 user 存在
  
    const updatedData = {
      nickname: formData.nickname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };
  
    try {
     
      const response = await updateUserData(user.uid, updatedData);
  
      if (response.success) {
        alert("✅ 使用者資料更新成功！");
        dispatch(updateUser(updatedData)); 
      } else {
        alert(`❌ 更新失敗: ${response.message}`);
      }
    } catch (error) {
      console.error("❌ 更新使用者資料失敗:", error);
      alert("❌ 發生錯誤，請稍後再試！");
    } 
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
      <div className="artworkPainterAccountSetting-tab-content">
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
                        <DatePicker value={selectedBirthday} onChange={setSelectedBirthday} />
                      </div>
                      <div className="artworkPainterAccountSetting-form-group artworkPainterAccountSetting-id">
                        <label>身分證<span className="artworkPainterAccountSetting-required">*</span>  <span className="artworkPainterAccountSetting-pending">⚠️官方驗證中</span></label>

                        <div className="artworkPainterAccountSetting-id-image-container">
                            {/* 正面 */}
                          <div className="artworkPainterAccountSetting-id-image">
                            {selectedFrontImage ? (
                              <img src={selectedFrontImage} alt="身分證正面" className="uploaded-image" />
                            ) : user?.frontImageUrl ? (
                              <img src={user.frontImageUrl} alt="身分證正面" className="uploaded-image" />
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
                            {selectedBackImage ? (
                              <img src={selectedBackImage} alt="身分證反面" className="uploaded-image" />
                            ) : user?.backImageUrl ? (
                              <img src={user.backImageUrl} alt="身分證反面" className="uploaded-image" />
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
                          <option value="prefer_not_to_say">不透露</option>
                        </select>
                      </div>
                    </div>

                    {/* 儲存按鈕 */}
                    <div className="artworkPainterAccountSetting-save-button-container">
                      <button className="artworkPainterAccountSetting-save-button" onClick={handleSave}>儲存</button>
                    </div>

                  </div>
                );
              case "個人檔案設定":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-profileSetting">

                  </div>
                );
              case "封鎖名單":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-blockList">

                  </div>

                );
              case "官方驗證":
                return (
                  <div key={tab.label} className="artworkPainterAccountSetting-tab-panel artworkPainterAccountSetting-tab-panel-officialVerification">

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
