import React from "react";
import "./MarketProgressBar.css"; // 引入 CSS

export default function MarketProgressBar({ step, totalSteps }) {
  return (
    <div className="Market-progressbar-wrapper">
    <div className="Market-progressbar-container">
      {Array.from({ length: totalSteps * 2 - 1 }).map((_, index) => {
        // 奇數索引為圓圈，偶數索引為連接線
        const isCircle = index % 2 === 0;
        const stepIndex = Math.floor(index / 2) + 1;

        return (
          <div key={index} className="Market-progress-item">
            {isCircle ? (
              <div className={`Market-progress-circle ${step >= stepIndex ? "active" : ""}`}></div>
            ) : (
              <div className={`Market-progress-line ${step > stepIndex ? "active" : ""}`}></div>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}
