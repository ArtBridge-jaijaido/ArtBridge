"use client";

import React from "react";
import "./OfficialFlowConfig.css";

const OfficialFlowConfig = () => {
  const officialMilestones = [
    { label: "0% 支付款項", id: 0 },
    { label: "20% 草稿", id: 1 },
    { label: "30% 線稿", id: 2 },
    { label: "60% 上色", id: 3 },
    { label: "100% 完稿", id: 4 }
  ];

  return (
    <div className="officialFlowConfig-wrapper">
      <div className="officialFlowConfig-container">
        <div className="officialFlowConfig-list">
          {officialMilestones.map((m, index) => (
            <React.Fragment key={m.id}>
              <div className="officialFlowConfig-item">
                <div className="officialFlowConfig-circle" />
                <div className="officialFlowConfig-percent">{m.label.split(" ")[0]}</div>
                <div className="officialFlowConfig-label">{m.label.split(" ")[1]}</div>
              </div>
              {index !== officialMilestones.length - 1 && (
                <div className="officialFlowConfig-connector-line" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="officialFlowConfig-banner">
          <div className="officialFlowConfig-banner-inner">
            <p className="officialFlowConfig-banner-text">
              未自訂委託流程則依照官方流程進行接案
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialFlowConfig;
