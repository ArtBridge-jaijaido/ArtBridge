"use client";

import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import "./MasonryGrid.css";

const MasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [isPreloaded, setIsPreloaded] = useState(false);
  
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
  }, [images]);


  const breakpointColumns = {
    default: 5, // 桌機最多 5 欄
    1280: 5,
    834: 4,
    440: 2,
  };

  return isPreloaded ?  (
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
