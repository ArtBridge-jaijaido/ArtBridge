"use client";

import React, { useState, useEffect } from "react";
import "./MasonryGrid.css";

const MasonryGrid = ({ images}) => {
  const defaultColumnWidths = [256, 206, 317, 236, 190];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));

  const isConsumerProfilePage = typeof window !== "undefined" && window.location.pathname.includes("artworkConsumerProfile");

  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) {
        setColumnWidths([150, 160]);
      }
      else if (window.innerWidth <= 440) {
        setColumnWidths([170, 190]);
      }
      else if (window.innerWidth <= 834) {
        setColumnWidths([160, 200, 180, 180]);
      } else if (window.innerWidth <= 1280) {
        setColumnWidths([190, 190, 260, 206, 210]);
      } else {
        setColumnWidths(defaultColumnWidths);
      }
    };

    updateColumnWidths();
    window.addEventListener("resize", updateColumnWidths);
    return () => window.removeEventListener("resize", updateColumnWidths);
  }, []);

  useEffect(() => {
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);

    images.forEach((image, index) => {
      const columnIndex = index % columnWidths.length; // 固定分配到列
      newColumnItems[columnIndex].push(image);
    });

    setColumnItems(newColumnItems); // 更新列數據
  }, [images, columnWidths]);

  return (
    <div className="masonry-grid">
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="masonry-grid-column"
          style={{
            maxWidth: `${columnWidths[columnIndex]}px`
          }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="masonry-grid-item">
              <img src={image} alt={`Artwork ${imageIndex + 1}`} />
              {!isConsumerProfilePage && (
                <div className="masonry-likesIcon-container">
                  <img src="/images/icons8-love-96-26.png" alt="numberOfLikes"></img>
                  <span className="masonry-likes-number">100</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
