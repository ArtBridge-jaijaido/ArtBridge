"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterArticleTab from "@/components/ArtworkPainterSetTab/ArtworkPainterArticleTab.jsx";
import { useSelector } from "react-redux";
import PainterArticleMasonryGrid from "@/components/Masonry/PainterArticleMasonryGrid.js";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
import "./artworkPainterArticle.css";


const ArtworkPainterArticlePage = () => {
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20); // 文章預設顯示數量
    const { user } = useSelector((state) => state.user);
    const { painterArticles, loading } = useSelector((state) => state.painterArticle);

    // ** 過濾出當前使用者的文章 **
    const userArticles = user?.uid
        ? painterArticles.filter((article) => article.userUid === user.uid)
        : [];

    const { setIsImageLoading, setIsEmpty } = useImageLoading();
    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const masonryTotalItems = userArticles.length; // 總數
    const currentArticles = userArticles.slice(0, masonryVisibleItems);
    const isDataFetched = useRef(false);

  
    useEffect(() => {

        if (!isDataFetched.current) {
            setIsImageLoading(true);
            setIsMasonryReady(false);

            const delayCheck = setTimeout(() => {
                if (!loading) {
                    if (userArticles.length === 0) {
                        console.log("empty");
                        setIsEmpty(true);
                    } else {
                        console.log("not empty");
                        setIsEmpty(false);
                    }
                    isDataFetched.current = true; // ✅ 數據已加載，防止重複執行
                }
            }, 500);

            return () => {

                clearTimeout(delayCheck);
                setIsImageLoading(false);  // 關閉 Loading
            };
        }


    }, [loading]);

   



    // ✅ 當 Masonry 排列完成後，關閉 Loading
    const handleMasonryReady = () => {
        setTimeout(() => {
            setIsImageLoading(false);
            setIsMasonryReady(true);
        }, 300);
    };

    const tabs = [
        {
            label: "全部文章",
            content: (
                <div className="artworkPainterArticle-tab-wrapper">
                    <div className="artworkPainterArticle-masonryGrid-container">
                        {isDataFetched.current && userArticles.length === 0 ? (
                            <p className="no-article-message">目前還沒有任何文章喔 !</p>
                        ) : !loading && (
                            <PainterArticleMasonryGrid
                                images={currentArticles}
                                onMasonryReady={handleMasonryReady}
                                isMasonryReady={isMasonryReady}
                            />
                        )}
                    </div>

                    {masonryVisibleItems < masonryTotalItems && (
                        <button
                            onClick={() => setMasonryVisibleItems(prev => prev + 10)}
                            className="artworkPainterArticle-show-more-button"
                            style={{ gridColumn: "span 5", marginTop: "20px" }}
                        >
                            顯示更多
                        </button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className={`artworkPainterArticle-page ${notoSansTCClass}`}>
            <div className="artworkPainterArticle-setTab-container">
                <ArtworkPainterArticleTab tabs={tabs} />
            </div>
        </div>
    );
};

export default ArtworkPainterArticlePage;
