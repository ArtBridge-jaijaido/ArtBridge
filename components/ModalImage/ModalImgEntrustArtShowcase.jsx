// ModalImgEntrustArtShowcase.jsx
"use client";
import React from "react";
import "./ModalImgEntrustArtShowcase.css";

const ModalImgEntrustArtShowcase = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="ModalImgEntrustArtShowcase-overlay" onClick={onClose}>
      <div className="ModalImgEntrustArtShowcase-content" onClick={(e) => e.stopPropagation()}>
        <button className="ModalImgEntrustArtShowcase-close" onClick={onClose}>
          關閉X
        </button>
        <div className="ModalImgEntrustArtShowcase-body">
          <div className="ModalImgEntrustArtShowcase-image-section">
            <div className="ModalImgEntrustArtShowcase-image-container">
              <img src={data.src} alt="Artwork" />
            </div>
          </div>

          <div className="ModalImgEntrustArtShowcase-info-section">
            <div className="ModalImgEntrustArtShowcase-header">
              <div className="ModalImgEntrustArtShowcase-artistInfo-container">
                <div className="ModalImgEntrustArtShowcase-artistAvatar-container">
                  <img src={data.authorAvatar} alt="artistAvatar" />
                </div>
                <div className="ModalImgEntrustArtShowcase-artistInfo-text">
                  <span className="ModalImgEntrustArtShowcase-artistName">{data.author}</span>
                </div>
              </div>
              <div className="ModalImgEntrustArtShowcase-icon-group">
                <div className="ModalImgEntrustArtShowcase-collection-container">
                  <span>{data.likes}</span>
                  <img src="/images/icons8-star-96-2.png" alt="starIcon" />
                </div>
                <div className="ModalImgEntrustArtShowcase-verifyIcon-container">
                  <img src="/images/icons8-attendance-100-1.png" alt="verifyIcon" />
                </div>
              </div>
            </div>

            <div className="ModalImgEntrustArtShowcase-info-container">
              <div className="ModalImgEntrustArtShowcase-info-row">
                <span className="ModalImgEntrustArtShowcase-info-label">類別：</span>
                <span className="ModalImgEntrustArtShowcase-info-text">{data.imageCategory}</span>
              </div>
              <div className="ModalImgEntrustArtShowcase-info-row">
                <span className="ModalImgEntrustArtShowcase-info-label">風格：</span>
                <span className="ModalImgEntrustArtShowcase-info-text">{data.imageStyles?.join("、")}</span>
              </div>
              <div className="ModalImgEntrustArtShowcase-info-row">
                <span className="ModalImgEntrustArtShowcase-info-label">發佈日期：</span>
                <span className="ModalImgEntrustArtShowcase-info-text">{data.imageReleaseDate}</span>
              </div>
              <div className="ModalImgEntrustArtShowcase-info-row">
                <span className="ModalImgEntrustArtShowcase-info-label">繪師名稱：</span>
                <span className="ModalImgEntrustArtShowcase-info-text">{data.assignedArtist || "未指定"}</span>
              </div>
            </div>

            <div className="ModalImgEntrustArtShowcase-report">
              <div className="ModalImgEntrustArtShowcase-footer-icons">
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

export default ModalImgEntrustArtShowcase;
