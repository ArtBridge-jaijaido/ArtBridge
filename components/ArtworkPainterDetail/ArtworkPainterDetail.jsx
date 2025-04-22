"use client";  
import React, {useState, useEffect} from 'react'
import "./ArtworkPainterDetail.css";
import "@fontsource/inter"; 
import { useRouter, usePathname } from 'next/navigation';
import {updateUserRole} from '@/services/userService.js';
import { useSelector, useDispatch} from "react-redux";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useToast } from "@/app/contexts/ToastContext.js";

const ArtworkPainterDetail = ({backgroundImg, ratingText, profileImg, usernameText, introductionText, viewID, isHighQuality, browsingPainterId}) => {
    const router = useRouter(); 
    const {user} = useSelector((state) => state.user);  // 登入者資訊
    const dispatch = useDispatch();
    const pathname = usePathname(); // 取得當前路徑
    // 判斷是否為消費者頁面
    const isConsumerProfile = pathname.includes("artworkConsumerProfile"); 
    //localStorage Key，個別記住attendance icon的狀態
    const attendanceKey = isConsumerProfile ? "consumerAttendanceIcon" : "painterAttendanceIcon";
    const { addToast } = useToast();
    const [iconSrc, setIconSrc] = useState("/images/icons8-exclamation-mark-64-1.png");
    const [attendanceIcon, setAttendanceIcon] = useState("/images/no-attendance-icon.png");
    const [loading, setLoading] = useState(true); // 加載狀態
    
    const [isFlipped, setIsFlipped] = useState(false); // 控制翻轉狀態
    const [showFullText, setShowFullText] = useState(false);

    //檢舉按鈕變化
    const handleMouseEnter = () => {
    setIconSrc("/images/exclamation-icon.png");
    };

    const handleMouseLeave = () => {
    setIconSrc("/images/icons8-exclamation-mark-64-1.png");
    };

    //點擊事件 Attendance
    useEffect(() => {
        const savedIcon = localStorage.getItem(attendanceKey);  // 檢查 localStorage 中是否有已保存的圖示
        if (savedIcon) {
            setAttendanceIcon(savedIcon);
        } else {
            setAttendanceIcon("/images/no-attendance-icon.png"); // 默認值
        }
        setLoading(false); // 加載完成再顯示按鈕，避免閃爍
    }, [attendanceKey]);


    const handleAttendanceClick = () => {
        setAttendanceIcon((prevIcon) =>{
            const newIcon =
                prevIcon === "/images/no-attendance-icon.png"
                    ? "/images/attendance-icon.png"
                    : "/images/no-attendance-icon.png";

            localStorage.setItem(attendanceKey, newIcon); // 保存至對應頁面的 localStorage
            return newIcon;
        });
    };

    // 查看專屬ID的翻轉狀態
    const handleViewIdClick = () => {
        setIsFlipped(!isFlipped); 
    };

     // 切換到消費者介面或畫師介面
    const handleToggleClick = async () => {
     
        if(user){
            const newRole = user.role === "artist" ? "client" : "artist";
            console.log("切換角色到", newRole );
            const response = await updateUserRole(user.uid, newRole);
            if (response.success) {
              
                const newPath = newRole === "artist" 
                    ? `/artworkProfile/artworkPainterProfile/${browsingPainterId}`
                    : `/artworkProfile/artworkConsumerProfile/${browsingPainterId}`;
                router.push(newPath);
              
            } else {
                console.error(response.message);
            }
        }else{
            const currentPath = window.location.pathname; 
            const isPainterProfile = currentPath.includes(`/artworkProfile/artworkPainterProfile/${browsingPainterId}`);
            const newPath = isPainterProfile
                ? `/artworkProfile/artworkConsumerProfile/${browsingPainterId}`
                : `/artworkProfile/artworkPainterProfile/${browsingPainterId}`;
            
            router.push(newPath);
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
            <img src={backgroundImg} 
                 className="ArtworkPainterDetail-background-image" 
                    
            />
            {/*個人簡介內容*/}
            <div className="ArtworkPainterDetail-profile-content">
                {/*頂部按鈕*/}
                <div className="ArtworkPainterDetail-header-actions">
                    <button className="ArtworkPainterDetail-exclamation-button"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                    >
                    <img src={iconSrc} className="ArtworkPainterDetail-exclamation-icon" />
                     <span>我要檢舉/封鎖</span>
                    </button>
                    {/*評價*/}
                    <div className="ArtworkPainterDetail-rating-wrapper">
                        <div className="ArtworkPainterDetail-rating-text"><span>{ratingText}</span></div>
                        <img src="/images/rating-icon.png" className="ArtworkPainterDetail-rating-icon" />
                    </div>
                </div>
                {/*使用者頭像、優質畫師Icon*/}
                <div className="ArtworkPainterDetail-profile-info">
                    <img src={profileImg} className="ArtworkPainterDetail-profile-avatar" />
                    {isHighQuality && (
                    <img 
                        src="/images/high-quality-icon.png" 
                        className="ArtworkPainterDetail-high-quality-icon" 
                    />
                     )}                   
                </div>
                {/*使用者姓名*/}
                {/* 使用者名稱與出席按鈕 */}
                <div className={`ArtworkPainterDetail-username-wrapper ${isConsumerProfile ? 'consumer-layout' : ''}`}>
                    <h1 className="ArtworkPainterDetail-username">{usernameText}</h1>
                    {isConsumerProfile && ( // 只在消費者介面顯示在右側
                        <button className="ArtworkPainterDetail-attendance-button" onClick={handleAttendanceClick}>
                            <img src={attendanceIcon} className="ArtworkPainterDetail-no-attendance-icon" />
                        </button>
                    )}
                </div>

                {/* 當非消費者介面時顯示委託按鈕與出席按鈕 */}
                {!isConsumerProfile && (
                    <div className="ArtworkPainterDetail-action-buttons">
                        <button className="ArtworkPainterDetail-commission-button">委託繪師</button>
                        <button className="ArtworkPainterDetail-attendance-button" onClick={handleAttendanceClick}>
                            <img src={attendanceIcon} className="ArtworkPainterDetail-no-attendance-icon" />
                        </button>
                    </div>
                )}
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
                            <img src="/images/toggle-icon.png " className="ArtworkPainterDetail-toggle-icon" />
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
