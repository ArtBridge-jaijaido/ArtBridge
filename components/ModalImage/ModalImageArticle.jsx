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

    const tabs = [
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
            content: { imageSource: data?.imageSource || "無", imageReleaseDate: data?.createdAt, imageCateorgy: data?.selectedStyles },
        },
    ];

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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setNewImageFile(file);
        setIsLoading(true);
        // ✅ 呼叫 updateArticleImage 更新圖片
        try {
            const updatedArticle = await updateArticleImage({
                userId: data.userId,
                articleId: data.articleId,
                userUid: data.userUid,
                file,
            });

            if (updatedArticle.success) {
                // ✅ 更新 Redux 狀態 (更新 exampleImageUrl 和 blurredImageUrl)
                dispatch(updatePainterArticle({
                    articleId: data.articleId,  
                    exampleImageUrl: updatedArticle.exampleImageUrl,
                    blurredImageUrl: updatedArticle.blurredImageUrl,
                }));
            }
        } catch (error) {
            console.error("圖片更新失敗", error);
        } finally {
            setIsLoading(false);
        }
    };

    

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

                            <div className="ModalImageArticle-image-editBtn">
                                <label htmlFor="fileInput">
                                    <img src="/images/icons8-create-52-2.png" alt="editIcon" />
                                </label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }} 
                                />
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