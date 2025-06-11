"use client";   
import React, { useState, useEffect, useRef} from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { useSelector } from "react-redux";
import ArtworkEntrustSetTab2 from "@/components/ArtworkEntrustSetTab/ArtworkEntrustSetTab2.jsx";
import EntrustPortfolioMasonryGrid from "@/components/Masonry/EntrustPortfolioMasonryGrid.js";
import {useImageLoading} from "@/app/contexts/ImageLoadingContext.js";
import "./artworkEntrustPortfolio.css";


const ArtworkEntrustPortfolioPage = () => {
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20); // 作品集預設顯示數量
    const { user } = useSelector((state) => state.user);
    const { entrustPortfolios, loading } = useSelector((state) => state.entrustPortfolio);
    
   
    // ** 過濾出當前使用者的 portfolio**
    const userPortfolios = user?.uid
    ? entrustPortfolios.filter((portfolio) => portfolio.userUid === user.uid )
    : [];

    const { setIsImageLoading, setIsEmpty } = useImageLoading();
    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const masonryTotalItems = userPortfolios.length; // 總數
    const currentImages = userPortfolios.slice(0, masonryVisibleItems);

    const isDataFetched = useRef(false);
    useEffect(() => {
        
        if (!isDataFetched.current) {
            setIsImageLoading(true);
            setIsMasonryReady(false);
    
            const delayCheck = setTimeout(() => {
                if (!loading) {
                    if (userPortfolios.length === 0) {
                        console.log("empty");
                        setIsEmpty(true);
                    } else {
                        console.log("not empty");
                        setIsEmpty(false);
                    }
                    isDataFetched.current = true; // 數據已加載，防止重複執行
                }
            }, 500);
    
            return () => {
                clearTimeout(delayCheck);
                setIsImageLoading(false);  //  關閉 Loading
            };
        }

       
       
    }, [loading]);  
    
   
    
     
   

    // 當 Masonry 排列完成後，關閉 Loading
    const handleMasonryReady = () => {
        setTimeout(() => {
            setIsImageLoading(false);
            setIsMasonryReady(true);
        }, 300);

       
    };
    

   


    const tabs = [
        {
            label: "全部作品",
            content: <div className="artworkEntrustPortfolio-tab-wrapper">
                <div className="artworkEntrustPortfolio-masonryGrid-container">
                    {isDataFetched.current && userPortfolios.length === 0 ? (
                        <p className="no-portfolio-message">目前還沒有任何作品喔 !</p>
                    ) : !loading && (
                        <EntrustPortfolioMasonryGrid 
                        images={currentImages} 
                        onMasonryReady={handleMasonryReady} 
                        isMasonryReady={isMasonryReady} />
                    )}
                </div>


                     {masonryVisibleItems < masonryTotalItems && (
                        <button onClick={() => setMasonryVisibleItems(prev => prev + 10)} className="artworkEntrustPortfolio-show-more-button" style={{gridColumn: "span 5", marginTop: "20px"}}>
                            顯示更多
                        </button>
                    )}
                 </div>,  
        }
    ]

    return(
        <div className={`artworkEntrustPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkEntrustPortfolio-setTab-container">
                <ArtworkEntrustSetTab2 tabs={tabs} />
            </div>
        </div>
    )
}
export default ArtworkEntrustPortfolioPage