"use client";
import React, { useState, useEffect } from 'react';
import { notoSansTCClass } from "@/app/layout.js";
import { useSelector , useDispatch} from 'react-redux';
import { useLoading } from "@/app/contexts/LoadingContext.js";
import {updateUserRole} from '@/services/userService.js';
import { updateUser } from "@/app/redux/feature/userSlice.js";
import "./consumerDashboard.css"; 
import { useNavigation } from "@/lib/functions.js";

const ConsumerDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthLoading } = useSelector((state) => state.user); // user=登入者資訊
  const { setIsLoading } = useLoading();
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigation();

  const handleUserExclusiveIdClick = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    let timeout;

    if (isAuthLoading) {
      setIsLoading(true);
    } else {
      timeout = setTimeout(() => setIsLoading(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [isAuthLoading, setIsLoading]);

  const handleNavigateTo = (e, page) => {
    e.stopPropagation();
    const targetPath = page.startsWith("/") ? page : `/${page}`;
    navigate(targetPath);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRoleSwitch = async () => {
    const newRole = user?.role === "client" ? "artist" : "client";
    const response = await updateUserRole(user.uid, newRole);

    if (response.success) {
      dispatch(updateUser({ role: newRole })); 

      const targetPath = newRole === "client" ? "/artworkDashboard/artworkConsumerDashboard" : "/artworkDashboard/painterDashboard";
      navigate(targetPath);
    }else{
      console.error("Failed to update user role:", response.message);
    }
  }

  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className={`ConsumerDashboardPage ${notoSansTCClass}`}>
      <div className="ConsumerDashboard-container">
        {/* 左側個人資訊區塊 */}
        <div className="ConsumerDashboard-leftPart-container">
          <div className="ConsumerDashboard-userInfo-container">
            <div className="ConsumerDashboard-userInfo-avatar">
              <img src={user?.profileAvatar || "/images/kv-min-4.png"} alt="avatar" />
            </div>

            <div className="ConsumerDashboard-userInfo">
              <h1>{user?.nickname || "使用者名稱"} <span>-委託方</span></h1>
              <div className="ConsumerDashboard-userInfo-button-container">
                <button className="ConsumerDashboard-userInfo-button-change"
                  onClick={handleRoleSwitch}
                >
                  切換
                  <img src="/images/icons8-change-48-1.png" alt="change-role-icon" />
                </button>
                <button
                  className={`ConsumerDashboard-userInfo-button-id ${isFlipped ? "flipped" : ""}`}
                  onClick={handleUserExclusiveIdClick}
                >
                  <span>
                    {isFlipped ? user?.userSerialId : "查看專屬ID"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="ConsumerDashboard-advertisement-container" />
        </div>

        {/* 右側選單 & 功能區 */}
        <div className="ConsumerDashboard-rightPart-container">
          <div className="ConsumerDashboard-options-container">
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-settings-96-2.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span onClick={(e) => handleNavigateTo(e, "artworkAccountSetting")}>帳戶設定</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-computer-100-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span onClick={(e) => handleNavigateTo(e, "artworkOrdersManagement")}>案件管理</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <div className="ConsumerDashboard-icon-wrapper">
                <img src="/images/artworkDashboardIcon/icons8-bell-96-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
                {unreadCount > 0 && (
                    <span className="ConsumerDashboard-badge">{unreadCount}</span>
                )}
              </div>
              <span onClick={(e) => handleNavigateTo(e, "artworkNotification")}>我的通知</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-impression-64-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span>粉絲名單</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-post-64-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span onClick={(e) => handleNavigateTo(e, "artworkEntrustMarket")}>委託專區</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-edit-text-file-100-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span onClick={(e) => handleNavigateTo(e, "artworkPainterArticle")}>我的文章</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-artwork-100-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span>合作作品</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-bookmark-96-2.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span onClick={(e) => handleNavigateTo(e, "artworkCollectionList")}>收藏名單</span>
            </div>
            <div className="ConsumerDashboard-option-item">
              <img src="/images/artworkDashboardIcon/icons8-follow-96-1.png" alt="icon" className="artworkConsumerDashboardIcon" />
              <span>追蹤名單</span>
            </div>
          </div>

          <div className="ConsumerDashboard-commission-process-container">
            <div className="ConsumerDashboard-commission-process-left">
              <h1>我要發布委託案件</h1>
              <p>您可以發布委託案件，有想要接搞得繪師會應徵您的案件，祝您找到合適的繪師</p>
              <button className="ConsumerDashboard-commission-process-button" onClick={(e) => handleNavigateTo(e, "artworkUploadEntrust")}>
                前往發佈委託案件 <img src="/images/icons8-go-96-1.png" alt="commission-process-icon" className="ConsumerDashboard-commission-process-icon" />
              </button>
            </div>
            <div className="ConsumerDashboard-commission-process-right">
              <img src="/images/gummy-blackboard-1.png" alt="ConsumerDashboard-commission-process-icon" />
            </div>
          </div>
        </div>

        {/* 834px 以下才會顯示的廣告區塊 */}
        <div className="ConsumerDashboard-advertisement-mobile" />
      </div>
    </div>
  );
};

export default ConsumerDashboard;
