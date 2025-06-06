"use client";
import React from "react";
import "./OfficialFlowConfig.css";
import PainterMilestoneProgress from "@/components/PainterMilestoneProgress/PainterMilestoneProgress.jsx";


const OfficialFlowConfig = () => {
  const officialMilestones = [
    { label: "0% 支付款項", percent:0, id: 0, status:"等待中"},
    { label: "20% 草稿", percent:20, id: 1, status:"等待中" },
    { label: "30% 線稿", percent:30, id: 2 , status:"等待中"},
    { label: "60% 上色", percent:60, id: 3 , status:"等待中"},
    { label: "100% 完稿", percent:100, id: 4, status:"等待中"}
  ];

  return (
    <div className="officialFlowConfig-wrapper">
        <div className="officialFlowConfig-painterMilestoneProgress-container">
         <PainterMilestoneProgress milestones={officialMilestones} />
        </div>

        <div className="officialFlowConfig-banner">
          <div className="officialFlowConfig-banner-inner">
            <p className="officialFlowConfig-banner-text">
              未自訂委託流程則依照官方流程進行接案
            </p>
          </div>
        </div>
      </div>
 
  );
};

export default OfficialFlowConfig;
