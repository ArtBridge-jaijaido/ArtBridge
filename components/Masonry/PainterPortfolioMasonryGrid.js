"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ModallmagePainterPortfolio from "@/components/ModalImage/ModallmagePainterPortfolio.jsx";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { deletePortfolio } from "@/services/artworkPortfolioService";
import { useDispatch } from "react-redux";
import { deletePainterPortfolio } from "@/app/redux/feature/painterPortfolioSlice";

import "./PainterPortfolioMasonryGrid.css";
import { useToast } from "@/app/contexts/ToastContext.js";

const PainterPortfolioMasonryGrid = ({ images, onMasonryReady, isMasonryReady   }) => {
  const defaultColumnWidths = [256, 206, 317, 236, 190];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const prevColumnWidths = useRef(defaultColumnWidths); // 🎯 追蹤上次的 columnWidths
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
            onMasonryReady(); // 🔥 觸發 Masonry 完成
        }, 300);
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
      [portfolioId]: imageUrl ? true : false, //  確保圖片網址存在才標記為載入完成
    }));
    setImageLoadedCount((prev) => prev + 1);
    
  };

  const handleDelete = async (portfolio, colIndex, imageIndex, e) => {
    e.stopPropagation(); // 防止觸發其他事件

    // 🔹 刪除 Firestore & Storage 資料
    const response = await deletePortfolio(portfolio.userUid,portfolio.userId, portfolio.portfolioId);

    if (response.success) {
      // ✅ Redux 更新狀態 (刪除 Redux store 內的 portfolio)
      dispatch(deletePainterPortfolio(portfolio.portfolioId));

      // ✅ 更新 UI，從狀態中移除該 portfolio
      setColumnItems((prevColumnItems) =>
        prevColumnItems.map((column, idx) =>
          idx === colIndex ? column.filter((_, i) => i !== imageIndex) : column
        )
      );

      // 當所有圖片都刪除時 不應該顯示 imageloading
      if (Object.keys(imageLoaded).length === 1) {
        onMasonryReady();
      }


    } else {
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
    <div className="painterPortfolio-masonry-grid">
      {columnItems.map((column, colIndex) => (
        <div
          key={colIndex}
          className="painterPortfolio-masonry-grid-column"
          style={{ maxWidth: `${columnWidths[colIndex]}px` }}
          
        >
          {column.map((portfolio, imageIndex) => (
            <div key={imageIndex} className="painterPortfolio-masonry-grid-item">
              <img
                src={portfolio.exampleImageUrl}
                alt={portfolio.exampleImageName || `ArtworkPainterPortfolio ${imageIndex + 1}`}
                className="painterPortfolio-grid-item-image"
                onClick={() => handleImageClick(portfolio)}
                onLoad={() => handleImageLoad(portfolio.portfolioId, portfolio.exampleImageUrl)}
                style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
              />
              {isMasonryReady&&imageLoaded[portfolio.portfolioId] && portfolio.exampleImageUrl &&(
                <div
                  className="painterPortfolio-masonry-delete-container"
                  onClick={(e) => handleDelete(portfolio, colIndex, imageIndex, e)}
                >
                  <img src="/images/delete-icon.png" alt="Delete" />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <ModallmagePainterPortfolio isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </div>
  );
};

export default PainterPortfolioMasonryGrid;