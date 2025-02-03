"use client";  
import React, {useState, useEffect} from 'react'
import "./ArtworkPainterDetail.css";
import "@fontsource/inter"; 

const ArtworkPainterDetail = ({backgroundImg, ratingText, profileImg, usernameText, introductionText, viewID, isHighQuality}) => {
   
    const [iconSrc, setIconSrc] = useState("images/icons8-exclamation-mark-64-1.png");
    const [attendanceIcon, setAttendanceIcon] = useState("images/no-attendance-icon.png");
    const [loading, setLoading] = useState(true); // 加載狀態
    
    const [isFlipped, setIsFlipped] = useState(false); // 控制翻轉狀態
    const [showFullText, setShowFullText] = useState(false);

    
    //檢舉
    const handleMouseEnter = () => {
    setIconSrc("images/exclamation-icon.png");
    };

    const handleMouseLeave = () => {
    setIconSrc("images/icons8-exclamation-mark-64-1.png");
    };

    //點擊事件 Attendance
    useEffect(() => {
        const savedIcon = localStorage.getItem("attendanceIcon");
        if (savedIcon) {
            setAttendanceIcon(savedIcon); // 如果 localStorage 有保存的圖示，則恢復
        } else {
            setAttendanceIcon("images/no-attendance-icon.png"); // 默認值
        }
        setLoading(false); // 加載完成再顯示按鈕，才不會有閃一下的情況
    }, []);

    const handleAttendanceClick = () => {
        setAttendanceIcon((prevIcon) =>{
            const newIcon =
                prevIcon === "images/no-attendance-icon.png"
                    ? "images/attendance-icon.png"
                    : "images/no-attendance-icon.png";

            localStorage.setItem("attendanceIcon", newIcon); //每次點擊都會把新的狀態保存起來
            return newIcon;
        });
    };

    if (loading) {
        // 加載完成再顯示按鈕，才不會有閃一下的情況
        return null;
    }

    // 查看專屬ID的翻轉狀態
    const handleViewIdClick = () => {
        setIsFlipped(!isFlipped); 
    };

     // 切換到消費者介面或畫師介面
     const handleToggleClick = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("artworkPainterProfile")) {
            navigate('/artworkConsumerProfile');
        } else if (currentPath.includes("artworkConsumerProfile")) {
            navigate('/artworkPainterProfile');
        }
    };
   
    // 查看更多
    const handleToggleText = () => {
        setShowFullText(!showFullText); 
    };
    const truncatedIntroduction = introductionText.length > 35 
    ? `${introductionText.substring(0, 35)}...` 
     : introductionText;

    
    return (
        <div className="ArtworkPainterDetail-profile-container">
            {/*背景*/}
            <div className="ArtworkPainterDetail-header">
            <img src={backgroundImg} className="ArtworkPainterDetail-background-image" />
            {/*個人簡介內容*/}
            <div className="ArtworkPainterDetail-profile-content">
                {/*頂部按鈕*/}
                <div className="ArtworkPainterDetail-header-actions">
                    <button className="ArtworkPainterDetail-exclamation-button"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                    >
                    <img src={iconSrc} className="ArtworkPainterDetail-exclamation-icon" />
                     <span>我要檢舉</span>
                    </button>
                    {/*評價*/}
                    <div className="ArtworkPainterDetail-rating-wrapper">
                        <div className="ArtworkPainterDetail-rating-text"><span>{ratingText}</span></div>
                        <img src="images/rating-icon.png" className="ArtworkPainterDetail-rating-icon" />
                    </div>
                </div>
                {/*使用者頭像、優質畫師Icon*/}
                <div className="ArtworkPainterDetail-profile-info">
                    <img src={profileImg} className="ArtworkPainterDetail-profile-avatar" />
                    {isHighQuality && (
                    <img 
                        src="images/high-quality-icon.png" 
                        className="ArtworkPainterDetail-high-quality-icon" 
                    />
                     )}                   
                </div>
                {/*使用者姓名*/}
                <h1 className="ArtworkPainterDetail-username">{usernameText}</h1>
                <div className="ArtworkPainterDetail-action-buttons">
                    <button className="ArtworkPainterDetail-commission-button">委託繪師</button>
                    {/*是否要attendance*/}
                    <button className="ArtworkPainterDetail-attendance-button"
                        onClick={handleAttendanceClick}
                    >
                       <img src={attendanceIcon}  className="ArtworkPainterDetail-no-attendance-icon"></img>
                    </button>
                </div>
            </div>
            </div>
            {/*簡介*/}
            <div className="ArtworkPainterDetail-introduction-container">
                <div className="ArtworkPainterDetail-introduction-header">
                <h2 className="ArtworkPainterDetail-introduction-title">簡介</h2>
                    {/*查看ID、切換按鈕*/}
                    <div className="ArtworkPainterDetail-actions">
                        <button 
                         className={`ArtworkPainterDetail-view-id ${isFlipped ? 'flipped' : ''}`} onClick={handleViewIdClick} 
                        >
                           <span className={`${isFlipped ? 'flipped-text' : ''}`}>
                                {isFlipped ? viewID : "查看專屬ID"}
                            </span>
                        </button>
                        <button className="ArtworkPainterDetail-toggle-wrapper" onClick={handleToggleClick}> 
                            <span>切換</span>
                            <img src="images/toggle-icon.png " className="ArtworkPainterDetail-toggle-icon" />
                        </button>
                    </div>
                </div>
                    {/*簡介文字描述*/}
                    <p className="ArtworkPainterDetail-introduction-text">
                        {showFullText ? introductionText : truncatedIntroduction}
                        {introductionText.length > 35 && (
                            <button onClick={handleToggleText} className="ArtworkPainterDetail-read-more">
                            {showFullText ? "收起" : "查看更多"}
                        </button>
                        )}
                    </p>
            </div>
        </div>   
    )
}
export default ArtworkPainterDetail
