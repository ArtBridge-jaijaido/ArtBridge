"use client";
import React, { useState } from "react";
import "./ArtworkPainterArticleTab.css";
import { useNavigation } from "@/lib/functions.js";


const ArtworkPainterArticleTab = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個
  const navigate = useNavigation();
 

  const handleUploadMarketClick = () => {
    navigate("/artworkUploadArticle"); 
  }

  return (
    <div className="ArtworkPainterArticleTab-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkPainterArticleTab-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkPainterArticleTab-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
        {/* 上傳新作品按鈕 */}
        <button className="ArtworkPainterArticleTab-upload-button" onClick={handleUploadMarketClick}>
          上傳新文章
        </button>
      </div>

      {/* 對應內容 */}
      <div className="ArtworkPainterArticleTab-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "全部文章":
                return (
                  <div key={tab.label} className="ArtworkPainterArticleTab-tab-panel">
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


export default ArtworkPainterArticleTab