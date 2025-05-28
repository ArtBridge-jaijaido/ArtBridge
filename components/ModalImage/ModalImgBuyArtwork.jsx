
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import {createOrderFromMarket} from "@/services/artworkOrderService.js";
import {triggerNotificationOnMarketOrder} from "@/services/notificationService";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import "./ModalImgBuyArtwork.css";


const ModalImgBuyArtwork = ({ isOpen, onClose, artwork, artworkImageUrl, artistNickname, artistProfileImg, painterMilestone ,currentUser  }) => {
  if (!isOpen || !artistProfileImg || !artworkImageUrl  ) return null;


  const  [isSaving, setIsSaving] = useState(false); 
  const { addToast } = useToast();
  const [customRequirement, setCustomRequirement] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]; 
  
    if (!file) return;
  
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      addToast("error", "請上傳 JPG 或 PNG 格式的圖片");
      return;
    }
  
    setReferenceFile(file); 
    e.target.value = ""; 
  };


  const handleConfirmPurchase = async () => {
    if (!customRequirement.trim()) {
      addToast("error", "請填寫詳細需求");
      return;
    }
  
    if (!referenceFile) {
      addToast("error", "請上傳一張參考圖片");
      return;
    }
  
    setIsSaving(true);
  
    try {
      const result = await createOrderFromMarket(
        artwork,              // marketData
        painterMilestone,     // painterMilestone
        currentUser,          // currentUser
        referenceFile,        // 使用者上傳的參考圖
        customRequirement     // 使用者填寫的需求說明
      );

      
      if (result.success) {
        await triggerNotificationOnMarketOrder({
          targetUserId: artwork.userUid,
          buyerUid: currentUser.uid,
          marketName: artwork.marketName,
          marketId: artwork.artworkId,
        });
  
        addToast("success", "市集訂單建立成功！");
       
        onClose();
      } else {
        addToast("error", "建立訂單失敗，請稍後再試");
      }
    } catch (error) {
      console.error("建立訂單時發生錯誤:", error);
      addToast("error", "建立訂單時發生錯誤，請稍後再試");
    } finally {
      setIsSaving(false);
      setCustomRequirement(""); // 清空需求說明
      setReferenceFile(null); // 清空參考圖片
    }
  };
  
  
  return (
    <div className="ModalImgBuyArtwork-modal-overlay" onClick={onClose}>
      <div className="ModalImgBuyArtwork-modal" onClick={(e) => e.stopPropagation()}>
        <p className="ModalImgBuyArtwork-warning">
          <span className="ModalImgBuyArtwork-alert-icon">❗ 平台會為您保管款項，確認完成後才會發放給繪師</span>
        </p>

        <div className="ModalImgBuyArtwork-info-row">
          <div className="ModalImgBuyArtwork-info-row-left">
            <img src={artistProfileImg} alt="繪師頭像" className="ModalImgBuyArtwork-profile-img" />
            <p>{artistNickname || "繪師名稱"}</p>
          </div>
          <p>{artwork.marketName || "商品標題（至多8字）"}</p>
        </div>

        <div className="ModalImgBuyArtwork-section">
          <label className="ModalImgBuyArtwork-label">詳細需求：</label>
          <textarea
            className="ModalImgBuyArtwork-textarea"
            value={customRequirement}
            onChange={(e) => setCustomRequirement(e.target.value)}
            placeholder="請輸入需求說明"
          />
        </div>
        <div className="ModalImgBuyArtwork-section">
        <label className="ModalImgBuyArtwork-label">上傳參考圖片（JPG或PNG）：</label>

        {/* 隱藏的 file input */}
        <input
          type="file"
          id="hiddenFileInput"
          style={{ display: "none" }}
          accept="image/jpeg,image/png"
          onChange={handleImageUpload}
        />

        {/* 顯示檔名的欄位 */}
        <input
          type="text"
          className="ModalImgBuyArtwork-filename-display"
          value={referenceFile?.name || ""}
          readOnly
          placeholder="點擊欄位以選擇"
          onClick={() => document.getElementById("hiddenFileInput").click()}
        />
      </div>

        <div className="ModalImgBuyArtwork-detail-row">
          <p>金額：{artwork.price}元</p>
          <p>完稿時間：約 {artwork.completionTime}</p>
        </div>

        <div className="ModalImgBuyArtwork-buttons">
          <button className="ModalImgBuyArtwork-cancel" onClick={onClose}>取消</button>
          <LoadingButton
                        className="ModalImgBuyArtwork-confirm"
                        onClick={handleConfirmPurchase }
                        isLoading={isSaving}
                        loadingText="下訂中..."
                    >
                       確認下訂
                    </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ModalImgBuyArtwork;
