"use client";

import React, { useState, useEffect } from "react";
import "./ArtworkPainterMasonryGrid.css";

const ArtworkPainterMasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  const defaultColumnWidths = [270, 270, 270, 270, 270];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredImages, setFilteredImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isFavorite, setFavorites] = useState({});

  // **初始化分類計數**
  useEffect(() => {
    if (!images || images.length === 0) return;

    const counts = images.reduce((acc, image) => {
      if (image.selectedCategory) {
        acc[image.selectedCategory] = (acc[image.selectedCategory] || 0) + 1;
      }
      return acc;
    }, {});

    setCategoryCounts(counts);
    setFilteredImages(images);
  }, [images]);

  // **處理篩選變更**
  useEffect(() => {
    let newFilteredImages;
    if (selectedFilter === "all") {
      newFilteredImages = images;
    } else {
      newFilteredImages = images.filter((image) => image.selectedCategory === selectedFilter);
    }

    // **開始預載入新篩選結果的圖片**
    setIsPreloaded(false);
    setImageLoaded({}); // 重置圖片載入狀態

    let loadedCount = 0;
    newFilteredImages.forEach((image) => {
      const img = new Image();
      img.src = image.exampleImageUrl;
      img.onload = () => {
        loadedCount++;
        setImageLoaded((prev) => ({
          ...prev,
          [image.portfolioId]: true,
        }));

        // **當所有篩選結果的圖片載入後才顯示**
        if (loadedCount === newFilteredImages.length) {
          setIsPreloaded(true);
        }
      };
    });

    setFilteredImages(newFilteredImages);
  }, [selectedFilter, images]);

  // **更新 Masonry 欄位配置**
  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) {
        setColumnWidths([170, 170]);
      } else if (window.innerWidth <= 440) {
        setColumnWidths([190, 190]);
      } else if (window.innerWidth <= 834) {
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

  // **分配圖片到 Masonry 欄位**
  useEffect(() => {
    if (!isPreloaded) return; // **確保圖片載入完畢後再處理 Masonry 佈局**

    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);
    filteredImages.forEach((image, index) => {
      const columnIndex = index % columnWidths.length;
      newColumnItems[columnIndex].push(image);
    });

    setColumnItems(newColumnItems);
  }, [filteredImages, columnWidths, isPreloaded]);

  // **切換收藏狀態**
  const toggleFavorite = (imageIndex) => {
    setFavorites((prev) => ({
      ...prev,
      [imageIndex]: !prev[imageIndex],
    }));
  };

  // **下載圖片**
  const downloadImage = (imageSrc, e) => {
    e.stopPropagation();
    fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = imageSrc.substring(imageSrc.lastIndexOf("/") + 1) || "download.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  return (
    <div className="ArtworkPainter-masonry-container">
      {/* 篩選按鈕 */}
      <div className="ArtworkPainter-filter">
        <button
          className={`ArtworkPainter-filter-button ${selectedFilter === "all" ? "selected" : ""}`}
          onClick={() => setSelectedFilter("all")}
        >
          全部 {images.length}
        </button>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <button
            key={category}
            className={`ArtworkPainter-filter-button ${selectedFilter === category ? "selected" : ""}`}
            onClick={() => setSelectedFilter(category)}
          >
            {category} {count}
          </button>
        ))}
      </div>

      {/* **只有當圖片完全載入後才顯示 Masonry** */}
      {isPreloaded ? (
        <div className="ArtworkPainter-masonry-grid">
          {columnItems.map((column, columnIndex) => (
            <div key={columnIndex} className="ArtworkPainter-masonry-grid-column" style={{ maxWidth: `${columnWidths[columnIndex]}px` }}>
              {column.map((image, imageIndex) => (
                <div key={imageIndex} className="ArtworkPainter-masonry-grid-item">
                  <img src={image.exampleImageUrl} alt={`Artwork ${imageIndex + 1}`} />

                  {/* **按鈕只在圖片完全載入後顯示** */}
                  {imageLoaded[image.portfolioId] && image.exampleImageUrl && image.download === "是" && (
                    <div className="ArtworkPainter-masonry-downloadIcon-container" onClick={(e) => downloadImage(image.src, e)}>
                      <img src="/images/download-icon.png" alt="Download" />
                    </div>
                  )}
                  {imageLoaded[image.portfolioId] && image.exampleImageUrl && (
                    <button className="ArtworkPainter-masonry-likesIcon-container" onClick={() => toggleFavorite(columnIndex * columnItems[0].length + imageIndex)}>
                      <img src={isFavorite[columnIndex * columnItems[0].length + imageIndex] ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"} alt="favorite" className="ArtworkPainter-favorite-icon" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>圖片載入中...</p>
      )}
    </div>
  );
};

export default ArtworkPainterMasonryGrid;
