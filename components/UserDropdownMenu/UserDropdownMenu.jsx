"use client";
import React from "react";
import "./UserDropdownMenu.css";
import { useSelector, useDispatch} from "react-redux";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { logoutUser } from "@/app/redux/feature/userSlice.js";
import { auth } from "@/lib/firebase.js";


const UserDropdownMenu = ({toggleDropdown,setIsMenuOpen}) => {

   const { user} = useSelector((state) => state.user);  
   const dispatch = useDispatch();
   const navigate = useNavigation();
   const { setIsLoading } = useLoading();
 

  const handleNavigateTo = (e, page) => {
    e.stopPropagation();
    const targetPath = page.startsWith("/") ? page : `/${page}`;
    navigate(targetPath);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    toggleDropdown();
  };


   const handleLogout = async (e) => {
    e.stopPropagation();
   
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', 
        });

        if (response.ok) {
            await auth.signOut();  // firebase登出
            sessionStorage.clear();  
            console.log("登出成功");
            dispatch(logoutUser()); 
            toggleDropdown();
            setIsMenuOpen(false); 
            setTimeout(() => {
                navigate("/login");
            }, 500);
            
           
        } else {
            console.error("登出失敗");
        }
    } catch (error) {
        console.error("登出錯誤:", error);
    }
 };


  return (
    <div className="UserDropdownMenu-container">
      <div className="UserDropdownMenu-profile">

        <div className="UserDropdownMenu-avatar-container">
        <img src={user?.profileAvatar || "/images/kv-min-4.png"} alt="使用者頭像" className="UserDropdownMenu-avatar"  />
        </div>
        <div className="UserDropdownMenu-info">
          <h3>{user?.nickname}</h3>
          <p> {user?.userSerialId?user.userSerialId:"A123456"}</p>
        </div>
      </div>

       {/* 粉絲 & 追蹤 數據 */}
       <div className="UserDropdownMenu-stats">
        <div className="UserDropdownMenu-stat">
          <strong>9999+</strong>
          <p>粉絲</p>
        </div>
        <div className="UserDropdownMenu-stat">
          <strong>135</strong>
          <p>追蹤</p>
        </div>
      </div>

      <div className="UserDropdownMenu-items">
        <p onClick={(e) => handleNavigateTo(e, "artworkAccountSetting")}>帳戶設定</p>
        <p>我的市集</p>
        <p>案件管理</p>
        <p>我的文章</p>
        <p>粉絲名單</p>
        <p>我的作品</p>
        <p>追蹤名單</p>
        <p>訂閱專區</p>
        <p>收藏名單</p>
        <p>意見回饋</p>
        <p>流量分析 <span className="UserDropdownMenu-badge">NEW即將推出</span></p>
        <p>聯絡我們</p>
        <p>深色模式 <span className="UserDropdownMenu-badge">NEW即將推出</span></p>
      </div>
      <div className="UserDropdownMenu-actions">
        <button className="UserDropdownMenu-btn" onClick={(e) => handleNavigateTo(e, "artworkProfile")}>前往個人頁面</button>
        <button className="UserDropdownMenu-btn" onClick={handleLogout} >登出</button>
      </div>
    </div>
  );
};

export default UserDropdownMenu;
