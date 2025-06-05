"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./ArtworkEntrustMasonryGrid.css";
import { useSelector } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import { usePathname } from "next/navigation";
import ModalImgArtShowcase from "@/components/ModalImage/ModalImgArtShowcase.jsx";

const ArtworkEntrustMasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
  const pathname = usePathname();
  const defaultColumnWidths = [270, 270, 270, 270, 270];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [filteredImages, setFilteredImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { addToast } = useToast();
  const allUsers = useSelector((state) => state.user.allUsers);

  useEffect(() => {
    if (!images || images.length === 0) return;

    setFilteredImages(images);
  }, [images]);

  useEffect(() => {
    if (!filteredImages || filteredImages.length === 0) return;

    setIsPreloaded(false);
    setImageLoaded({});

    let loadedCount = 0;
    filteredImages.forEach((image) => {
      const img = new Image();
      img.src = image.exampleImageUrl;
      img.onload = () => {
        loadedCount++;
        setImageLoaded((prev) => ({
          ...prev,
          [image.portfolioId]: true,
        }));
        if (loadedCount === filteredImages.length) {
          setIsPreloaded(true);
          onMasonryReady();
        }
      };
    });
  }, [filteredImages]);

  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) setColumnWidths([170, 170]);
      else if (window.innerWidth <= 440) setColumnWidths([190, 190]);
      else if (window.innerWidth <= 834) setColumnWidths([180, 180, 180, 180]);
      else if (window.innerWidth <= 1280) setColumnWidths([240, 240, 240, 240, 240]);
      else setColumnWidths(defaultColumnWidths);
    };
    updateColumnWidths();
    window.addEventListener("resize", updateColumnWidths);
    return () => window.removeEventListener("resize", updateColumnWidths);
  }, []);

  useEffect(() => {
    if (!isPreloaded) return;
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);
    filteredImages.forEach((image, index) => {
      const columnIndex = index % columnWidths.length;
      newColumnItems[columnIndex].push(image);
    });
    setColumnItems(newColumnItems);
  }, [filteredImages, columnWidths, isPreloaded]);

  const handleImageClick = (image) => {
    const user = allUsers[image.userUid] || {};
    const avatar = user.profileAvatar || image.artistProfileImg || "/images/testing-artist-profile-image.png";
    setCurrentData({
      src: image.exampleImageUrl,
      author: user.nickname || image.artistName || "匿名繪師",
      authorAvatar: avatar,
      imageStyles: image.selectedStyles || [],
      imageCategory: image.selectedCategory || "未分類",
      imageSource: image.imageSource || "來源不明",
      imageReleaseDate: image.createdAt?.slice(0, 10) || "0000-00-00",
      likes: image.likes || 0,
      articleId: image.articleId || null,
      userUid: image.userUid || null,
    });
    setIsModalOpen(true);
  };

  if (!images || images.length === 0) return <div className="ArtworkEntrust-noData">目前還沒有任何合作作品喔！</div>;

  return (
    <div className="ArtworkEntrust-masonry-container">
      {isPreloaded ? (
        <div className="ArtworkEntrust-masonry-grid">
          {columnItems.map((column, columnIndex) => (
            <div key={columnIndex} className="ArtworkEntrust-masonry-grid-column" style={{ maxWidth: `${columnWidths[columnIndex]}px` }}>
              {column.map((image, imageIndex) => (
                <div key={imageIndex} className="ArtworkEntrust-masonry-grid-item" onClick={() => handleImageClick(image)}>
                  <img src={image.exampleImageUrl} alt={`EntrustArtwork ${imageIndex + 1}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>圖片載入中...</p>
      )}
      <ModalImgArtShowcase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={currentData} />
    </div>
  );
};

export default ArtworkEntrustMasonryGrid;
