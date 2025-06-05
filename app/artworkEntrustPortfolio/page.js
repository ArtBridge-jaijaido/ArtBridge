// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { notoSansTCClass } from '@/app/layout.js';
// import { useSelector } from "react-redux";
// import ArtworkEntrustSetTab2 from "@/components/ArtworkEntrustSetTab/ArtworkEntrustSetTab2.jsx";
// import EntrustPortfolioMasonryGrid from "@/components/Masonry/EntrustPortfolioMasonryGrid.jsx";
// import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
// import "./artworkEntrustPortfolio.css";

// const ArtworkEntrustPortfolioPage = () => {
//     const [masonryVisibleItems, setMasonryVisibleItems] = useState(20);
//     const { user } = useSelector((state) => state.user);
//     const { entrustPortfolios, loading } = useSelector((state) => state.entrustPortfolio);

//     const userPortfolios = user?.uid
//         ? entrustPortfolios.filter(
//             (portfolio) => portfolio.userUid === user.uid && portfolio.type === "entrust"
//         )
//         : [];

//     const { setIsImageLoading, setIsEmpty } = useImageLoading();
//     const [isMasonryReady, setIsMasonryReady] = useState(false);
//     const masonryTotalItems = userPortfolios.length;
//     const currentImages = userPortfolios.slice(0, masonryVisibleItems);

//     const isDataFetched = useRef(false);
//     useEffect(() => {
//         if (!isDataFetched.current) {
//             setIsImageLoading(true);
//             setIsMasonryReady(false);

//             const delayCheck = setTimeout(() => {
//                 if (!loading) {
//                     if (userPortfolios.length === 0) {
//                         console.log("📭 empty");
//                         setIsEmpty(true);
//                     } else {
//                         console.log("📦 not empty");
//                         setIsEmpty(false);
//                     }
//                     isDataFetched.current = true;
//                 }
//             }, 500);

//             return () => {
//                 clearTimeout(delayCheck);
//                 setIsImageLoading(false);
//             };
//         }
//     }, [loading]);

//     const handleMasonryReady = () => {
//         setTimeout(() => {
//             setIsImageLoading(false);
//             setIsMasonryReady(true);
//         }, 300);
//     };

//     const tabs = [
//         {
//             label: "全部合作",
//             content: (
//               <>
//               {console.log("🧱 tabs render check", currentImages)}
//                 <div className="artworkEntrustPortfolio-tab-wrapper">
//                     <div className="artworkEntrustPortfolio-masonryGrid-container">
//                         {isDataFetched.current && userPortfolios.length === 0 ? (
//                             <p className="no-portfolio-message">目前還沒有任何合作作品喔 !</p>
//                         ) : !loading && (
//                             <EntrustPortfolioMasonryGrid
//                                 images={currentImages}
//                                 onMasonryReady={handleMasonryReady}
//                                 isMasonryReady={isMasonryReady}
//                             />
//                         )}
//                     </div>

//                     {masonryVisibleItems < masonryTotalItems && (
//                         <button
//                             onClick={() => setMasonryVisibleItems((prev) => prev + 10)}
//                             className="artworkEntrustPortfolio-show-more-button"
//                             style={{ gridColumn: "span 5", marginTop: "20px" }}
//                         >
//                             顯示更多
//                         </button>
//                     )}
//                 </div>
//               </>
//             ),
//         },
//     ];

//     return (
//         <div className={`artworkEntrustPortfolio-page ${notoSansTCClass}`}>
//             <div className="artworkEntrustPortfolio-setTab-container">
//                 <ArtworkEntrustSetTab2 tabs={tabs} />
//             </div>
//         </div>
//     );
// };

// export default ArtworkEntrustPortfolioPage;

"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { useSelector } from "react-redux";
import ArtworkEntrustSetTab2 from "@/components/ArtworkEntrustSetTab/ArtworkEntrustSetTab2.jsx";
import EntrustPortfolioMasonryGrid from "@/components/Masonry/EntrustPortfolioMasonryGrid.js";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";
import "./artworkEntrustPortfolio.css";

const ArtworkEntrustPortfolioPage = () => {
    const [masonryVisibleItems, setMasonryVisibleItems] = useState(20);
    const { user } = useSelector((state) => state.user);
    const { entrustPortfolios, loading } = useSelector((state) => state.entrustPortfolio);
    const { setIsImageLoading, setIsEmpty } = useImageLoading();
    const [isMasonryReady, setIsMasonryReady] = useState(false);
    const isDataFetched = useRef(false);

    // ✅ 透過 useMemo 避免每次 render 重新 filter
    const userPortfolios = useMemo(() => {
        return user?.uid
            ? entrustPortfolios.filter(
                (portfolio) => portfolio.userUid === user.uid && portfolio.type === "entrust"
            )
            : [];
    }, [user?.uid, entrustPortfolios]);

    const masonryTotalItems = userPortfolios.length;
    const currentImages = useMemo(() => {
        return userPortfolios.slice(0, masonryVisibleItems);
    }, [userPortfolios, masonryVisibleItems]);

    useEffect(() => {
        if (!isDataFetched.current) {
            setIsImageLoading(true);
            setIsMasonryReady(false);

            const delayCheck = setTimeout(() => {
                if (!loading) {
                    if (userPortfolios.length === 0) {
                        console.log("📭 empty");
                        setIsEmpty(true);
                    } else {
                        console.log("📦 not empty");
                        setIsEmpty(false);
                    }
                    isDataFetched.current = true;
                }
            }, 500);

            return () => {
                clearTimeout(delayCheck);
                setIsImageLoading(false);
            };
        }
    }, [loading, userPortfolios, setIsImageLoading, setIsEmpty]);

    const handleMasonryReady = () => {
        setTimeout(() => {
            setIsImageLoading(false);
            setIsMasonryReady(true);
        }, 300);
    };

    // ✅ 加上完整 log
    console.log("🧱 loading:", loading);
    console.log("🧱 isDataFetched:", isDataFetched.current);
    console.log("🧱 userPortfolios:", userPortfolios);
    console.log("🧱 currentImages:", currentImages);

    const tabs = [
        {
            label: "全部合作",
            content: (
                <div className="artworkEntrustPortfolio-tab-wrapper">
                    <div className="artworkEntrustPortfolio-masonryGrid-container">
                        {isDataFetched.current && userPortfolios.length === 0 ? (
                            <p className="no-portfolio-message">目前還沒有任何合作作品喔 !</p>
                        ) : !loading && currentImages.length > 0 && (
                          <>
                          {console.log("✅ trigger grid")}
                            <EntrustPortfolioMasonryGrid
                                images={currentImages}
                                onMasonryReady={handleMasonryReady}
                                isMasonryReady={isMasonryReady}
                            />
                           </>
                        )}
                    </div>

                    {masonryVisibleItems < masonryTotalItems && (
                        <button
                            onClick={() => setMasonryVisibleItems((prev) => prev + 10)}
                            className="artworkEntrustPortfolio-show-more-button"
                            style={{ gridColumn: "span 5", marginTop: "20px" }}
                        >
                            顯示更多
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={`artworkEntrustPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkEntrustPortfolio-setTab-container">
                <ArtworkEntrustSetTab2 tabs={tabs} />
            </div>
        </div>
    );
};

export default ArtworkEntrustPortfolioPage;
