"use client";   
import React, { useState} from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterSetTab from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab.jsx";
import ArtworkPainterMarketCard from "@/components/ArtworkPainterMarketCard/ArtworkPainterMarketCard.jsx";
import "./artworkPainterMarket.css";


const ArtworkPainterMarketPage = () => {

    const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 市集
    const artworkCardTotalItems = 40;

    const [artworkCardHistoryItems, setArtworkCardHistoryItems] = useState(10); // 市集
    const artworkCardHistoryTotalItems = 20;

    const tabs = [
        {
            label: "上架中",
            content: (<div className="artworkPainterMarket-tab-wrapper">
                <div className="artworkPainterMarket-marketCard-container">
                    {Array.from({ length: artworkCardTotalItems }).slice(0, artworkCardVisibleItems).map((_, index) => (
                        <ArtworkPainterMarketCard 
                            key={index}
                            imageSrc={"/images/testing-Arkwork-image-9.png"}
                            title={"商品標題(至多8字"}
                            price={"1500"}
                        /> 
                    ))}
                </div>
                    {artworkCardVisibleItems < artworkCardTotalItems && (
                        <button onClick={() => setArtworkCardVisibleItems(prev => prev + 10)} className="artworkPainterMarket-show-more-button">
                            顯示更多
                        </button>
                    )}
             </div>),
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

    return(
        <div className={`artworkPainterMarket-page ${notoSansTCClass}`}>
            <div className="artworkPainterMarket-setTab-container">
                <ArtworkPainterSetTab tabs={tabs} />
            </div>
        </div>
    )
}
export default ArtworkPainterMarketPage