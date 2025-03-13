"use client";

import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import "./MasonryGrid.css";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";

const MasonryGrid = ({ images, onMasonryReady, isMasonryReady, isPreloaded, setIsPreloaded }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  // const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
  const { setIsImageLoading } = useImageLoading();
  const breakpointColumns = {
    default: 5, // 桌機最多 5 欄
    1280: 5,
    834: 4,
    440: 2,
  };

  const getCurrentBreakpoint = () => {
    const width = window.innerWidth;
    let matchedBreakpoint = "default"; // 預設最大值

    Object.keys(breakpointColumns).forEach((bp) => {
      if (width <= parseInt(bp)) {
        matchedBreakpoint = bp;
      }
    });

    return matchedBreakpoint;
  };



  useEffect(() => {
    setIsPreloaded(false);
    setImageLoaded({}); // 重置圖片載入狀態
    

    let loadedCount = 0;
    images.forEach((image) => {
      const img = new Image();
      img.src = image.exampleImageUrl;
      img.onload = () => {
        loadedCount++;
        setImageLoaded((prev) => ({
          ...prev,
          [image.portfolioId]: true,
        }));

        if (loadedCount === images.length) {
          setIsPreloaded(true);
          onMasonryReady();
         
        }
      };
    });
  }, [images, currentBreakpoint]);

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint();
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    handleResize(); // 先執行一次
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBreakpoint]);

  return isPreloaded ? (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-column"
    >
      {images.map((image, index) => (
        <div key={index} className="masonry-grid-item">
          <img
            src={image.exampleImageUrl}
            alt={`Artwork ${index + 1}`}
            style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
          />

          {/* 只有當圖片載入後才顯示按鈕 */}
          {isMasonryReady && imageLoaded[image.portfolioId] && image.exampleImageUrl && (
            <>
              {/* 下載按鈕（僅當 image.download === "是" 時顯示） */}
              {image.download === "是" && (
                <div className="masonry-downloadIcon-container">
                  <img src="/images/download-icon.png" alt="Download" />
                </div>
              )}

              {/* Like 按鈕 */}
              <div className="masonry-likesIcon-container">
                <img src="/images/icons8-love-96-26.png" alt="numberOfLikes" />
                <span className="masonry-likes-number">100</span>
              </div>
            </>
          )}
        </div>
      ))}
    </Masonry>
  ) : null;
};

export default MasonryGrid;
