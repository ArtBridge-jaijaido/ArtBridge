"use client";
import React from "react";
import "./PainterMilestoneProgress.css";

const PainterMilestoneProgress = ({ milestones, status = false }) => {

  const getStatusColorClass = (status) => {
    switch (status) {
      case "已付款":
        return "green";
      case "已驗收":
        return "green";
      case "確認":
        return "blue";
      default:
        return "gray";
    }

  }

  return (
    <div className="painterMilestoneProgress-container">
      {milestones.map((milestone, index) => {
        const [percent, label] = milestone.label.split(" ");
        const isLast = index === milestones.length - 1;

        return (
          <div
            className={`painterMilestoneProgress-wrapper ${isLast ? 'last' : ''}`}
            key={milestone.id}
          >
            <div className="painterMilestoneProgress-item">
              <div className="painterMilestoneProgress-percent">{percent}</div>
              <div className="painterMilestoneProgress-circle" />
              <div className="painterMilestoneProgress-label">{label}</div>
              {status && <div className={`painterMilestoneProgress-status ${getStatusColorClass(milestone.status)}`}>
                {milestone.status}
              </div>}
            </div>
            {!isLast && <div className="painterMilestoneProgress-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default PainterMilestoneProgress;
