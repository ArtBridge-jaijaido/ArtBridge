"use client";
import React, { useState,useEffect } from "react";
import "./ModalImageArticle.css";
import ModelImageArticleTabs from "@/components/Tabs/ModelImageArticleTab.jsx";

const ModalImageArticle = ({ isOpen, onClose, data }) => {
    const [isHighResLoaded, setIsHighResLoaded] = useState(false);
    const [isLowResLoaded, setIsLowResLoaded] = useState(false);
    const [lowResUrl, setLowResUrl] = useState(data ? data.blurredImageUrl : "");
    const [showHighRes, setShowHighRes] = useState(false); // 控制高解析圖淡入


    const tabs=[
        {
            label: "內文",
            content: { innerContext: data?.innerContext, innerContextTitle: data?.title }
        },
        {
            label: "留言板",
            content: <div>留言板區域，顯示留言的內容。</div>,
        },
        {
            label: "圖片資訊",
            content: { imageSource: data?.imageSource||"無", imageReleaseDate: data?.createdAt, imageCateorgy: data?.selectedStyles},
        },
    ]
    

    useEffect(() => {
        if (!data) return;
        
        // 預加載低解析圖
        const lowImg = new Image();
        lowImg.src = data.blurredImageUrl;
        lowImg.onload = () => {
            setLowResUrl(data.blurredImageUrl);
            setIsLowResLoaded(true); // 低解析圖片載入完成
        };

        // 預加載高解析圖
        const highImg = new Image();
        highImg.src = data.exampleImageUrl;
        highImg.onload = () => {
            setTimeout(() => {
                setIsHighResLoaded(true); // 高解析圖片載入完成
                setShowHighRes(true); // 淡入高解析圖
            }, 500); // 低解析圖片至少顯示 500ms
        };

        return () => {
           
            setIsHighResLoaded(false);
            setShowHighRes(false);
            setLowResUrl("");
        };
    }, [data]);

    if (!isOpen || !data) return null;



    return (
        <div className="ModalImageArticle-overlay" onClick={onClose}>
            <div className="ModalImageArticle-content" onClick={(e) => e.stopPropagation()}>
                <button className="ModalImageArticle-close" onClick={onClose}>關閉 X</button>
                <div className="ModalImageArticle-body">
                    {/* 左側圖片區域 */}
                    <div className="ModalImageArticle-image-section">
                        <div className="ModalImageArticle-image-container">
                            {/* 模糊圖層（背景圖） */}
                            {lowResUrl&&(<img 
                                src={lowResUrl} 
                                alt="blurred-article-image"
                                className={`ModalImageArticle-blurImage ${showHighRes ? "fadeOut" : "fadeIn"}`}
                            />)}
                            {/* 高解析圖片 */}
                            <img
                                src={data.exampleImageUrl} 
                                alt="article-image"
                                className={`ModalImageArticle-highRes ${showHighRes ? "fadeIn" : "hide"}`}
                            />

                            <div className="ModalImageArticle-image-editBtn">
                                <img src="/images/icons8-create-52-2.png" alt="editIcon"></img>
                            </div>
                        </div>
                        {/* 類別標籤 */}
                        <div className="ModalImageArticle-category-container">
                            {data.selectedStyles.map((category, index) => (
                                <span key={index} className="ModalImageArticle-category">{category}</span>
                            ))}
                        </div>
                    </div>

                    {/* 右側內容區域 */}
                    <div className="ModalImageArticle-tab-section">
                        <ModelImageArticleTabs tabs={tabs} />

                    </div>
                </div>

                {/* Footer Icons */}
                <div className="ModalImageArticle-footer">
                    <div className="ModalImageArticle-left-footer">
                        <div className="ModalImageArticle-footer-icons">
                            <img src="/images/icons8-love-96-13-1.png" alt="likesIcon"></img>
                            <span>999+</span>
                        </div>
                        <div className="ModalImageArticle-footer-icons">
                            <img src="/images/icons8-message-96-1.png" alt="commentsIcon"></img>
                            <span>20</span>
                        </div>
                        <div className="ModalImageArticle-footer-icons">
                            <img src="/images/icons8-share-96-1.png" alt="sharesIcon"></img>
                        </div>
                        <div className="ModalImageArticle-footer-icons ModalImageArticle-collection">
                            <img src="/images/icons8-bookmark-96-1.png" alt="collectionIcon"></img>
                            <span>珍藏</span>
                        </div>
                    </div>
                    <div className="ModalImageArticle-right-footer"></div>
                </div>
            </div>
        </div>
    );
};

export default ModalImageArticle;
