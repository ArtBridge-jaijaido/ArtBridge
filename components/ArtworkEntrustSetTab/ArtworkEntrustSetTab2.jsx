"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./ArtworkEntrustSetTab2.css";

const ArtworkEntrustSetTab2 = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const router = useRouter();

  const handleUploadMarketClick = () => {
    router.push("/artworkUploadPortfolio");
  };

  return (
    <div className="ArtworkEntrustSetTab2-tabs-container">
      <div className="ArtworkEntrustSetTab2-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ArtworkEntrustSetTab2-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
        <button className="ArtworkEntrustSetTab2-upload-button" onClick={handleUploadMarketClick}>
          上傳新作品
        </button>
      </div>

      <div className="ArtworkEntrustSetTab2-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "全部作品":
                return (
                  <div key={tab.label} className="ArtworkEntrustSetTab2-tab-panel">
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

export default ArtworkEntrustSetTab2;
