"use client";   
import React, {useState, useEffect} from 'react'
import "./ArtworkReview.css";

const ArtworkReview = ({profileImg, userName, reviewTime, planName, reviewText, collaborationCount, rating, tags, isPrivate}) => {
    const [iconSrc, setIconSrc] = useState("/images/icons8-exclamation-mark-64-1.png");

    //檢舉按鈕變化
    const handleMouseEnter = () => {
        setIconSrc("/images/exclamation-icon.png");
    };
    
    const handleMouseLeave = () => {
        setIconSrc("/images/icons8-exclamation-mark-64-1.png");
    };

   // 如果是保密企劃，顯示保密資訊
   const displayPlanName = isPrivate ? "此專案為保密計畫" : (planName.length > 15 ? planName.substring(0, 15) + "..." : planName);
   const displayUserName = isPrivate ? "保密企劃" : userName;
   
    // 根據評分生成星星圖標
    const renderRatingIcons = () => {
        return Array.from({ length: 5 }).map((_, index) => (
            <img 
                key={index} 
                src={index < rating ? "/images/one-rating.png" : "/images/zero-rating.png"} 
                className="ArtworkReview-star-icon" 
                alt={`Rating star ${index + 1}`} 
            />
        ));
    };

    // 標籤對應關係
    const tagMapping = {
        1: "速度快",
        2: "品質優秀",
        3: "CP值高",
        4: "信用良好",
        5: "溝通順暢"
    };

    // 根據傳入的 tags 顯示標籤
    const renderTags = () => {
        return tags.map(tagId => (
            <div key={tagId} className="ArtworkReview-tag">{tagMapping[tagId]}</div>
        ));
    };    

    return (
        <div className="ArtworkReview-review-wrapper">
        <div className="ArtworkReview-review-container">
            <div className="ArtworkReview-review-header">
            <div className="ArtworkReview-review-content">
                <div className="ArtworkReview-user-section">
                <div className="ArtworkReview-profile-section">
                    <div className="ArtworkReview-profile-container">
                    <div className="ArtworkReview-user-header">
                        <img src={profileImg} className="ArtworkReview-profile-avatar" />
                        <div className="ArtworkReview-user-details">
                        <div className="ArtworkReview-username">{displayUserName}</div>
                        <div className="ArtworkReview-review-date">{reviewTime}</div>
                        </div>
                    </div>
                    {/*評論星星數*/}
                    <div className="ArtworkReview-rating-icons">
                        {renderRatingIcons()}
                    </div>
                    </div>
                </div>
                <div className="ArtworkReview-project-section">
                    <div className="ArtworkReview-project-container">
                    <div className="ArtworkReview-project-title">
                        【企劃】
                        <span className="ArtworkReview-plan-text">{displayPlanName}</span>
                    </div>
                    {/*評論標籤*/}
                    <div className="ArtworkReview-tag-container">
                        {renderTags()}  
                    </div>
                    </div>
                </div>
                {/*合作次數*/}
                {collaborationCount >= 2 && (
                    <div className="ArtworkReview-collaboration-section">
                        <div className="ArtworkReview-collaboration-badge">
                            <img src="/images/collaboration-icon.png" className="ArtworkReview-badge-icon"/>
                            <div>已合作{collaborationCount}次</div>
                        </div>
                    </div>
                )}
                </div>
            {/*檢舉按鈕*/}    
            </div>
                <button className="ArtworkReview-exclamation-button"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                >
                <img src={iconSrc} className="ArtworkReview-exclamation-icon" />
                </button>
            </div>
            <div className="ArtworkReview-review-text">
                {reviewText}
            </div>
        </div>
        </div>
    )
}

export default ArtworkReview