"use client";
import React, { useState } from "react";
import "./ArtworkCollectionListTab.css";
const ArtworkCollectionListTabs = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="ArtworkCollectionList-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkCollectionList-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkCollectionList-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ArtworkCollectionList-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "按讚作品":
                return (
                  <div key={tab.label} className="ArtworkCollectionList-tab-panel">
                     {tab.content}
                    </div>
                );
              case "貼文珍藏":
                return (
                  <div key={tab.label} className="ArtworkCollectionList-tab-panel">
                    {tab.content}
                  </div>
                );
              case "按讚市集":
                return (
                  <div key={tab.label} className="ArtworkCollectionList-tab-panel">
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

export default ArtworkCollectionListTabs;
