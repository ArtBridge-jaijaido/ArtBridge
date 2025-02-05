"use client";
import React from 'react'
import { notoSansTCClass } from "@/app/layout.js";

import "../painterDashboard.css";

const PainterDashboard = () => {
  return (
   
    

      <div className={`PainterDashboardPage ${notoSansTCClass}`}>
        <div className="PainterDashboard-container">
          {/* 左側個人資訊區塊 */}
          <div className="PainterDashboard-leftPart-container">
            <div className="PainterDashboard-painterInfo-container">

              <div className="PainterDashboard-painterInfo-avatar">
                <img src="/images/kv-min-4.png" alt="avatar" className="PainterDashboard-painterInfo-avatar-img" />
              </div>

              <div className="PainterDashboard-painterInfo">
                <h1>使用者名稱 <span>-繪師</span></h1>
                <div className="PainterDashboard-painterInfo-button-container">
                  <button className="PainterDashboard-painterInfo-button-change">
                    切換
                    <img src="/images/icons8-change-48-1.png" alt="change-role-icon" />
                  </button>
                  <button className="PainterDashboard-painterInfo-button-id">
                    我的專屬ID
                  </button>
                </div>
              </div>
            </div>
            <div className="PainterDashboard-advertisement-container">

            </div>

          </div>
          {/* 右側選單 & 功能區 */}
          <div className="PainterDashboard-rightPart-container">
            <div className="PainterDashboard-options-container">

              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-settings-96-2.png" alt="icon" className="artworkDashboardIcon" />
                <span>帳戶設定</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-computer-100-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>案件管理</span>

              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-bell-96-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>我的通知</span>

              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-impression-64-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>粉絲名單</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-market-96-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>我的市集</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-edit-text-file-100-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>我的文章</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-artwork-100-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>我的作品</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-bookmark-96-2.png" alt="icon" className="artworkDashboardIcon" />
                <span>收藏名單</span>
              </div>
              <div className="PainterDashboard-option-item">
                <img src="/images/artworkDashboardIcon/icons8-follow-96-1.png" alt="icon" className="artworkDashboardIcon" />
                <span>追蹤名單</span>
              </div>

            </div>
            <div className="PainterDashboard-commission-process-container">
              <div className="PainterDashboard-commission-process-left">
                <h1>自訂我的委託流程</h1>
                <p>您可以自行安排接委託的流程，包含單一案件截稿時間、進程，也可以設定固定的流程。</p>
                <button className="PainterDashboard-commission-process-button">
                  前往自訂委託設定  <img src="/images/icons8-go-96-1.png" alt="commission-process-icon" className="commission-process-icon" />
                </button>
              </div>
              <div className="PainterDashboard-commission-process-right">
                <img src="/images/gummy-macbook-1.png" alt="commission-process-icon" />
              </div>


            </div>


          </div>

           {/* 834px 以下才會顯示的廣告區塊 */}
            <div className="PainterDashboard-advertisement-mobile">
               
            </div>
        </div>
      </div>
  
  )
}

export default PainterDashboard;
