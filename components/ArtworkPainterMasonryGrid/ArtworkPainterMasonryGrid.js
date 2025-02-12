"use client";

import React, { useState, useEffect } from "react";
import "./ArtworkPainterMasonryGrid.css";

const ArtworkPainterMasonryGrid = ({ images}) => {
  const defaultColumnWidths = [270, 270, 270, 270, 270];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [selectedFilter, setSelectedFilter] = useState("all"); // 預設選中
  const [filteredImages, setFilteredImages] = useState(images); // 預設顯示全部

  // 篩選按鈕選項
  const filterOptions = [
    { label: "全部 99+", value: "all" },
    { label: "類別1 30", value: "category1" },
    { label: "類別2 15", value: "category2" },
    { label: "類別3 10", value: "category3" }
  ];

  // 更新篩選條件
  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    if (filterValue === "all") {
        setFilteredImages(images); // 顯示全部圖片
    } else {
      const filtered = images.filter(image => image.category?.toLowerCase() === filterValue);
        setFilteredImages(filtered); // 設定過濾後的圖片
    }
  };

  const [isfavorite, setFavorites] = useState({});

  const toggleFavorite = (imageIndex) => {
    setFavorites((prev) => ({
      ...prev,
      [imageIndex]: !prev[imageIndex], // 切換對應 index 的收藏狀態
    }));
  };

  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) {
        setColumnWidths([170, 170]);
      }
      else if (window.innerWidth <= 440) {
        setColumnWidths([190, 190]);
      }
      else if (window.innerWidth <= 834) {
        setColumnWidths([180, 180, 180, 180]);
      } else if (window.innerWidth <= 1280) {
        setColumnWidths([240, 240, 240, 240, 240]);
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

    filteredImages.forEach((image, index) => {
      const columnIndex = index % columnWidths.length; // 固定分配到列
      newColumnItems[columnIndex].push(image);  
    });

    setColumnItems(newColumnItems); // 更新列數據
  }, [filteredImages, columnWidths]);

  return (
    <div className="ArtworkPainter-masonry-container">
    {/* 篩選按鈕 - 獨立在第一行 */}
    <div className="ArtworkPainter-filter">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          className={`ArtworkPainter-filter-button ${selectedFilter === option.value ? "selected" : ""}`}
          onClick={() => handleFilterSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
    <div className="ArtworkPainter-masonry-grid">
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="ArtworkPainter-masonry-grid-column"
          style={{
            maxWidth: `${columnWidths[columnIndex]}px`
          }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="ArtworkPainter-masonry-grid-item">
              <img src={image.src} alt={`ArtworkPainter ${imageIndex + 1}`} />
              {/* 收藏按鈕 */}
                <button className="ArtworkPainter-masonry-likesIcon-container" onClick={() => toggleFavorite(columnIndex * columnItems[0].length + imageIndex)}>
                        <img
                          src={isfavorite[columnIndex * columnItems[0].length + imageIndex]  ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"}
                          alt="favorite"
                          className="ArtworkPainter-favorite-icon"
                        />
                </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
  );
};

export default ArtworkPainterMasonryGrid;
