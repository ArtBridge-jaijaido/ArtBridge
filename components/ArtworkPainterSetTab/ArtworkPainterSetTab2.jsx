"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import "./ArtworkPainterSetTab2.css";

const ArtworkPainterSetTab2 = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個
  const router = useRouter(); 

  // 按鈕點擊處理函式
  const handleUploadMarketClick = () => {
    router.push("/artworkUploadPortfolio?type=painter"); 
  };

  return (
    <div className="ArtworkPainterSetTab2-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkPainterSetTab2-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkPainterSetTab2-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
        {/* 上傳新作品按鈕 */}
        <button className="ArtworkPainterSetTab2-upload-button" onClick={handleUploadMarketClick}>
          上傳新作品
        </button>
      </div>

      {/* 對應內容 */}
      <div className="ArtworkPainterSetTab2-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "全部作品":
                return (
                  <div key={tab.label} className="ArtworkPainterSetTab2-tab-panel">
                    {tab.content}
                  </div>
                );
                default:
                  return null;
              }
              }
              return null;
            })}
      </div>
    </div>
  );
};


export default ArtworkPainterSetTab2