"use client";
import React, { useState, useEffect } from "react";
import "./showMoreList.css";

const ShowMoreList = ({
  items,
  renderItem,
  renderBatch, //  新增
  wrapperClassName = "",
  initialCountByBreakpoint = { default: 10, 834: 8, 440: 6 },
  stepByBreakpoint = { default: 10, 834: 8, 440: 6 },
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [step, setStep] = useState(0);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);

  // 判斷螢幕寬度
  const getBreakpoint = () => {
    const width = window.innerWidth;
    if (width <= 440) return "440";
    if (width <= 834) return "834";
    return "default";
  };

  // 初始化 visibleCount & step，但不覆蓋使用者手動點擊後的 visibleCount
  useEffect(() => {
    const updateCounts = () => {
      if (hasManuallyChanged) return; // ⛔ 使用者點過「顯示更多」就不要再自動調整
      const breakpoint = getBreakpoint();
      setVisibleCount(initialCountByBreakpoint[breakpoint] || 10);
      setStep(stepByBreakpoint[breakpoint] || 10);
    };

    updateCounts();
    window.addEventListener("resize", updateCounts);
    return () => window.removeEventListener("resize", updateCounts);
  }, [hasManuallyChanged]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + step);
    setHasManuallyChanged(true); // ✅ 確保 resize 不會再覆蓋
  };

  const visibleItems = items.slice(0, visibleCount);

 

  return (
    <>
      <div className={wrapperClassName}>
        {renderBatch ? renderBatch(visibleItems) : visibleItems.map(renderItem)}
      </div>
      {visibleCount < items.length && (
        <div className="ShowMoreList-button-wrapper">
          <button className="ShowMoreList-button" onClick={handleShowMore}>
            顯示更多
          </button>
        </div>
      )}
    </>
  );
};

export default ShowMoreList;
