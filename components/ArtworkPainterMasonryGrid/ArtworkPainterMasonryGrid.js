"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./ArtworkPainterMasonryGrid.css";
import { togglePortfolioLike, checkPortfolioIdExists } from "@/services/artworkPortfolioService";
import { fetchPainterPortfolios } from "@/lib/painterPortfolioListener";
import { useSelector } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import { usePathname } from "next/navigation";
import ModalImgArtShowcase from "@/components/ModalImage/ModalImgArtShowcase.jsx";

const ArtworkPainterMasonryGrid = ({ images, onMasonryReady, isMasonryReady, onUnlike }) => {
  const pathname = usePathname();
  const isCollectionPage = pathname.includes("artworkCollectionList");
  const defaultColumnWidths = [270, 270, 270, 270, 270];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredImages, setFilteredImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isPreloaded, setIsPreloaded] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const [likeStates, setLikeStates] = useState({});
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const allUsers = useSelector((state) => state.user.allUsers);

  const likedMap = useMemo(() => {
    const map = {};
    images.forEach((img) => {
      const liked = img.likedBy?.includes(currentUser?.uid);
      map[img.portfolioId] = liked;
    });
    return map;
  }, [images, currentUser?.uid]);

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

  useEffect(() => {
    let newFilteredImages = selectedFilter === "all" ? images : images.filter((image) => image.selectedCategory === selectedFilter);

    setIsPreloaded(false);
    setImageLoaded({});

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

        if (loadedCount === newFilteredImages.length) {
          setIsPreloaded(true);
        }
      };
    });

    setFilteredImages(newFilteredImages);
  }, [selectedFilter, images.length]);

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

  const handleToggleLike = async (e, image) => {
    e.stopPropagation();

    const portfoliExist = await checkPortfolioIdExists(image.userUid, image.portfolioId);
    if (!portfoliExist) {
      addToast("error", "sorry 該作品已被原作者刪除");
      fetchPainterPortfolios();
      return;
    }

    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔！");
      return;
    }

    try {
      const response = await togglePortfolioLike(image.userUid, image.portfolioId, currentUser.uid);
      if (response.success) {
        const hasLiked = likedMap[image.portfolioId];
        if (isCollectionPage) onUnlike(image.portfolioId);
        setLikeStates((prev) => ({ ...prev, [image.portfolioId]: !hasLiked }));
      }
    } catch (err) {
      console.error("按讚失敗", err);
      addToast("error", "按讚失敗，請稍後再試！");
    }
  };

  const downloadImage = (imageUrl, e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "artwork.jpg";
    a.click();
  };

  const handleImageClick = async (image) => {
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

  if (!images || images.length === 0) return <div className="ArtworkPainter-noData">目前還沒有任何作品喔！</div>;

  return (
    <div className="ArtworkPainter-masonry-container">
      {!isCollectionPage && (
        <div className="ArtworkPainter-filter">
          <button className={`ArtworkPainter-filter-button ${selectedFilter === "all" ? "selected" : ""}`} onClick={() => setSelectedFilter("all")}>全部 {images.length}</button>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <button key={category} className={`ArtworkPainter-filter-button ${selectedFilter === category ? "selected" : ""}`} onClick={() => setSelectedFilter(category)}>
              {category} {count}
            </button>
          ))}
        </div>
      )}

      {isPreloaded ? (
        <div className="ArtworkPainter-masonry-grid">
          {columnItems.map((column, columnIndex) => (
            <div key={columnIndex} className="ArtworkPainter-masonry-grid-column" style={{ maxWidth: `${columnWidths[columnIndex]}px` }}>
              {column.map((image, imageIndex) => {
                const isLiked = likeStates[image.portfolioId] ?? likedMap[image.portfolioId] ?? false;

                return (
                  <div key={imageIndex} className="ArtworkPainter-masonry-grid-item" onClick={() => handleImageClick(image)}>
                    <img src={image.exampleImageUrl} alt={`Artwork ${imageIndex + 1}`} />

                    {imageLoaded[image.portfolioId] && image.exampleImageUrl && image.download === "是" && !isCollectionPage && (
                      <div className="ArtworkPainter-masonry-downloadIcon-container" onClick={(e) => downloadImage(image.exampleImageUrl, e)}>
                        <img src="/images/download-icon.png" alt="Download" />
                      </div>
                    )}

                    {imageLoaded[image.portfolioId] && image.exampleImageUrl && (
                      <button className="ArtworkPainter-masonry-likesIcon-container" onClick={(e) => handleToggleLike(e, image)}>
                        <img
                          src={isLiked ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"}
                          alt="favorite"
                          className="ArtworkPainter-favorite-icon"
                        />
                      </button>
                    )}
                  </div>
                );
              })}
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

export default ArtworkPainterMasonryGrid;