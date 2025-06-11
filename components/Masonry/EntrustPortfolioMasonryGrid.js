"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ModallmageEntrustPortfolio from "@/components/ModalImage/ModallmageEntrustPortfolio.jsx";
import { useDispatch } from "react-redux";
import { deleteEntrustPortfolio as deleteEntrustPortfolioAction } from "@/app/redux/feature/entrustPortfolioSlice.js";
import { deleteEntrustPortfolio as deleteEntrustPortfolioService } from "@/services/artworkEntrustPortfolioService.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./EntrustPortfolioMasonryGrid.css";

const EntrustPortfolioMasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const defaultColumnWidths = [256, 206, 317, 236, 190];

  const columnWidthsObj = {
    5: [256, 206, 317, 236, 190],
    4: [180, 180, 200, 160],
    2: [170, 190],
  };

  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const prevColumnWidths = useRef(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const totalImages = images.length;
  const [imageLoadedCount, setImageLoadedCount] = useState(0);

  const updateColumnWidths = useCallback(() => {
    const baseWidth1440 = 1440;
    const baseWidth834 = 834;
    const width = window.innerWidth;

    let newWidths;

    if (width > 1440) {
      newWidths = columnWidthsObj[5];
    } else if (width > 834) {
      const scale = width / baseWidth1440;
      newWidths = columnWidthsObj[5].map((w) => Math.round(w * scale));
    } else if (width > 440) {
      const scale = width / baseWidth834;
      newWidths = columnWidthsObj[4].map((w) => Math.round(w * scale));
    } else {
      newWidths = columnWidthsObj[2];
    }

    if (JSON.stringify(prevColumnWidths.current) !== JSON.stringify(newWidths)) {
      prevColumnWidths.current = newWidths;
      setColumnWidths(newWidths);
    }
  }, []);

  useEffect(() => {
    updateColumnWidths();
    window.addEventListener("resize", updateColumnWidths);

    return () => {
      window.removeEventListener("resize", updateColumnWidths);
    };
  }, [updateColumnWidths]);

  useEffect(() => {
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);
    images.forEach((portfolio, index) => {
      const columnIndex = index % columnWidths.length;
      newColumnItems[columnIndex].push(portfolio);
    });
    setColumnItems(newColumnItems);
  }, [images, columnWidths]);

  useEffect(() => {
    if (imageLoadedCount >= totalImages && totalImages > 0) {
      setTimeout(() => {
        onMasonryReady();
      }, 300);
    }
  }, [imageLoadedCount, totalImages, onMasonryReady]);

  const handleImageLoad = (portfolioId, imageUrl) => {
    setImageLoaded((prev) => ({
      ...prev,
      [portfolioId]: !!imageUrl,
    }));
    setImageLoadedCount((prev) => prev + 1);
  };

  const handleDelete = async (portfolio, colIndex, imageIndex, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(`確定要刪除作品「${portfolio.exampleImageName}」嗎？`);
    if (!confirmDelete) return;

    try {
      const response = await deleteEntrustPortfolioService(portfolio.userUid, portfolio.userId, portfolio.portfolioId);
      if (response.success) {
        dispatch(deleteEntrustPortfolioAction(portfolio.portfolioId));
        setColumnItems((prev) =>
          prev.map((column, idx) => (idx === colIndex ? column.filter((_, i) => i !== imageIndex) : column))
        );
        addToast("success", "作品已刪除");
      } else {
        addToast("error", "刪除失敗，請稍後再試");
      }
    } catch (error) {
      addToast("error", "刪除失敗，請稍後再試");
    }
  };

  const handleImageClick = (portfolio) => {
    setCurrentData(portfolio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentData(null);
  };

  return (
    <div className="entrustPortfolio-masonry-grid-wrapper">
      <div className="entrustPortfolio-masonry-grid">
        {columnItems.map((column, colIndex) => (
          <div
            key={colIndex}
            className="entrustPortfolio-masonry-grid-column"
            style={{ width: `${columnWidths[colIndex]}px` }}
          >
            {column.map((portfolio, imageIndex) => (
              <div key={imageIndex} className="entrustPortfolio-masonry-grid-item">
                <img
                  src={portfolio.exampleImageUrl}
                  alt={portfolio.exampleImageName || `ArtworkEntrustPortfolio ${imageIndex + 1}`}
                  className="entrustPortfolio-grid-item-image"
                  onClick={() => handleImageClick(portfolio)}
                  onLoad={() => handleImageLoad(portfolio.portfolioId, portfolio.exampleImageUrl)}
                  style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
                />
                {isMasonryReady && imageLoaded[portfolio.portfolioId] && portfolio.exampleImageUrl && (
                  <div
                    className="entrustPortfolio-masonry-delete-container"
                    onClick={(e) => handleDelete(portfolio, colIndex, imageIndex, e)}
                  >
                    <img src="/images/delete-icon.png" alt="Delete" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <ModallmageEntrustPortfolio isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </div>
  );
};

export default EntrustPortfolioMasonryGrid;
