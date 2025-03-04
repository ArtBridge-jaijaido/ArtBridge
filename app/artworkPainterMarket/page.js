"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterSetTab from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab.jsx";
import ArtworkPainterMarketCard from "@/components/ArtworkPainterMarketCard/ArtworkPainterMarketCard.jsx";
import { fetchUserArtworks } from "@/services/artworkMarketService";
import "./artworkPainterMarket.css";

const ArtworkPainterMarketPage = () => {
    const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 上架中「顯示更多」計數
    const [historyCardVisibleItems, setHistoryCardVisibleItems] = useState(10); // 歷史市集「顯示更多」計數
    const { user } = useSelector((state) => state.user);
    const [activeArtworks, setActiveArtworks] = useState([]);
    const [historyArtworks, setHistoryArtworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
           
            loadUserArtworks(user.uid);
        }
    }, [user?.uid]);

    const loadUserArtworks = async (userUid) => {
        setIsLoading(true);
        const fetchedArtworks = await fetchUserArtworks(userUid);

        // 當前日期（設為 00:00:00 確保正確比較）
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // 區分「上架中」和「歷史市集」
        const active = [];
        const history = [];

        fetchedArtworks.forEach((artwork) => {
            const startDate = new Date(artwork.startDate);
            const endDate = new Date(artwork.endDate);

            if (currentDate <= endDate) {
                active.push(artwork); // 上架中
            } else {
                history.push(artwork); // 歷史市集
            }
        });

        setActiveArtworks(active);
        setHistoryArtworks(history);
        setIsLoading(false);
    };

    const tabs = [
        {
            label: "上架中",
            content: (
                <div className="artworkPainterMarket-tab-wrapper">
                    {isLoading ? (
                        <p></p>
                    ) : activeArtworks.length > 0 ? (
                        <div className="artworkPainterMarket-marketCard-container">
                            {activeArtworks.slice(0, artworkCardVisibleItems).map((artwork) => (
                                <ArtworkPainterMarketCard
                                    key={artwork.artworkId}
                                    imageSrc={artwork.exampleImageUrl || "/images/default-image.png"}
                                    title={artwork.marketName}
                                    price={artwork.price}
                                />
                            ))}
                            {artworkCardVisibleItems < activeArtworks.length && (
                                <button onClick={() => setArtworkCardVisibleItems((prev) => prev + 10)} className="artworkPainterMarket-show-more-button">
                                    顯示更多
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>目前沒有上架中的作品。</p>
                    )}
                </div>
            ),
        },
        {
            label: "歷史市集",
            content: (
                <div className="artworkPainterMarket-tab-wrapper">
                    {isLoading ? (
                        <p>載入中...</p>
                    ) : historyArtworks.length > 0 ? (
                        <div className="artworkPainterMarket-marketCard-container">
                            {historyArtworks.slice(0, historyCardVisibleItems).map((artwork) => (
                                <ArtworkPainterMarketCard
                                    key={artwork.artworkId}
                                    imageSrc={artwork.exampleImageUrl || "/images/default-image.png"}
                                    title={artwork.marketName}
                                    price={artwork.price}
                                    isHistoryTab={true}
                                />
                            ))}
                            {historyCardVisibleItems < historyArtworks.length && (
                                <button onClick={() => setHistoryCardVisibleItems((prev) => prev + 10)} className="artworkPainterMarket-show-more-button">
                                    顯示更多
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>目前沒有歷史市集的作品。</p>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={`artworkPainterMarket-page ${notoSansTCClass}`}>
            <div className="artworkPainterMarket-setTab-container">
                <ArtworkPainterSetTab tabs={tabs} />
            </div>
        </div>
    );
};

export default ArtworkPainterMarketPage;
