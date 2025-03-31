"use client";

import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import ModalImgArtCommunity from "@/components/ModalImage/ModalImgArtCommunity.jsx";
import { getCommentCount } from "@/services/articleCommentService.js";
import { checkArticleExists, toggleArticleLike } from "@/services/artworkArticleService";
import { fetchPainterArticles } from '@/lib/painterArticleListener';
import { useToast } from "@/app/contexts/ToastContext.js";
import "./MasonryArtCommunity.css";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useSelector } from "react-redux";


const MasonryArtCommunity = ({ images, onMasonryReady, isMasonryReady, isPreloaded, setIsPreloaded }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigation();
  const { setIsLoading } = useLoading();
  const [likeStates, setLikeStates] = useState({});
  const currentUser = useSelector((state) => state.user.user);

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
    const totalImages = images.length * 2; // 每個 image 有兩張圖要載入

    images.forEach((image) => {
      const exampleImg = new Image();
      const avatarImg = new Image();

      const exampleUrl = image.exampleImageUrl;
      const avatarUrl = image.artistProfileImg || "/images/testing-artist-profile-image.png";

      // 同步更新載入狀態
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

      // 一次性標記為這組圖片已進入 preload 階段（不影響 loading 判斷）
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

    handleResize(); // 先執行一次
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBreakpoint]);



  const handleImageClick = async (image) => {

    const articleExist = await checkArticleExists(image.userUid, image.articleId);

    if (!articleExist) {
      addToast("error", "sorry 該文章已被原作者刪除");
      fetchPainterArticles();
      return;
    }


    // ✅ 先重置
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
        setCurrentData({
          src: exampleImageUrl,
          author: image.artistNickName || "使用者名稱",
          articleId: image.articleId || "文章ID",
          userUid: image.userUid || "使用者ID",
          authorAvatar: artistAvatarUrl,
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
        });
        setIsModalOpen(true); // ✅ 全部圖片都載入後才開
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

  const handleHeadingToProfile = (e, userUid) => {
    e.stopPropagation();
    navigate(`/artworkProfile/artworkPainterProfile/${userUid}`);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }


  /*按讚功能*/
  const handleToggleLike = async (e, image) => {
    e.stopPropagation();
  
    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔！");
      return;
    }
  
    try {
      const response = await toggleArticleLike(image.userUid, image.articleId, currentUser.uid);
  
      if (response.success) {
        const hasLiked = image.likedBy?.includes(currentUser.uid);
  
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
  

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="MasonryArtCommunity-grid"
        columnClassName="MasonryArtCommunity-grid-column"
      >
        {images.map((image, index) => (
          <div key={index} className="MasonryArtCommunity-grid-item">
            <img
              src={image.exampleImageUrl}
              alt={`Artwork ${index + 1}`}
              className="MasonryArtCommunity-grid-item-image"
              onClick={() => handleImageClick(image)}
              style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
            />

            {/*只有當圖片載入後才顯示下面內容*/}
            {isPreloaded && isMasonryReady && imageLoaded[image.portfolioId] && image.exampleImageUrl && (
              <>
                <span className="MasonryArtCommunity-artwork-title">
                  {image.title?.slice(0, 12) || "這是標題最多放12個字..."}
                </span>
                <div className="MasonryArtCommunity-content-container">
                  <div className="MasonryArtCommunity-artistInfo-container">

                    <img src={image.artistProfileImg || "/images/testing-artist-profile-image.png"} alt="artistAvatar" onClick={(e) => handleHeadingToProfile(e, image.userUid)} />
                    <span className="MasonryArtCommunity-artistName">{image.artistNickName || "使用者名稱"}</span>
                  </div>
                  <div
                    className="MasonryArtCommunity-likesIcon-container"
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
                    <span className="MasonryArtCommunity-likes-number">{image.likes || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </Masonry>

      <ModalImgArtCommunity isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </>
  );
};

export default MasonryArtCommunity;
