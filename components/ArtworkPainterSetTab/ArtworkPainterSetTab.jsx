"use client";
import React, { useState } from "react";
import "./ArtworkPainterSetTab.css";
const ArtworkPainterSetTab = ({ tabs}) => {
const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="ArtworkPainterSetTab-tabs-container">
      {/* 選項按鈕 */}
      <div className="ArtworkPainterSetTab-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkPainterSetTab-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ArtworkPainterSetTab-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "上架中":
                return (
                  <div key={tab.label} className="ArtworkPainterSetTab-tab-panel">
                    {tab.content}
                  </div>
                );

              case "歷史市集":
                return (
                  <div key={tab.label} className="ArtworkPainterSetTab-tab-panel">
                    {tab.content}
                  </div>
                );

              case "上傳市集":
                return (
                  <div key={tab.label} className="ArtworkPainterSetTab-tab-pane2">
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


export default ArtworkPainterSetTab