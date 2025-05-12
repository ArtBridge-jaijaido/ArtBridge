"use client";
import React, { useState } from "react";
import "./ArtworkOrderManagementTab.css";
const ArtworkOrderManagementTabs = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="ArtworkOrderManagement-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkOrderManagement-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkOrderManagement-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ArtworkOrderManagement-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "目前案件":
                return (
                  <div key={tab.label} className="ArtworkOrderManagement-tab-panel">
                     {tab.content}
                    </div>
                );
              case "歷史案件":
                return (
                  <div key={tab.label} className="ArtworkOrderManagement-tab-panel">
                    {tab.content}
                  </div>
                );
              case "行事曆":
                return (
                  <div key={tab.label} className="ArtworkOrderManagement-tab-panel">
                    {tab.content}
                  </div>
                );
                case "查看詳細資料":
                    return (
                      <div key={tab.label} className="ArtworkOrderManagement-tab-panel">
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

export default ArtworkOrderManagementTabs;
