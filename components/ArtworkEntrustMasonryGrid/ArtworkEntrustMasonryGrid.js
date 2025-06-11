"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ModalImgEntrustArtShowcase from "@/components/ModalImage/ModalImgEntrustArtShowcase.jsx";
import { useSelector } from "react-redux";
import "./ArtworkEntrustMasonryGrid.css";

const ArtworkEntrustMasonryGrid = ({ images, onMasonryReady }) => {
  const defaultColumnWidths = [256, 206, 317, 236, 190];

  const columnWidthsObj = {
    5: [256, 206, 317, 236, 190],
    4: [180, 180, 200, 160],
    2: [170, 190],
  };

  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const prevColumnWidths = useRef(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [imageLoaded, setImageLoaded] = useState({});
  const totalImages = images.length;
  const [imageLoadedCount, setImageLoadedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const allUsers = useSelector((state) => state.user.allUsers);

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
    images.forEach((image, index) => {
      const columnIndex = index % columnWidths.length;
      newColumnItems[columnIndex].push(image);
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
      assignedArtist: image.assignedArtist || ""
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentData(null);
  };

  if (!images || images.length === 0) {
    return <div className="ArtworkEntrust-noData">目前還沒有任何合作作品喔！</div>;
  }

  return (
    <div className="ArtworkEntrust-masonry-container">
      <div className="ArtworkEntrust-masonry-grid">
        {columnItems.map((column, colIndex) => (
          <div
            key={colIndex}
            className="ArtworkEntrust-masonry-grid-column"
            style={{ width: `${columnWidths[colIndex]}px` }}
          >
            {column.map((image, imageIndex) => (
              <div
                key={imageIndex}
                className="ArtworkEntrust-masonry-grid-item"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.exampleImageUrl}
                  alt={`EntrustArtwork ${imageIndex + 1}`}
                  onLoad={() => handleImageLoad(image.portfolioId, image.exampleImageUrl)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <ModalImgEntrustArtShowcase
        isOpen={isModalOpen}
        onClose={closeModal}
        data={currentData}
      />
    </div>
  );
};

export default ArtworkEntrustMasonryGrid;
