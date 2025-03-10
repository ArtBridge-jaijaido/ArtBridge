"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import "./MasonryGrid.css";

const MasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  const defaultColumnWidths = [256, 206, 317, 236, 190];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const prevColumnWidths = useRef(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const isConsumerProfilePage = typeof window !== "undefined" && window.location.pathname.includes("artworkConsumerProfile");
  const [imageLoaded, setImageLoaded] = useState({});
  const totalImages = images.length;
  const [imageLoadedCount, setImageLoadedCount] = useState(0);

 

  useEffect(() => {
    if (imageLoadedCount >= totalImages && totalImages > 0) {

      
      setTimeout(() => {
        onMasonryReady(); // 🔥 觸發 Masonry 完成
      }, 500);
    }
  }, [imageLoadedCount, totalImages, onMasonryReady]);

  //  只有當 window.innerWidth 改變時，才更新 columnWidths
  const updateColumnWidths = useCallback(() => {


    let newWidths = defaultColumnWidths;

    if (window.innerWidth <= 370) {
      newWidths = [150, 160];
    } else if (window.innerWidth <= 440) {
      newWidths = [170, 190];
    } else if (window.innerWidth <= 834) {
      newWidths = [160, 200, 180, 180];
    } else if (window.innerWidth <= 1280) {
      newWidths = [190, 190, 260, 206, 210];
    }

    // ** 只有當 columnWidths 真的改變時，才更新狀態**
    if (JSON.stringify(prevColumnWidths.current) !== JSON.stringify(newWidths)) {
      prevColumnWidths.current = newWidths; // 更新 useRef
      setColumnWidths(newWidths);
    }

  }, []);



  //  監聽 resize 事件，並確保 columnWidths 只在變更時更新
  useEffect(() => {
    updateColumnWidths(); // 初始化時執行一次
    window.addEventListener("resize", updateColumnWidths);

    return () => {
      window.removeEventListener("resize", updateColumnWidths);

    };

  }, [updateColumnWidths]);

  //  按照 masonry 分配作品到不同欄位
  useEffect(() => {
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);
    images.forEach((portfolio, index) => {
      const columnIndex = index % columnWidths.length;
      newColumnItems[columnIndex].push(portfolio); // 傳遞完整的 portfolio
    });
    setColumnItems(newColumnItems);
  }, [images, columnWidths]);

  const handleImageLoad = (portfolioId, imageUrl) => {
    setImageLoaded((prev) => ({
      ...prev,
      [portfolioId]: imageUrl ? true : false,
    }));
    setImageLoadedCount((prev) => prev + 1);

  };

  // const downloadImage = (imageSrc, e) => {
  //   e.stopPropagation()
  //   fetch(imageSrc)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = imageSrc.split("/").pop();
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => console.error("Download failed:", error));
  // };


  return (
    <div className="masonry-grid">
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="masonry-grid-column"
          style={{
            maxWidth: `${columnWidths[columnIndex]}px`, 
          }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="masonry-grid-item" >

              {/* 圖片 */}
              <img
                src={image.exampleImageUrl}
                alt={`Artwork ${imageIndex + 1}`}
                onLoad={() => handleImageLoad(image.portfolioId, image.exampleImageUrl)} // 確保圖片載入完成
                style={{
                  visibility: isMasonryReady ? "visible" : "hidden",

                }}
              />

              {/* 只有當圖片載入後才顯示按鈕 */}
              {isMasonryReady && imageLoaded[image.portfolioId] && image.exampleImageUrl && (
                <>
                  {/* 下載按鈕（僅當 image.download === "是" 時顯示） */}

                  {image.download === "是" && (
                    <div
                      className="masonry-downloadIcon-container"
                      onClick={(e) => downloadImage(image.exampleImageUrl, e)}
                    >
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
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
