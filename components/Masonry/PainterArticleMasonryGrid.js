"use client";
import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import ModalImageArticle from "@/components/ModalImage/ModalImageArticle.jsx";
import "./PainterArticleMasonryGrid.css";
import {deleteArticle} from '@/services/artworkArticleService.js';
import {useDispatch} from 'react-redux';
import {deletePainterArticle} from '@/app/redux/feature/painterArticleSlice.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import { useImageLoading } from "@/app/contexts/ImageLoadingContext.js";



const PainterArticleMasonryGrid = ({ images, onMasonryReady, isMasonryReady }) => {
    const [imageLoaded, setImageLoaded] = useState({});
    const [isPreloaded, setIsPreloaded] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState(null);
    const { setIsImageLoading } = useImageLoading();
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const breakpointColumns = {
        default: 5, // 桌機最多 5 欄
        1280: 5,
        834: 4,
        440: 2,
    };

    const getCurrentBreakpoint = () => {
        const width = window.innerWidth;
        let matchedBreakpoint = "default"; // 預設最大值

        Object.keys(breakpointColumns).forEach((bp) => {
            if (width <= parseInt(bp)) {
                matchedBreakpoint = bp;
            }
        });

        return matchedBreakpoint;
    };


    useEffect(() => {

        if (!images || images.length === 0) return; // 確保 images 存在

        // 只有當 images 數量變動時才重置 isPreloaded
        if (isPreloaded && images.length === Object.keys(imageLoaded).length) return;

        setIsPreloaded(false);
        setImageLoaded({}); // 重置圖片載入狀態
       

        let loadedCount = 0;
        images.forEach((image) => {
            const img = new Image();
            img.src = image.exampleImageUrl;
            img.onload = () => {
                loadedCount++;
                setImageLoaded((prev) => ({
                    ...prev,
                    [image.articleId]: true,
                }));

                if (loadedCount === images.length) {
                    setIsPreloaded(true);
                    onMasonryReady();
                    
                }
            };
        });

      
    }, [images]);

    useEffect(() => {
        const handleResize = () => {
            const newBreakpoint = getCurrentBreakpoint();
            if (newBreakpoint !== currentBreakpoint) {
                setCurrentBreakpoint(newBreakpoint);
            }
        };

        handleResize(); // 先執行一次
        window.addEventListener("resize", handleResize);

        return () => {
      

            window.removeEventListener("resize", handleResize);
        };

    }, [currentBreakpoint]);

    const handleDelete = async (article, e) => {
        e.stopPropagation(); // 防止點擊事件冒泡到其他元素
    
        const confirmDelete = window.confirm(`確定要刪除文章「${article.title}」嗎？`);
        if (!confirmDelete) return;
    
        try {
            const response = await deleteArticle(article.userUid, article.userId, article.articleId);
    
            if (response.success) {
                dispatch(deletePainterArticle(article.articleId)); // ✅ 透過 Redux 更新 UI
            } else {
                addToast("error", "刪除失敗，請稍後再試");
            }
        } catch (error) {
            addToast("error", "刪除失敗，請稍後再試");
        }
    };

    const handleArticleClick = (article) => {
        if (!article || !article.blurredImageUrl) return;

        // 先確保 blur image 先載入
        const img = new Image();
        img.src = article.blurredImageUrl;
        img.onload = () => {
           
            setCurrentData(article);
            setIsModalOpen(true);
        };
    };

    const closeModal = () =>{
        setIsModalOpen(false);
        setCurrentData(null);
    }



    return isPreloaded ? (
        <>
        <Masonry
            breakpointCols={breakpointColumns}
            className="painterArticle-masonry-grid"
            columnClassName="painterArticle-masonry-column"
        >
            {images.map((image, index) => ( /*這邊的image 是 article*/
                <div key={index} className="painterArticle-masonry-grid-item">
                    <img
                        src={image.exampleImageUrl} 
                        alt={`Artwork ${index + 1}`}
                        style={{ visibility: isMasonryReady ? "visible" : "hidden" }}
                        onClick={() => handleArticleClick(image)}
                    />

                    {/* 只有當圖片載入後才顯示按鈕 */}
                    {isPreloaded&&isMasonryReady && imageLoaded[image.articleId] && image.exampleImageUrl && (
                        <>
                            <p className="painterArticle-masonry-article-title">{image.title}</p>
                            {/* delete 按鈕 */}
                            <div className="painterArticle-masonry-deleteIcon-container">
                                <img src="/images/delete-icon.png"
                                 alt="delete-icon" 
                                 onClick={(e) => handleDelete(image, e)}
                                 />
                            </div>
                            <div className="painterArticle-masonry-functionIcon-container">
                                <div className="painterArticle-masonry-functionIcon-group-container">
                                    <img src="/images/icons8-love-96-14.png" alt="like-icon"></img>
                                    <span>999+</span>
                                </div>
                                <div className="painterArticle-masonry-functionIcon-group-container">
                                    <img src="/images/icons8-message-96-3.png" alt="message-icon"></img>
                                    <span>20</span>
                                </div>
                                <div className="painterArticle-masonry-functionIcon-group-container">
                                    <img src="/images/icons8-bookmark-96-4.png" alt="mark-icon"></img>
                                    <span>15</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </Masonry>
        <ModalImageArticle isOpen={isModalOpen} onClose={closeModal} data={currentData} />
        </>
    ) : null;

   
};

export default PainterArticleMasonryGrid;
