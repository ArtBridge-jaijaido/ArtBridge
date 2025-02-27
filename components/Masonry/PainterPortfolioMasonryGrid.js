"use client";
import React, { useState, useEffect } from "react";
import ModallmagePainterPortfolio from "@/components/ModalImage/ModallmagePainterPortfolio.jsx";
import "./PainterPortfolioMasonryGrid.css";

const PainterPortfolioMasonryGrid = ({ images }) => {
  const defaultColumnWidths = [256, 206, 317, 236, 190];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) {
        setColumnWidths([150, 160]);
      } else if (window.innerWidth <= 440) {
        setColumnWidths([170, 190]);
      } else if (window.innerWidth <= 834) {
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

  const deleteImage = (colIndex, imageIndex, e) => {
    e.stopPropagation();
    setColumnItems((prevColumnItems) =>
      prevColumnItems.map((column, idx) => {
        if (idx === colIndex) {
          return column.filter((_, i) => i !== imageIndex);
        }
        return column;
      })
    );
  };

  const handleImageClick = (image) => {
    setCurrentData({ src: image });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentData(null);
  };

  return (
    <div className="painterPortfolio-masonry-grid">
      {columnItems.map((column, colIndex) => (
        <div
          key={colIndex}
          className="painterPortfolio-masonry-grid-column"
          style={{ maxWidth: `${columnWidths[colIndex]}px` }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="painterPortfolio-masonry-grid-item">
              <img
                src={image}
                alt={`Artwork ${imageIndex + 1}`}
                className="painterPortfolio-grid-item-image"
                onClick={() => handleImageClick(image)}
              />
              <div
                className="painterPortfolio-masonry-delete-container"
                onClick={(e) => deleteImage(colIndex, imageIndex, e)}
              >
                <img src="/images/delete-icon.png" alt="Delete" />
              </div>
            </div>
          ))}
        </div>
      ))}
      <ModallmagePainterPortfolio isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </div>
  );
};

export default PainterPortfolioMasonryGrid;
