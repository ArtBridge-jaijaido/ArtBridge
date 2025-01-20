import React, { useState } from "react";
import "./Tab.css";

const Tabs = ({ tabs }) => {
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
        {tabs.map(
          (tab) =>
            activeTab === tab.label && (
              <div key={tab.label} className="tab-panel">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Tabs;
