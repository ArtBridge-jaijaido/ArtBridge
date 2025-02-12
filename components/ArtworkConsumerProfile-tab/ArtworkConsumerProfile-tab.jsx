"use client";
import React, { useState } from "react";
import "./ArtworkConsumerProfile-tab.css";
const ArtworkConsumerProfileTab = ({ tabs}) => {
const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="ArtworkConsumerProfile-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkConsumerProfile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkConsumerProfile-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ArtworkConsumerProfile-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "委託":
                return (
                  <div key={tab.label} className="ArtworkConsumerProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "查看評價":
                return (
                  <div key={tab.label} className="ArtworkConsumerProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "曾發布文章":
                return (
                  <div key={tab.label} className="ArtworkConsumerProfile-tab-panel">
                    {tab.content}
                  </div>
                );

              case "合作案例":
                return (
                  <div key={tab.label} className="ArtworkConsumerProfile-tab-panel">
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


export default ArtworkConsumerProfileTab