"use client";

import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import "./MasonryGrid.css";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
import { togglePortfolioLike,checkPortfolioIdExists } from "@/services/artworkPortfolioService";
import { fetchPainterPortfolios } from "@/lib/painterPortfolioListener";
import { useSelector } from "react-redux";
import { useToast } from "@/app/contexts/ToastContext.js";
import ModalImgArtShowcase from '@/components/ModalImage/ModalImgArtShowcase.jsx';

const MasonryGrid = ({ images, onMasonryReady, isMasonryReady, isPreloaded, setIsPreloaded }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
  const { setIsImageLoading } = useImageLoading();
  const currentUser = useSelector((state) => state.user.user);
  const [likeStates, setLikeStates] = useState({});
  const { addToast } = useToast();

    // 🔥 Modal 控制
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState(null);

  const breakpointColumns = {

    default: 5, // 桌機最多 5 欄
    1280: 5,
    834: 4,
    440: 2,
  };

  const getCurrentBreakpoint = () => {
    const width = window.innerWidth;
    let matchedBreakpoint = "default"; // 預設最大值

    Object.keys(breakpointColumns).forEach((bp) => {
      if (width <= parseInt(bp)) {
        matchedBreakpoint = bp;
      }
    });

    return matchedBreakpoint;
  };



  useEffect(() => {

    setIsPreloaded(false);
    setImageLoaded({}); // 重置圖片載入狀態

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

    handleResize(); // 先執行一次
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBreakpoint]);


  /* 按讚功能 */
  const handleToggleLike = async (e, image) => {
    e.stopPropagation();

    const portfoliExist =await checkPortfolioIdExists(image.userUid, image.portfolioId);
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
        const hasLiked = image.likedBy?.includes(currentUser.uid);

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

  const handleImageClick = (image) => {
    setCurrentData({
      src: image.exampleImageUrl,
      author: image.artistName || "匿名繪師",
      authorAvatar: image.artistProfileImg || "/images/testing-artist-profile-image.png",
      imageStyles: image.selectedStyles || [],
      imageCategory: image.selectedCategory || "未分類",
      imageSource: image.imageSource || "來源不明",
      imageReleaseDate: image.createdAt?.slice(0, 10) || "0000-00-00",
      innerContextTitle: image.title || "標題未提供",
      innerContext: image.description || "尚無內文",
      likes: image.likes || 0,
      comments: image.comments || 0,
      shares: 0,
      isCollected: image.collectedBy?.includes(currentUser?.uid),
      articleId: image.articleId || null,
      userUid: image.userUid || null
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
      {images.map((image, index) => (
        <div key={index} className="masonry-grid-item" onClick={() => handleImageClick(image)} 
        >
          <img
            src={image.exampleImageUrl}
            alt={`Artwork ${index + 1}`}
            style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
          />

          {/* 只有當圖片載入後才顯示按鈕 */}
          {isPreloaded && isMasonryReady && imageLoaded[image.portfolioId] && image.exampleImageUrl && (
            <>
              {/* 下載按鈕（僅當 image.download === "是" 時顯示） */}
              {image.download === "是" && (
                <div className="masonry-downloadIcon-container">
                  <img src="/images/download-icon.png" alt="Download" />
                </div>
              )}

              {/* Like 按鈕 */}
              <div className="masonry-likesIcon-container"
                onClick={(e) => handleToggleLike(e, image)}
              >
                <img
                      src={
                        image.likedBy?.includes(currentUser?.uid)
                          ? "/images/icons8-love-48-1.png"
                          : "/images/icons8-love-96-26.png"
                      }
                      alt="numberOfLikes"
                    />
                <span className="masonry-likes-number"

                >{image.likes}</span>
              </div>

            </>
          )}
        </div>
      ))}
    </Masonry>

    <ModalImgArtShowcase isOpen={isModalOpen} onClose={handleCloseModal} data={currentData} />
  </>


  );
};

export default MasonryGrid;
