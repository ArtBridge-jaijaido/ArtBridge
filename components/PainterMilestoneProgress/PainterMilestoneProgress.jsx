"use client";
import React from "react";
import "./PainterMilestoneProgress.css";

const PainterMilestoneProgress = ({ milestones }) => {
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
            </div>
            {!isLast && <div className="painterMilestoneProgress-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default PainterMilestoneProgress;
