"use client";   
import React, { useState} from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterSetTab2 from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab2.jsx";
import PainterPortfolioMasonryGrid from "@/components/Masonry/PainterPortfolioMasonryGrid.js";
import "./artworkPainterPortfolio.css";


const ArtworkPainterPortfolioPage = () => {
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20); // 作品集預設顯示數量
    const testingImages = [
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-7.png",
        "images/testing-Arkwork-image-1.png",
        "images/testing-Arkwork-image-8.png",
        "images/testing-Arkwork-image-7.png",
        "images/testing-Arkwork-image-1.png",
        "images/testing-Arkwork-image-5.png",
        "images/testing-Arkwork-image-6.png",
        "images/testing-Arkwork-image-2.png",
        "images/testing-Arkwork-image-4.png",
        "images/testing-Arkwork-image-3.png",
        "images/testing-Arkwork-image-7.png",
        "images/testing-Arkwork-image-1.png",
        "images/testing-Arkwork-image-8.png",
        "images/testing-Arkwork-image-7.png",
        "images/testing-Arkwork-image-1.png"
    ];
    const masonryTotalItems = testingImages.length; // 總數
    const currentImages = testingImages.slice(0, masonryVisibleItems);
    

    const tabs = [
        {
            label: "全部作品",
            content: <div className="artworkPainterPortfolio-tab-wrapper">
                <div className="artworkPainterPortfolio-masonryGrid-container">
                     <PainterPortfolioMasonryGrid images={currentImages}/>
                    </div>

                     {masonryVisibleItems < masonryTotalItems && (
                        <button onClick={() => setMasonryVisibleItems(prev => prev + 10)} className="artworkPainterPortfolio-show-more-button" style={{gridColumn: "span 5", marginTop: "20px"}}>
                            顯示更多
                        </button>
                    )}
                 </div>,  
        }
    ]

    return(
        <div className={`artworkPainterPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkPainterPortfolio-setTab-container">
                <ArtworkPainterSetTab2 tabs={tabs} />
            </div>
        </div>
    )
}
export default ArtworkPainterPortfolioPage