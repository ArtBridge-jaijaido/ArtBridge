"use client";

import React, { useState, useEffect, useMemo } from "react";
import Masonry from "react-masonry-css";
import ModalImgArtCommunity from "@/components/ModalImage/ModalImgArtCommunity.jsx";
import { getCommentCount } from "@/services/articleCommentService.js";
import { checkArticleExists, toggleArticleLike, toggleArticleCollect } from "@/services/artworkArticleService";
import { fetchPainterArticles } from '@/lib/painterArticleListener';
import { useToast } from "@/app/contexts/ToastContext.js";
import "./MasonryArtCommunity.css";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const MasonryArtCommunity = ({ images, onMasonryReady, isMasonryReady, isPreloaded, setIsPreloaded, onCollected }) => {
  const pathname = usePathname();
  const isCollectionPage = pathname.includes("artworkCollectionList");
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigation();
  const { setIsLoading } = useLoading();
  const [likeStates, setLikeStates] = useState({});
  const [collectedStates, setCollectedStates] = useState({});
  const currentUser = useSelector((state) => state.user.user);
  const allUsers = useSelector((state) => state.user.allUsers);

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

  useEffect(() => {
    setIsPreloaded(false);
    setImageLoaded({});

    let loadedCount = 0;
    const totalImages = images.length * 2;

    images.forEach((image) => {
      const exampleImg = new Image();
      const avatarImg = new Image();

      const exampleUrl = image.exampleImageUrl;
      const avatarUrl = image.artistProfileImg || "/images/testing-artist-profile-image.png";

      const handleSingleLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsPreloaded(true);
          onMasonryReady();
        }
      };

      exampleImg.onload = handleSingleLoad;
      exampleImg.onerror = handleSingleLoad;
      avatarImg.onload = handleSingleLoad;
      avatarImg.onerror = handleSingleLoad;

      exampleImg.src = exampleUrl;
      avatarImg.src = avatarUrl;

      setImageLoaded((prev) => ({
        ...prev,
        [image.portfolioId]: true,
      }));
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBreakpoint]);

  // ✅ Memo liked & collected map
  const likedMap = useMemo(() => {
    const map = {};
    images.forEach(img => {
      const liked = img.likedBy?.includes(currentUser?.uid);
      map[img.articleId] = liked;
    });
    return map;
  }, [images, currentUser?.uid]);

  const collectedMap = useMemo(() => {
    const map = {};
    images.forEach(img => {
      const collected = img.collectedBy?.includes(currentUser?.uid);
      map[img.articleId] = collected;
    });
    return map;
  }, [images, currentUser?.uid]);

  const handleImageClick = async (image) => {
    const articleExist = await checkArticleExists(image.userUid, image.articleId);
    if (!articleExist) {
      addToast("error", "sorry 該文章已被原作者刪除");
      fetchPainterArticles();
      return;
    }

    setIsModalOpen(false);
    setCurrentData(null);

    const mainImg = new Image();
    const avatarImg = new Image();

    const exampleImageUrl = image.exampleImageUrl;
    const artistAvatarUrl = image.artistProfileImg || "/images/testing-artist-profile-image.png";

    let loadedCount = 0;

    const checkAllLoaded = async () => {
      loadedCount++;
      if (loadedCount === 2) {
        const commentCount = await getCommentCount(image.userUid, image.articleId);
        const user = allUsers[image.userUid] || {};

        setCurrentData({
          src: exampleImageUrl,
          author: user.nickname || "使用者名稱",
          articleId: image.articleId || "文章ID",
          userUid: image.userUid || "使用者ID",
          authorAvatar: user.profileAvatar || "/images/testing-artist-profile-image.png",
          imageStyles: image.selectedStyles || "[風格1,風格2,風格3]",
          imageCategory: image.selectedCategory || "類別",
          imageSource: image.imageSource || "(使用者自行填寫)",
          imageReleaseDate: image.createdAt?.slice(0, 10) || "0000-00-00",
          innerContextTitle: image.title || "請輸入文章標題...",
          innerContext: image.innerContext || "請輸入文章內文...",
          description: "這裡是圖片的描述內容，可以包含更多文本。",
          likes: image.likes || 0,
          comments: commentCount,
          shares: 0,
          isCollected: image.collectedBy?.includes(currentUser?.uid),
        });
        setIsModalOpen(true);
      }
    };

    mainImg.onload = checkAllLoaded;
    avatarImg.onload = checkAllLoaded;

    mainImg.src = exampleImageUrl;
    avatarImg.src = artistAvatarUrl;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentData(null);
  };

  const handleHeadingToProfile = async (e, image) => {
    const articleExist = await checkArticleExists(image.userUid, image.articleId);
    if (!articleExist) {
      addToast("error", "sorry 該文章已被原作者刪除");
      fetchPainterArticles();
      return;
    }

    e.stopPropagation();
    navigate(`/artworkProfile/artworkPainterProfile/${image.userUid}`);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleToggleLike = async (e, image) => {
    e.stopPropagation();

    const articleExist = await checkArticleExists(image.userUid, image.articleId);
    if (!articleExist) {
      addToast("error", "sorry 該文章已被原作者刪除");
      fetchPainterArticles();
      return;
    }

    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔！");
      return;
    }

    try {
      const response = await toggleArticleLike(image.userUid, image.articleId, currentUser.uid);
      if (response.success) {
        const hasLiked = likedMap[image.articleId];
        if (isCollectionPage) onCollected(image.articleId);
        setLikeStates((prev) => ({
          ...prev,
          [image.articleId]: !hasLiked,
        }));
      }
    } catch (err) {
      console.error("按讚失敗", err);
      addToast("error", "按讚失敗，請稍後再試！");
    }
  };

  const handleToggleCollect = async (e, image) => {
    e.stopPropagation();

    const articleExist = await checkArticleExists(image.userUid, image.articleId);
    if (!articleExist) {
      addToast("error", "sorry 該文章已被原作者刪除");
      fetchPainterArticles();
      return;
    }

    if (!currentUser) {
      addToast("error", "請先登入才能收藏喔！");
      return;
    }

    try {
      const response = await toggleArticleCollect(image.userUid, image.articleId, currentUser.uid);
      if (response.success) {
        const hasCollected = collectedMap[image.articleId];
        if (isCollectionPage) onCollected(image.articleId);
        setCollectedStates((prev) => ({
          ...prev,
          [image.articleId]: !hasCollected,
        }));
      }
    } catch (err) {
      console.error("珍藏失敗", err);
      addToast("error", "珍藏失敗，請稍後再試！");
    }
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="MasonryArtCommunity-grid"
        columnClassName="MasonryArtCommunity-grid-column"
      >
        {images.map((image, index) => {
          const user = allUsers[image.userUid] || {};
          const isLiked = likeStates[image.articleId] ?? likedMap[image.articleId];
          const isCollected = collectedStates[image.articleId] ?? collectedMap[image.articleId];

          return (
            <div key={index} className="MasonryArtCommunity-grid-item">
              <img
                src={image.exampleImageUrl}
                alt={`Artwork ${index + 1}`}
                className="MasonryArtCommunity-grid-item-image"
                onClick={() => handleImageClick(image)}
                style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
              />

              {isPreloaded && isMasonryReady && imageLoaded[image.portfolioId] && image.exampleImageUrl && (
                <>
                  <div
                    className="MasonryArtCommunity-collectionIcon-container"
                    onClick={(e) => handleToggleCollect(e, image)}
                  >
                    <img
                      src={isCollected ? "/images/icons8-bookmark-96-6.png" : "/images/icons8-bookmark-96-4.png"}
                      alt="collectionIcon"
                    />
                  </div>

                  <span className="MasonryArtCommunity-artwork-title">
                    {image.title?.slice(0, 12) || "這是標題最多放12個字..."}
                  </span>

                  <div className="MasonryArtCommunity-content-container">
                    <div className="MasonryArtCommunity-artistInfo-container">
                      <img
                        src={user.profileAvatar || "/images/testing-artist-profile-image.png"}
                        alt="artistAvatar"
                        onClick={(e) => handleHeadingToProfile(e, image)}
                      />
                      <span className="MasonryArtCommunity-artistName">{user.nickname || "使用者名稱"}</span>
                    </div>

                    <div
                      className="MasonryArtCommunity-likesIcon-container"
                      onClick={(e) => handleToggleLike(e, image)}
                    >
                      <img
                        src={isLiked ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-26.png"}
                        alt="numberOfLikes"
                      />
                      <span className="MasonryArtCommunity-likes-number">{image.likes || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </Masonry>

      <ModalImgArtCommunity isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </>
  );
};

export default MasonryArtCommunity;
