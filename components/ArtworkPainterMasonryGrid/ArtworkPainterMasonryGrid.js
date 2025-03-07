"use client";

import React, { useState, useEffect,useRef } from "react";
import "./ArtworkPainterMasonryGrid.css";

const ArtworkPainterMasonryGrid = ({ images, onMasonryReady, isMasonryReady}) => {
  const defaultColumnWidths = [270, 270, 270, 270, 270];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
   const prevColumnWidths = useRef(defaultColumnWidths); 
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [selectedFilter, setSelectedFilter] = useState("all"); // 預設選中
  const [filteredImages, setFilteredImages] = useState([]); // 預設顯示全部
  const [imageLoaded, setImageLoaded] = useState({});
  const totalImages = images.length;
  const [imageLoadedCount, setImageLoadedCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  

  // 篩選按鈕選項
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

  // * 篩選作品**
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((image) => image.selectedCategory === selectedFilter));
    }
  }, [selectedFilter, images]);

  // * 生成篩選按鈕**
  const filterOptions = [
    { label: `全部 ${images.length}`, value: "all" },
    ...Object.entries(categoryCounts).map(([category, count]) => ({
      label: `${category} ${count}`,
      value: category,
    })),
  ];

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
  };

  const [isfavorite, setFavorites] = useState({});

  const toggleFavorite = (imageIndex) => {
    setFavorites((prev) => ({
      ...prev,
      [imageIndex]: !prev[imageIndex], // 切換對應 index 的收藏狀態
    }));
  };



  const downloadImage = (imageSrc,e) => {
    e.stopPropagation(); 
    fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = imageSrc.substring(imageSrc.lastIndexOf('/') + 1) || "download.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  useEffect(() => {
    if (imageLoadedCount >= totalImages && totalImages > 0) {
        setTimeout(() => {
            onMasonryReady(); // 🔥 觸發 Masonry 完成
        }, 300);
    }

    
}, [imageLoadedCount, totalImages, onMasonryReady]);
  

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


  const handleImageLoad = (portfolioId, imageUrl) => { 
    setImageLoaded((prev) => ({
      ...prev,
      [portfolioId]: imageUrl ? true : false, //  確保圖片網址存在才標記為載入完成
    }));
    setImageLoadedCount((prev) => prev + 1);
    
  };

  return (
    <div className="ArtworkPainter-masonry-container">
    {/* 篩選按鈕 - 獨立在第一行 */}
    <div className="ArtworkPainter-filter">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`ArtworkPainter-filter-button ${selectedFilter === option.value ? "selected" : ""}`}
            onClick={() => setSelectedFilter(option.value)}
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
              <img src={image.exampleImageUrl} 
              alt={`ArtworkPainter ${imageIndex + 1}`} 
              onLoad={() => handleImageLoad(image.id, image.exampleImageUrl)}
              style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
              />
               {/* 下載按鈕 */}
               {isMasonryReady && imageLoaded[image.id] && image.exampleImageUrl && image.download==="是"&&(
                <div className="ArtworkPainter-masonry-downloadIcon-container" onClick={(e) => downloadImage(image.src,e)}>
                      <img src="/images/download-icon.png" alt="Download" />
                </div>
              )}
               {isMasonryReady && imageLoaded[image.id] && image.exampleImageUrl && (
                <button className="ArtworkPainter-masonry-likesIcon-container" onClick={() => toggleFavorite(columnIndex * columnItems[0].length + imageIndex)}>
                        <img
                          src={isfavorite[columnIndex * columnItems[0].length + imageIndex]  ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"}
                          alt="favorite"
                          className="ArtworkPainter-favorite-icon"
                        />
                </button>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
  );
};

export default ArtworkPainterMasonryGrid;
