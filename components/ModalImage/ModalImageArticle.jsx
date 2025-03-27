"use client";
import React, { useState, useEffect } from "react";
import "./ModalImageArticle.css";
import ModelImageArticleTabs from "@/components/Tabs/ModelImageArticleTab.jsx";
import { updatePainterArticle } from "@/app/redux/feature/painterArticleSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateArticleImage } from "@/services/artworkArticleService";
import { FadeLoader } from "react-spinners";


const ModalImageArticle = ({ isOpen, onClose, data }) => {
    const dispatch = useDispatch();

    // 直接從 Redux Store 取得最新的圖片**
    const latestArticle = useSelector(state => {
        return state.painterArticle?.painterArticles?.find(article => article.articleId === data?.articleId);
    });

    //  當 Redux 有最新資料時，使用 Redux 的數據**
    const highResUrl = latestArticle?.exampleImageUrl || data?.exampleImageUrl;
    const lowResUrl = latestArticle?.blurredImageUrl || data?.blurredImageUrl;
    const [isLoading, setIsLoading] = useState(false);
    const [isHighResLoaded, setIsHighResLoaded] = useState(false);
    const [isLowResLoaded, setIsLowResLoaded] = useState(false);
    const [showHighRes, setShowHighRes] = useState(false); // 控制高解析圖淡入
    const [newImageFile, setNewImageFile] = useState(null);

    useEffect(() => {
        if (!highResUrl || !lowResUrl) return;

        // 預加載低解析圖
        const lowImg = new Image();
        lowImg.src = lowResUrl;
        lowImg.onload = () => {
            setIsLowResLoaded(true);
        };

        // 預加載高解析圖
        const highImg = new Image();
        highImg.src = highResUrl;
        highImg.onload = () => {
            setTimeout(() => {
                setIsHighResLoaded(true);
                setShowHighRes(true);
            }, 500); // 低解析圖片至少顯示 500ms
        };

    }, [highResUrl, lowResUrl]);




    if (!isOpen || !data) return null;

    return (
        <div className="ModalImageArticle-overlay" onClick={onClose}>
            <div className="ModalImageArticle-content" onClick={(e) => e.stopPropagation()}>
                <button className="ModalImageArticle-close" onClick={onClose}>關閉 X</button>
                <div className="ModalImageArticle-body">
                    {/* 左側圖片區域 */}
                    <div className="ModalImageArticle-image-section">
                        <div className="ModalImageArticle-image-container">
                            {isLoading ? (
                                <div className="ModalImageArticle-loader">
                                    <FadeLoader color="white" height={12} width={3} radius={5} margin={-4} />
                                    <p>圖片更新中...請稍後</p>
                                </div>
                            ) : (
                                <>
                                    {lowResUrl && (
                                        <img
                                            src={lowResUrl}
                                            alt="blurred-article-image"
                                            className={`ModalImageArticle-blurImage ${showHighRes ? "fadeOut" : "fadeIn"}`}
                                        />
                                    )}
                                    {highResUrl && (
                                        <img
                                            src={highResUrl}
                                            alt="article-image"
                                            className={`ModalImageArticle-highRes ${showHighRes ? "fadeIn" : "hide"}`}
                                        />
                                    )}
                                </>
                            )}

                         
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
                        <ModelImageArticleTabs data={data} />
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
                            <span> {data?.commentCount}</span>
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