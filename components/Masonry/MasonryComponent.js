import React, { useState, useEffect } from "react";
import "./MasonryGrid.css";

const MasonryGrid = ({ images, columnWidths }) => {
  const [columnItems, setColumnItems] = useState(new Array(columnWidths.length).fill([]));

  useEffect(() => {
    const columnHeights = new Array(columnWidths.length).fill(0); // 初始化每列高度
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);

    images.forEach((image, index) => {
      // 找到最短列
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // 將圖片分配到該列
      newColumnItems[minHeightIndex].push(image);

      // 模擬圖片高度更新（可替換為實際圖片高度）
      columnHeights[minHeightIndex] += 200; // 假設每張圖片高度為200px
    });

    setColumnItems(newColumnItems);
  }, [images, columnWidths]);

  return (
    <div className="masonry-grid">
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="masonry-grid-column"
          style={{
            width: `${columnWidths[columnIndex]}px`, // 根據指定列寬設定寬度
          }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="masonry-grid-item">
              <img
                src={image}
                alt={`Artwork ${imageIndex}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
