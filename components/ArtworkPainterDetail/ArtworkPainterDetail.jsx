"use client";   
import React from 'react'
import "./ArtworkPainterDetail.css";

const ArtworkPainterDetail = ({backgroundImg, ratingText, profileImg, usernameText, introductionText}) => {
    return (
        <div className="ArtworkPainterDetail-profile-container">
            {/*背景*/}
            <div className="ArtworkPainterDetail-header">
            <img src={backgroundImg} className="ArtworkPainterDetail-background-image" />
            <div className="ArtworkPainterDetail-profile-content">
                <div className="ArtworkPainterDetail-header-actions">
                    <button className="ArtworkPainterDetail-exclamation-button">
                        <img src="images/icons8-exclamation-mark-64-1.png" className="ArtworkPainterDetail-exclamation-icon" />
                        <span>我要檢舉</span>
                    </button>
                    <div className="ArtworkPainterDetail-rating-wrapper">
                    <span>{ratingText}</span>
                    <img src="images/rating-icon.png" className="ArtworkPainterDetail-rating-icon" />
                    </div>
                </div>
                <div className="ArtworkPainterDetail-profile-info">
                    <img src={profileImg} className="ArtworkPainterDetail-profile-avatar" />
                    <div className="ArtworkPainterDetail-price-list">價目表</div>
                 </div>
                <h1 className="ArtworkPainterDetail-username">{usernameText}</h1>
                <div className="ArtworkPainterDetail-action-buttons">
                    <button className="ArtworkPainterDetail-commission-button">委託繪師</button>
                    <button className="ArtworkPainterDetail-attendance-button">
                    <img src="images/attendance-icon.png" alt="" className="ArtworkPainterDetail-attendance-icon" />
                    </button>
                </div>
            </div>
            </div>
            <div className="ArtworkPainterDetail-introduction-header">
            <h2 className="ArtworkPainterDetail-introduction-title">簡介</h2>
                <div className="ArtworkPainterDetail-header-actions">
                    <button className="ArtworkPainterDetail-view-id">查看專屬ID</button>
                    <button className="ArtworkPainterDetail-toggle-wrapper">
                        <span>切換</span>
                        <img src="images/toggle-icon.png " className="ArtworkPainterDetail-toggle-icon" />
                    </button>
             </div>
            </div>
            <p className="ArtworkPainterDetail-introduction-text">{introductionText}</p>
        </div>   
    )
}
export default ArtworkPainterDetail