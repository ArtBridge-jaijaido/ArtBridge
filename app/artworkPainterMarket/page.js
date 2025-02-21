"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterSetTab from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab.jsx";
import ArtworkPainterMarketCard from "@/components/ArtworkPainterMarketCard/ArtworkPainterMarketCard.jsx";
import { fetchUserArtworks } from "@/services/artworkMarketService";
import "./artworkPainterMarket.css";


const ArtworkPainterMarketPage = () => {

    const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 市集
    const artworkCardTotalItems = 40;
    const { user } = useSelector((state) => state.user);
    const [artworks, setArtworks] = useState([]);
    const [artworkCardHistoryItems, setArtworkCardHistoryItems] = useState(10); // 市集
    const artworkCardHistoryTotalItems = 20;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.userSerialId) {
            loadUserArtworks(user.userSerialId);
        }
    }, [user?.userSerialId]);

    const loadUserArtworks = async (userId) => {
        setIsLoading(true);
        const fetchedArtworks = await fetchUserArtworks(userId);
        setArtworks(fetchedArtworks);
        setIsLoading(false);
    };

    const tabs = [
        {
            label: "上架中",
            content: (
                <div className="artworkPainterMarket-tab-wrapper">
                    {isLoading ? (
                        <p>載入中...</p>
                    ) : (
                        <div className="artworkPainterMarket-marketCard-container">
                            {artworks.slice(0, artworkCardVisibleItems).map((artwork) => (
                                <ArtworkPainterMarketCard
                                    key={artwork.artworkId}
                                    imageSrc={artwork.exampleImageUrl || "/images/default-image.png"}
                                    title={artwork.marketName}
                                    price={artwork.price}
                                />
                            ))}
                        </div>
                    )}
                    {artworkCardVisibleItems < artworks.length && (
                        <button onClick={() => setVisibleItems((prev) => prev + 10)} className="artworkPainterMarket-show-more-button">
                            顯示更多
                        </button>
                    )}
                </div>
            ),
        },
        {
            label: "歷史市集",
            content: (<div className="artworkPainterMarket-tab-wrapper">
                <div className="artworkPainterMarket-marketCard-container">
                    {Array.from({ length: artworkCardHistoryTotalItems }).slice(0, artworkCardHistoryItems).map((_, index) => (
                        <ArtworkPainterMarketCard
                            key={index}
                            imageSrc={"/images/testing-Arkwork-image-11.png"}
                            title={"商品標題(至多8字"}
                            price={"1500"}
                            isHistoryTab={true}
                        />
                    ))}
                </div>
                {artworkCardHistoryItems < artworkCardHistoryTotalItems && (
                    <button onClick={() => setArtworkCardHistoryItems(prev => prev + 10)} className="artworkPainterMarket-show-more-button">
                        顯示更多
                    </button>
                )}
            </div>),
        },
    ]

    return (
        <div className={`artworkPainterMarket-page ${notoSansTCClass}`}>
            <div className="artworkPainterMarket-setTab-container">
                <ArtworkPainterSetTab tabs={tabs} />
            </div>
        </div>
    )
}
export default ArtworkPainterMarketPage