"use client";   
import React from "react";
import "./ArtworkEntrustCard.css";

const ArtworkEntrustCard = () => {
  return (
    <div className="artworkEntrustCard-container">
      {[...Array(2)].map((_, index) => (
        <div className="ArtworkEntrustCard-wrapper" key={index}>
          <div className="ArtworkEntrustCard-content">
            <div className="ArtworkEntrustCard-main">
              <div className="ArtworkEntrustCard-details">
                <div className="ArtworkEntrustCard-title">企劃名稱(最多15個字)</div>
                <div className="ArtworkEntrustCard-meta-info">
                  <div className="ArtworkEntrustCard-user-info">
                    <div className="ArtworkEntrustCard-username">使用者名稱</div>
                    <img src="images/user-icon.png" className="ArtworkEntrustCard-user-icon" alt="User profile icon"/>
                  </div>
                  <div className="ArtworkEntrustCard-applicants">
                    <img src="images/applicant-icon.png" className="ArtworkEntrustCard-applicant-icon" alt="Applicants icon"/>
                    <div className="ArtworkEntrustCard-applicant-text">已有5人應徵</div>
                  </div>
                  </div>
                <div className="ArtworkEntrustCard-description">
                  需要一個可以幫我畫角色的繪師，類型像圖片中那樣，偏向可矮Q版的風格，是......
                </div>
                <div className="ArtworkEntrustCard-divider"></div>
                <div className="ArtworkEntrustCard-footer-info">
                  <div className="ArtworkEntrustCard-category">
                    <img src="images/category-icon.png" className="ArtworkEntrustCard-category-icon" alt="Category icon" />
                    <div className="ArtworkEntrustCard-category-text">OC/原創角色</div>
                  </div>
                  <div className="ArtworkEntrustCard-deadline">
                    <img src="images/dealine-icon.png" className="ArtworkEntrustCard-deadline-icon" alt="Calendar icon"/>
                    <div className="ArtworkEntrustCard-deadline-text">截止於:2025年02月03日</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ArtworkEntrustCard-sidebar">
              <div className="ArtworkEntrustCard-sidebar-content">
                <div className="ArtworkEntrustCard-price-tag">
                  <img src="images/price-icon.png"
                    className="ArtworkEntrustCard-price-icon" alt="Currency icon"/>
                  <div className="ArtworkEntrustCard-price-text">2000~5000</div>
                </div>
                <img src="images/artwork-icon.png" className="ArtworkEntrustCard-preview-image" alt="Project preview"/>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtworkEntrustCard;
