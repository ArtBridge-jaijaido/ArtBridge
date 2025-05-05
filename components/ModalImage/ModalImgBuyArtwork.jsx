
"use client";
import React from "react";
import "./ModalImgBuyArtwork.css";

const ModalImgBuyArtwork = ({ isOpen, onClose, artwork, artworkImageUrl, artistNickname, artistProfileImg }) => {
  if (!isOpen || !artistProfileImg || !artworkImageUrl) return null;

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

        <img src={artworkImageUrl} alt="預覽圖" className="ModalImgBuyArtwork-preview-img" />

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
