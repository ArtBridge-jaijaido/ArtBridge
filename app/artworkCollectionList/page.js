"use client";
import React, { useState, useEffect, useCallback} from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkCollectionListTab from "@/components/Tabs/ArtworkCollectionListTab.jsx";
import { fetchLikedArtworksByUser } from "@/services/artworkMarketService.js";
import { fetchLikedPortfoliosByUser } from "@/services/artworkPortfolioService.js";
import { fetchCollectedArticlesByUser } from "@/services/artworkArticleService";
import { useSelector } from "react-redux";
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard.jsx";
import ShowMoreList from "@/components/ShowMoreList/ShowMoreList";
import MasonryArtCommunity from '@/components/Masonry/MasonryArtCommunity.js';
import ArtworkPainterMasonryGrid from "@/components/ArtworkPainterMasonryGrid/ArtworkPainterMasonryGrid.js";
import "./artworkCollectionList.css";


const ArtworkCollectionListPage = () => {

  const currentUser = useSelector((state) => state.user.user);

  /*按讚市集*/
  const [likedArtworks, setLikedArtworks] = useState([]);
  const allUsers = useSelector((state) => state.user.allUsers);
  const refreshLikedArtworks = useCallback(async () => {
    if (!currentUser?.uid) return;
    const res = await fetchLikedArtworksByUser(currentUser.uid);
    if (res.success) {
      setLikedArtworks(res.data);
    }
  }, [currentUser]);



  /*按讚作品*/
  const [likedPortfolios, setLikedPortfolios] = useState([]);
  const [isLikedPortfolioLoaded, setIsLikedPortfolioLoaded] = useState(false);
  const refreshLikedPortfolios = useCallback(async () => {
    if (!currentUser?.uid) return;
    const res = await fetchLikedPortfoliosByUser(currentUser.uid);
    if (res.success) {
      setLikedPortfolios(res.data);
    }
  }, [currentUser]);



  /*收藏文章*/
  const [collectedArticles, setCollectedArticles] = useState([]);
  const [isCollectedArticlesLoaded, setIsCollectedArticlesLoaded] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isArticleMasonryReady, setIsArticleMasonryReady] = useState(false);

  const refreshLikedArticles = useCallback(async () => {
    if (!currentUser?.uid) return;
    const res = await fetchCollectedArticlesByUser(currentUser.uid);
    if (res.success) {
      setCollectedArticles(res.data);
    }
  }, [currentUser]);

  const handleArticleMasonryReady = () => {
    setTimeout(() => {
      setIsArticleMasonryReady(true);
    }, 300);
  };

  useEffect(() => {
    const fetchUserLikedData = async () => {
      if (!currentUser || !currentUser.uid) return;

      try {
        const [artworkRes, portfolioRes, articleRes] = await Promise.all([
          fetchLikedArtworksByUser(currentUser.uid),
          fetchLikedPortfoliosByUser(currentUser.uid),
          fetchCollectedArticlesByUser(currentUser.uid)
        ]);

        if (artworkRes.success) {
          setLikedArtworks(artworkRes.data);
        } else {
          console.error("按讚市集錯誤：", artworkRes.message);
        }

        if (portfolioRes.success) {
          setLikedPortfolios(portfolioRes.data);
        } else {
          console.error("按讚作品錯誤：", portfolioRes.message);
        }

        if (articleRes.success) {
          setCollectedArticles(articleRes.data);
        }
        else {
          console.error("收藏文章錯誤：", articleRes.message);
        }

        setIsLikedPortfolioLoaded(true); // 
        setIsCollectedArticlesLoaded(true); //
      } catch (err) {
        console.error("載入按讚收藏資料失敗：", err);
      }
    };

    fetchUserLikedData();
  }, [currentUser]);




  const tabs = [
    {
      label: "按讚作品",
      content: (
        <ShowMoreList
          items={likedPortfolios}
          wrapperClassName="artworkCollectionList-portfolio-container"
          renderBatch={(visiblePortfolios) => (
            !isLikedPortfolioLoaded ? (
              <p className="artworkCollectionList-loading">圖片載入中...</p>
            ) : visiblePortfolios.length === 0 ? (
              <div className="artworkCollectionList-noData">目前沒有按讚的作品</div>
            ) : (
              <ArtworkPainterMasonryGrid 
              images={visiblePortfolios} 
              onUnlike={refreshLikedPortfolios}
              />
            )
          )}
        />
      )
    }
    ,
    {
      label: "貼文珍藏",
      content: (
        <ShowMoreList
          items={collectedArticles}
          wrapperClassName="artworkCollectionList-article-container"
          renderBatch={(visibleArticles) => (
            <>
              <div style={{ visibility: isArticleMasonryReady ? "visible" : "hidden" }}>
                <MasonryArtCommunity
                  images={visibleArticles}
                  isPreloaded={isPreloaded}
                  setIsPreloaded={setIsPreloaded}
                  isMasonryReady={isArticleMasonryReady}
                  onMasonryReady={handleArticleMasonryReady}
                  onUnlike={refreshLikedArticles}
                />
              </div>
              {!isArticleMasonryReady&&collectedArticles.length !==0? (
                <p className="artworkCollectionList-community-loading" style={{ position: 'absolute', top: 10 }}>
                  文章載入中...
                </p>
              ) : collectedArticles.length === 0 ? (
                <div className="artworkCollectionList-noData" style={{ position: 'absolute', top: 10 }}>
                  目前沒有收藏的文章
                </div>
              ) : null}

            </>
          )}
        />
      )
    },

    {
      label: "按讚市集",
      content: likedArtworks.length === 0 ? (
        <div className="artworkCollectionList-noData">目前沒有按讚的市集</div>
      ) : (
        <ShowMoreList
          items={likedArtworks}
          wrapperClassName="artworkCollectionList-artworkCard-container"
          renderItem={(artwork) => {
            const user = allUsers[artwork.userUid] || {};
            return (
              <ArtworkCard
                key={artwork.id}
                imageSrc={artwork.exampleImageUrl}
                title={artwork.marketName}
                price={artwork.price}
                artistProfileImg={user.profileAvatar || "/images/kv-min-4.png"}
                artistNickName={user.nickname || "使用者名稱"}
                artistUid={artwork.userUid}
                artworkId={artwork.artworkId}
                likedby={artwork.likedBy || []}
                onUnlike={refreshLikedArtworks}
              />
            );
          }}
        />
      )
    }
  ]



  return (
    <div className={`artworkCollectionListPage ${notoSansTCClass}`} >
      <div className="artworkCollectionList-tab-container">
        < ArtworkCollectionListTab tabs={tabs} />
      </div>
    </div>
  )

};


export default ArtworkCollectionListPage;