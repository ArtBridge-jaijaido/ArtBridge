"use client";   
import React, { useState, useEffect, useRef} from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterArticleTab from "@/components/ArtworkPainterSetTab/ArtworkPainterArticleTab.jsx";
import "./artworkPainterArticle.css";

const ArtworkPainterArticlePage = () =>{
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20); // 作品集預設顯示數量
    const masonryTotalItems = 20;
    const tabs = [
        {
            label: "全部文章",
            content: <div className="artworkPainterArticle-tab-wrapper">
                <div className="artworkPainterArticle-masonryGrid-container">
                    <p>目前還沒有任何作品喔!</p>
                </div>


                     {masonryVisibleItems < masonryTotalItems && (
                        <button onClick={() => setMasonryVisibleItems(prev => prev + 10)} className="artworkPainterArticle-show-more-button" style={{gridColumn: "span 5", marginTop: "20px"}}>
                            顯示更多
                        </button>
                    )}
                 </div>,  
        }
    ]
   

    return(
        <div className={`artworkPainterArticle-page ${notoSansTCClass}`}>
        <div className="artworkPainterArticle-setTab-container">
            <ArtworkPainterArticleTab tabs={tabs} />
        </div>
    </div>
    )

}


export default ArtworkPainterArticlePage;