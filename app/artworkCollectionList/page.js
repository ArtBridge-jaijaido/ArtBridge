"use client";
import React, { useState, useEffect } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkCollectionListTab from "@/components/Tabs/ArtworkCollectionListTab.jsx";
import { fetchLikedArtworksByUser } from "@/services/artworkMarketService.js";
import { fetchLikedPortfoliosByUser } from "@/services/artworkPortfolioService.js";
import { fetchCollectedArticlesByUser } from "@/services/artworkArticleService";
import { useSelector } from "react-redux";
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard.jsx";
import ShowMoreList from "@/components/ShowMoreList/ShowMoreList";
import ArtworkPainterMasonryGrid from "@/components/ArtworkPainterMasonryGrid/ArtworkPainterMasonryGrid.js";
import "./artworkCollectionList.css";


const ArtworkCollectionListPage = () => {

    const currentUser = useSelector((state) => state.user.user);

    /*按讚市集*/
    const [likedArtworks, setLikedArtworks] = useState([]);
    const allUsers = useSelector((state) => state.user.allUsers);


    /*按讚作品*/
    const [likedPortfolios, setLikedPortfolios] = useState([]);
    const [isLikedPortfolioLoaded, setIsLikedPortfolioLoaded] = useState(false);
  
    /*收藏文章*/
    const [collectedArticles, setCollectedArticles] = useState([]);
    const [isCollectedArticlesLoaded, setIsCollectedArticlesLoaded] = useState(false);

    useEffect(() => {
        const fetchUserLikedData = async () => {
            if (!currentUser || !currentUser.uid) return;

            try {
                const [artworkRes, portfolioRes,articleRes] = await Promise.all([
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

                setIsLikedPortfolioLoaded(true); // ✅ 設定已載入
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
                    <p className="ArtworkPainter-loading">載入中...</p>
                  ) : visiblePortfolios.length === 0 ? (
                    <div className="ArtworkPainter-noData">目前沒有按讚的作品</div>
                  ) : (
                    <ArtworkPainterMasonryGrid images={visiblePortfolios} />
                  )
                )}
              />
            )
          }
          ,
        {
            label: "貼文珍藏",
            content: <>貼文珍藏</>
        },

        {
            label: "按讚市集",
            content: likedArtworks.length === 0 ? (
              <div className="ArtworkPainter-noData">目前沒有按讚的市集</div>
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