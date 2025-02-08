"use client";
import React, { useState } from "react";
import "./ArtworkPainterProfile-tab.css";
const ArtworkPainterProfileTab = ({ tabs}) => {
const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="ArtworkPainterProfile-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkPainterProfile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkPainterProfile-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ArtworkPainterProfile-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "作品集":
                return (
                  <div key={tab.label} className="ArtworkPainterProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "查看評價":
                return (
                  <div key={tab.label} className="ArtworkPainterProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "市集":
                return (
                  <div key={tab.label} className="ArtworkPainterProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "曾發布文章":
                return (
                  <div key={tab.label} className="ArtworkPainterProfile-tab-panel">
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


export default ArtworkPainterProfileTab