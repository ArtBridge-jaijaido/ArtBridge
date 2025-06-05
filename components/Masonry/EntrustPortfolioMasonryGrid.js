"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ModallmageEntrustPortfolio from "@/components/ModalImage/ModallmageEntrustPortfolio.jsx";
import { useDispatch } from "react-redux";
import { deleteEntrustPortfolio as deleteEntrustPortfolioAction } from "@/app/redux/feature/entrustPortfolioSlice.js";
import { deleteEntrustPortfolio as deleteEntrustPortfolioService } from "@/services/artworkEntrustPortfolioService.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./EntrustPortfolioMasonryGrid.css";

const EntrustPortfolioMasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  console.log("📸 images props received:", images); 
  console.log("📸 <EntrustPortfolioMasonryGrid /> 渲染中", images);
  const defaultColumnWidths = [256, 206, 317, 236, 190];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const prevColumnWidths = useRef(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const totalImages = images.length;
  const [imageLoadedCount, setImageLoadedCount] = useState(0);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  useEffect(() => {
    if (imageLoadedCount >= totalImages && totalImages > 0) {
      setTimeout(() => {
        onMasonryReady();
      }, 300);
    }
  }, [imageLoadedCount, totalImages, onMasonryReady]);

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
          prev.map((column, idx) => idx === colIndex ? column.filter((_, i) => i !== imageIndex) : column)
        );
        if (Object.keys(imageLoaded).length === 1) {
          onMasonryReady();
        }
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
    <div className="entrustPortfolio-masonry-grid">
      {columnItems.map((column, colIndex) => (
        <div
          key={colIndex}
          className="entrustPortfolio-masonry-grid-column"
          style={{ maxWidth: `${columnWidths[colIndex]}px` }}
        >
          {/* {column.map((portfolio, imageIndex) => (

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
          ))} */}
          {column.map((portfolio, imageIndex) => {
            console.log("🔍 portfolio image", {
              portfolioId: portfolio.portfolioId,
              imageUrl: portfolio.exampleImageUrl,
              name: portfolio.exampleImageName
            });

            return (
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
            );
          })}
        </div>
      ))}
      <ModallmageEntrustPortfolio isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </div>
  );
};

export default EntrustPortfolioMasonryGrid;
