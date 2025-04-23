"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import "./ArtworkEntrustSetTab.css";

const ArtworkEntrustSetTab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const router = useRouter(); 

  const handleUploadEntrustClick = () => {
    router.push("/artworkUploadEntrust"); // 改為委託上傳頁面
  };

  return (
    <div className="ArtworkEntrustSetTab-tabs-container">
      {/* Tabs */}
      <div className="ArtworkEntrustSetTab-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkEntrustSetTab-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}

        {/* 發布新委託按鈕 */}
        <button className="ArtworkEntrustSetTab-upload-button" onClick={handleUploadEntrustClick}>
          發布新委託
        </button>
      </div>

      {/* 對應內容 */}
      <div className="ArtworkEntrustSetTab-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            return (
              <div key={tab.label} className="ArtworkEntrustSetTab-tab-panel">
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ArtworkEntrustSetTab;
