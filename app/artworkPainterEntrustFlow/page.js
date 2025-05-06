'use client'

import React, { useState } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import OfficialFlowConfig from "@/components/ArtworkPainterEntrustFlow/OfficialFlowConfig.jsx";
import CustomFlowConfig from "@/components/ArtworkPainterEntrustFlow/CustomFlowConfig.jsx";
import './artworkPainterEntrustFlow.css';

const ArtworkPainterEntrustFlowPage = () => {
  const [activeTab, setActiveTab] = useState("official");

  const tabs = [
    {
      label: "官方流程",
      key: "official",
      content: <OfficialFlowConfig />
    },
    {
      label: "自訂流程",
      key: "custom",
      content: <CustomFlowConfig />
    }
  ];

  return (
    <div className={`artworkPainterEntrustFlow-page ${notoSansTCClass}`}>
      <div className="artworkPainterEntrustFlow-tab-container">
        <div className="artworkPainterEntrustFlow-tab-header">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`artworkPainterEntrustFlow-tab-button ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="artworkPainterEntrustFlow-tab-content">
          {tabs.find(tab => tab.key === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default ArtworkPainterEntrustFlowPage;
