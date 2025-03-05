"use client";   
import React, { useState, useEffect } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { useSelector } from "react-redux";
import ArtworkPainterSetTab2 from "@/components/ArtworkPainterSetTab/ArtworkPainterSetTab2.jsx";
import PainterPortfolioMasonryGrid from "@/components/Masonry/PainterPortfolioMasonryGrid.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import "./artworkPainterPortfolio.css";


const ArtworkPainterPortfolioPage = () => {
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20); // 作品集預設顯示數量
    const { user } = useSelector((state) => state.user);
    const { painterPortfolios, loading } = useSelector((state) => state.painterPortfolio);

   
   
    // ** 過濾出當前使用者的 portfolio**
    const userPortfolios = user?.uid
    ? painterPortfolios.filter((portfolio) => portfolio.userUid === user.uid)
    : [];

    const masonryTotalItems = userPortfolios.length; // 總數
    const currentImages = userPortfolios.slice(0, masonryVisibleItems);
    
  

    const tabs = [
        {
            label: "全部作品",
            content: <div className="artworkPainterPortfolio-tab-wrapper">
                <div className="artworkPainterPortfolio-masonryGrid-container">
                    {!loading && userPortfolios.length === 0 ? (
                        <p className="no-portfolio-message">目前還沒有任何作品喔 !</p>
                    ) : !loading && (
                        <PainterPortfolioMasonryGrid images={currentImages} />
                    )}
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