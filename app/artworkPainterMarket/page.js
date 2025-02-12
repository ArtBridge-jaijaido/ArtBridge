"use client";   
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterSetTab from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab.jsx";

import "./artworkPainterMarket.css";


const ArtworkPainterMarketPage = () => {

    const [artworkCardVisibleItems, setArtworkCardVisibleItems] = useState(10); // 市集
    const artworkCardTotalItems = 40;

    const tabs = [
        {
            label: "上架中",
            content: (<div className="ArtworkPainterMarket-Tab-wrapper">
                <div className="ArtworkPainterMarket-artworkCard-container">
                    {Array.from({ length: artworkCardTotalItems }).slice(0, artworkCardVisibleItems).map((_, index) => (
                        <ArtworkCard 
                            key={index}
                            imageSrc={"/images/testing-Arkwork-image-10.png"}
                            title={"商品標題(至多8字"}
                            price={"1500"}
                            artistProfileImg="profile.jpg"
                            artistNickName="Artist Name"
                            deadline={"截止日期:2025.01.02"}
                        /> 
                    ))}
                </div>
                    {artworkCardVisibleItems < artworkCardTotalItems && (
                        <button onClick={() => setArtworkCardVisibleItems(prev => prev + 10)} className="artworkPainter-show-more-button">
                            顯示更多
                        </button>
                    )}
             </div>),
        },
        {
            label: "歷史市集",
            content: (<div className="ArtworkPainterMarket-Tab-wrapper">
                <div className="ArtworkPainterMarket-artworkCard-container">
                    {Array.from({ length: artworkCardTotalItems }).slice(0, artworkCardVisibleItems).map((_, index) => (
                        <ArtworkCard 
                            key={index}
                            imageSrc={"/images/testing-Arkwork-image-10.png"}
                            title={"商品標題(至多8字"}
                            price={"1500"}
                            artistProfileImg="profile.jpg"
                            artistNickName="Artist Name"
                            deadline={"截止日期:2025.01.02"}
                        /> 
                    ))}
                </div>
                    {artworkCardVisibleItems < artworkCardTotalItems && (
                        <button onClick={() => setArtworkCardVisibleItems(prev => prev + 10)} className="artworkPainter-show-more-button">
                            顯示更多
                        </button>
                    )}
            </div>),
        },
    ]

    return(
        <div className={`artworkPainterMarketPage ${notoSansTCClass}`}>

            <div className="artworkPainterMarket-SetTab-container">
                <ArtworkPainterSetTab tabs={tabs} />
            </div>











        </div>
    )
}
export default ArtworkPainterMarketPage