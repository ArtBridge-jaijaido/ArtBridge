
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";

import "./ModalImgBuyArtwork.css";

const ModalImgBuyArtwork = ({ isOpen, onClose, artwork, artworkImageUrl, artistNickname, artistProfileImg, painterMilestone ,currentUser  }) => {
  if (!isOpen || !artistProfileImg || !artworkImageUrl  ) return null;


  const  [isSaving, setIsSaving] = useState(false); 
  const { addToast } = useToast();
  const [customRequirement, setCustomRequirement] = useState("");
  const [referenceFiles, setReferenceFiles] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
  
    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
  
    const combined = [...referenceFiles, ...validImages];
  
    if (combined.length > 3) {
      addToast("error", "最多只能上傳 3 張參考圖片");
      return;
    }
  
    setReferenceFiles(combined);
  };
  
  

  const handleConfirmPurchase = async () => {


  }
 


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

        {/* <img src={artworkImageUrl} alt="預覽圖" className="ModalImgBuyArtwork-preview-img" /> */}

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
        <label className="ModalImgBuyArtwork-label">上傳參考圖片（點擊欄位以選擇）：</label>

        {/* 隱藏的 file input */}
        <input
          type="file"
          id="hiddenFileInput"
          style={{ display: "none" }}
          accept="image/jpeg,image/png"
          multiple
          onChange={handleImageUpload}
        />

        {/* 顯示檔名的欄位 */}
        <input
          type="text"
          className="ModalImgBuyArtwork-filename-display"
          value={referenceFiles.map((file) => file.name).join("、")}
          readOnly
          placeholder="請選擇參考圖片（最多5張）"
          onClick={() => document.getElementById("hiddenFileInput").click()}
        />
      </div>






        <div className="ModalImgBuyArtwork-detail-row">
          <p>金額：{artwork.price}元</p>
          <p>完稿時間：約 {artwork.completionTime}</p>
        </div>

        <div className="ModalImgBuyArtwork-buttons">
          <button className="ModalImgBuyArtwork-cancel" onClick={onClose}>取消</button>
          <button className="ModalImgBuyArtwork-confirm">確認購買</button>
        </div>
      </div>
    </div>
  );
};

export default ModalImgBuyArtwork;
