"use client";
import React, { useState } from "react";
import "./Tab.css";
const Tabs = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個

  return (
    <div className="tabs-container">
      {/* 選項按鈕 */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "內文":
                return (
                  <div key={tab.label} className="tab-panel tab-panel-innerContext">
                    <h1>{tab.content.innerContextTitle}</h1>
                    <div className="tab-panel-innerContext-content">
                    <p>
                        {tab.content.innerContext}
                      </p>
                    </div>
                  </div>
                );
              case "留言板":
                return (
                  <div key={tab.label} className="tab-panel tab-pannel-commentBoard">
                    {tab.content}
                  </div>
                );
              case "圖片資訊":
                return (
                  <div key={tab.label} className="tab-panel tab-panel-imageInfo">
                    <span>圖片出處: {tab.content.imageSource}</span>
                    <span>文章發布日期: {tab.content.imageReleaseDate}</span>
                    <div>
                      風格: 
                      {tab.content.imageStyles.map((style, index) => (
                        <span key={index}>
                          {style}
                          {index !== tab.content.imageStyles.length - 1 && "、"}
                        </span>
                      ))}
                    </div>
                    <span>類別: {tab.content.imageCategory}</span>
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

export default Tabs;
