"use client";   
import React from 'react'
import "./ArtworkPainterDetail.css";

const ArtworkPainterDetail = () => {
    return (
        <div className="ArtworkPainterDetail">
        <div className="profile-container">
            <div className="banner-wrapper">
            <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/36711125ed9b0e2858aede98ab957c1fbf7f7e0a77903a929ec9381a23d8b501?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="" className="banner-image" />
            <div className="profile-content">
                <div className="header-actions">
                    <button className="report-button">
                        <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/506174e9d366de0b6c320a7a6abf0799bf9a64fcfa1d64d11f34e1e53d56779c?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="Report icon" className="report-icon" />
                        <span>我要檢舉</span>
                    </button>
                    <div className="rating-wrapper">
                    <span>5</span>
                    <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/4f7e9b2df8524614d90214dfc4b3d95a5aaf79f5be25794b073a7f4df9868631?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="Rating star" className="rating-icon" />
                    </div>
                </div>
                <div className="profile-info">
                    <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/b7d9b6bc-d32d-4caa-8bb1-05ff2545c206?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="User profile" className="profile-avatar" />
                    <div className="price-list">價目表</div>
                 </div>
                <h1 className="username">使用者名稱</h1>
                <div className="action-buttons">
                    <button className="commission-button">委託繪師</button>
                    <button className="favorite-button" aria-label="Add to favorites">
                    <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/ed308bb6def3b892d1f9111aa6f0cb28b05564861a71c7d78425f38a0f1e28f1?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="" className="favorite-icon" />
                    </button>
                </div>
            </div>
        </div>
        <div className="bio-header">
            <h2 className="bio-title">簡介</h2>
            <div className="header-actions">
                <button className="view-id">查看專屬ID</button>
                <button className="toggle-wrapper">
                    <span>切換</span>
                     <img src="https://cdn.builder.io/api/v1/image/assets/237f7a64854c403894ee9d90faa1639a/db48338827505b524fcc170f29ef353a56fb045feca5a9986f91938bd24df6ae?apiKey=237f7a64854c403894ee9d90faa1639a&" alt="" className="toggle-icon" />
                </button>
            </div>
         </div>
        <p className="bio-text">我是一名經驗豐富的插畫家，擅長日系畫風，專注於VUP虛擬主播立繪和建模（包括Live2D製作）。曾參與《食之契約》《崩壞2》《原神》《蒼藍誓約》《命運神界》......
        </p>
        </div> 
        </div>      
    )
}
export default ArtworkPainterDetail