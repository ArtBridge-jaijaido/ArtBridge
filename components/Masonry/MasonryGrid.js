"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Masonry from "react-masonry-css";
import "./MasonryGrid.css";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
import {
  togglePortfolioLike,
  checkPortfolioIdExists,
} from "@/services/artworkPortfolioService";
import { fetchPainterPortfolios } from "@/lib/painterPortfolioListener";
import { useSelector } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import ModalImgArtShowcase from "@/components/ModalImage/ModalImgArtShowcase.jsx";

const MasonryGrid = ({
  images,
  onMasonryReady,
  isMasonryReady,
  isPreloaded,
  setIsPreloaded,
}) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
  const { setIsImageLoading } = useImageLoading();
  const currentUser = useSelector((state) => state.user.user);
  const allUsers = useSelector((state) => state.user.allUsers);
  const [likeStates, setLikeStates] = useState({});
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const breakpointColumns = {
    default: 5,
    1280: 5,
    834: 4,
    440: 2,
  };

  const getCurrentBreakpoint = () => {
    const width = window.innerWidth;
    let matchedBreakpoint = "default";
    Object.keys(breakpointColumns).forEach((bp) => {
      if (width <= parseInt(bp)) {
        matchedBreakpoint = bp;
      }
    });
    return matchedBreakpoint;
  };

  // 預先記憶每張圖是否被按讚，避免每次都跑 includes()
  const likedMap = useMemo(() => {
    const map = {};
    images.forEach((img) => {
      const liked = img.likedBy?.includes(currentUser?.uid);
      map[img.portfolioId] = liked;
    });
    return map;
  }, [images, currentUser?.uid]);

  useEffect(() => {
    setIsPreloaded(false);
    setImageLoaded({});

    let loadedCount = 0;
    images.forEach((image) => {
      const img = new Image();
      img.src = image.exampleImageUrl;
      img.onload = () => {
        loadedCount++;
        setImageLoaded((prev) => ({
          ...prev,
          [image.portfolioId]: true,
        }));
        if (loadedCount === images.length) {
          setIsPreloaded(true);
          onMasonryReady();
        }
      };
    });
  }, [images]);

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint();
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentBreakpoint]);

  const handleToggleLike = async (e, image) => {
    e.stopPropagation();

    const exists = await checkPortfolioIdExists(image.userUid, image.portfolioId);
    if (!exists) {
      addToast("error", "sorry 該作品已被原作者刪除");
      fetchPainterPortfolios();
      return;
    }

    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔！");
      return;
    }

    try {
      const response = await togglePortfolioLike(
        image.userUid,
        image.portfolioId,
        currentUser.uid
      );
      if (response.success) {
        const hasLiked = likedMap[image.portfolioId];
        setLikeStates((prev) => ({
          ...prev,
          [image.portfolioId]: !hasLiked,
        }));
      }
    } catch (err) {
      console.error("按讚失敗", err);
      addToast("error", "按讚失敗，請稍後再試！");
    }
  };

  const preloadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });

  const handleImageClick = async (image) => {
    const user = allUsers[image.userUid] || {};
    const avatar =
      user.profileAvatar ||
      image.artistProfileImg ||
      "/images/testing-artist-profile-image.png";
    await Promise.all([
      preloadImage(image.exampleImageUrl),
      preloadImage(avatar),
    ]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentData(null);
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {images.map((image, index) => {
          const isLiked = likeStates[image.portfolioId] ?? likedMap[image.portfolioId] ?? false;

          return (
            <div
              key={index}
              className="masonry-grid-item"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.exampleImageUrl}
                alt={`Artwork ${index + 1}`}
                style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
              />

              {isPreloaded &&
                isMasonryReady &&
                imageLoaded[image.portfolioId] &&
                image.exampleImageUrl && (
                  <>
                    {image.download === "是" && (
                      <div className="masonry-downloadIcon-container">
                        <img
                          src="/images/download-icon.png"
                          alt="Download"
                        />
                      </div>
                    )}

                    <div
                      className="masonry-likesIcon-container"
                      onClick={(e) => handleToggleLike(e, image)}
                    >
                      <img
                        src={
                          isLiked
                            ? "/images/icons8-love-48-1.png"
                            : "/images/icons8-love-96-26.png"
                        }
                        alt="numberOfLikes"
                      />
                      <span className="masonry-likes-number">
                        {image.likes}
                      </span>
                    </div>
                  </>
                )}
            </div>
          );
        })}
      </Masonry>

      <ModalImgArtShowcase
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={currentData}
      />
    </>
  );
};

export default MasonryGrid;
