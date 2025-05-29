"use client";
import React from "react";
import "./ModalImgMarketOrderPreview.css";

const ModalImgMarketOrderPreview = ({ isOpen, onClose, referenceImageUrl, customRequirement }) => {
  if (!isOpen) return null;

  return (
    <div className="ModalImgMarketOrderPreview-overlay"  onClick={(e) => {
      e.stopPropagation();
      onClose();
    }} >
      <div className="ModalImgMarketOrderPreview-content" onClick={(e) => e.stopPropagation()}>
        <button className="ModalImgMarketOrderPreview-close" onClick={onClose}>✕</button>
        <p className="ModalImgMarketOrderPreview-text">{customRequirement}</p>
        <img src={referenceImageUrl} alt="參考圖片" className="ModalImgMarketOrderPreview-img" />
      </div>
    </div>
  );
};

export default ModalImgMarketOrderPreview;