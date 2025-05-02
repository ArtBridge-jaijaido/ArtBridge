// ModalImgArtShowcase.jsx
"use client";
import React from "react";
import "./ModalImgArtShowcase.css";

const ModalImgArtShowcase = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="ModalImgArtShowcase-overlay" onClick={onClose}>
      <div className="ModalImgArtShowcase-content" onClick={(e) => e.stopPropagation()}>
        <button className="ModalImgArtShowcase-close" onClick={onClose}>
          關閉X
        </button>
        <div className="ModalImgArtShowcase-body">
          {/* 左側圖片區域 */}
          <div className="ModalImgArtShowcase-image-section">
            <div className="ModalImgArtShowcase-image-container">
              <img src={data.src} alt="Artwork" />
              <div className="ModalImgArtShowcase-likeOverlay">
                <img src="/images/icons8-love-96 11.png" alt="likesIcon" />
                <span>{data.likes}</span>
              </div>
            </div>
          </div>

          {/* 右側資訊區塊 */}
          <div className="ModalImgArtShowcase-info-section">
            <div className="ModalImgArtShowcase-header">
              <div className="ModalImgArtShowcase-artistInfo-container">
                <div className="ModalImgArtShowcase-artistAvatar-container">
                  <img src={data.authorAvatar} alt="artistAvatar" />
                </div>
                <div className="ModalImgArtShowcase-artistInfo-text">
                  <span className="ModalImgArtShowcase-artistName">{data.author}</span>
                </div>
              </div>
              <div className="ModalImgArtShowcase-verifyIcon-container">
                <img src="/images/icons8-attendance-100-1.png" alt="verifyIcon" />
              </div>
            </div>

            <div className="ModalImgArtShowcase-info-container">
              <div className="ModalImgArtShowcase-info-row">
                <span className="ModalImgArtShowcase-info-label">類別：</span>
                <span className="ModalImgArtShowcase-info-text">{data.imageCategory}</span>
              </div>
              <div className="ModalImgArtShowcase-info-row">
                <span className="ModalImgArtShowcase-info-label">風格：</span>
                <span className="ModalImgArtShowcase-info-text">{data.imageStyles?.join("、")}</span>
              </div>
              <div className="ModalImgArtShowcase-info-row">
                <span className="ModalImgArtShowcase-info-label">發佈日期：</span>
                <span className="ModalImgArtShowcase-info-text">{data.imageReleaseDate}</span>
              </div>
            </div>

            {/* 新增置中按鈕 */}
            <div className="ModalImgArtShowcase-button-wrapper">
              <button className="ModalImgArtShowcase-commission-button">委託繪師</button>
            </div>

            <div className="ModalImgArtShowcase-report">
              <div className="ModalImgArtShowcase-footer-icons">
                <img src="/images/icons8-exclamation-mark-64-1.png" alt="reportIcon" />
                <span>檢舉</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalImgArtShowcase;
