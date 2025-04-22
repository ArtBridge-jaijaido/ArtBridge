"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { fetchArtworkById } from "@/services/artworkMarketService";
import "./artworkDetails.css";

export default function ArtworkDetailPage({ params }) {



    const searchParams = useSearchParams();
    const { artworkId } = use(params);



    const artworkImageUrl = searchParams.get("image");
    const artistNickname = searchParams.get("nickname");
    const artistProfileImg = searchParams.get("avatar");


    // 🔸 狀態儲存 Firestore 抓到的 artwork 資料
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔸 抓取資料
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchArtworkById(artworkId);
            setArtwork(data);
            setLoading(false);
        };

        fetchData();
    }, [artworkId]);

    // 🔸 loading 狀態
    if (loading) return <p>載入中...</p>;
    if (!artwork) return <p>找不到市集</p>;


    return (
        <div className={`artworkDetails-page ${notoSansTCClass}`}>
            {/* 頂部區塊 */}
            <div className="artworkDetails-header">
                {/* 左半邊 */}
                <div className="artworkDetails-left">

                    <div className="artworkDetails-titleRow">
                        <h1 className="artworkDetails-title">{artwork.marketName}</h1>
                        <p className="artworkDetails-price">
                            NT.<span className="price-number">{artwork.price}</span>元
                        </p>
                    </div>

                    <div className="artworkDetails-image-wrapper">
                        <img
                            src={artworkImageUrl}
                            alt="商品圖片"
                            className="artworkDetails-image"
                        />
                        <div className="artworkDetails-report">❗我要檢舉</div>
                    </div>
                </div>

                {/* 右半邊 */}
                <div className="artworkDetails-right">
                    <div className="artworkDetails-artistTopRow">

                        <div className="artworkDetails-artistTopRow-left">
                            <img
                                src={artistProfileImg}
                                alt="畫師頭像"
                                className="artworkDetails-artistAvatar"
                            />
                            <span className="artworkDetails-artist-name">{artistNickname}</span>
                        </div>
                        <div className="artworkDetails-artist-rating">5 ★ </div>
                    </div>

                    <div className="artworkDetails-stats">
                        <div>準時完成率 <span className="blue">100%</span></div>
                        <div>信譽評分 <span className="blue">100分</span></div>
                    </div>

                    <div className="artworkDetails-buttonRow">
                        <button className="buy-button">我要購買</button>
                        <button className="like-button">❤ 按讚收藏</button>
                    </div>

                    <div className="artworkDetails-infoTable">

                        <div className="artworkDetails-infoTable-group">
                            <div className="label">市集結束時間</div>
                            <div className="value">{artwork.endDate}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="label">完稿時間</div>
                            <div className="value">{artwork.completionTime}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="label">類別</div>
                            <div className="value">{artwork.selectedCategory}</div>
                        </div>
                        <div className="artworkDetails-infoTable-group">
                            <div className="label">風格</div>
                            <div className="value">
                                {Array.isArray(artwork.selectedStyles)
                                    ? artwork.selectedStyles.join("、")
                                    : artwork.selectedStyles || "未提供"}
                            </div>
                        </div>
                    </div>

                    <div className="artworkDetails-rejectInfo">❌ 拒絕接洽：<span>{artwork.rejectedTypes}</span></div>
                    <div className="artworkDetails-referenceImage">
                        📎 委託方是否需提供參考圖片：<span>{artwork.reference}</span>
                    </div>
                </div>
            </div>

            {/* 補充內容 */}
            {/* <div className="artworkDetails-section">
                <h2>補充圖片</h2>
                <div className="artworkDetails-placeholder">（尚無補充圖片）</div>

                <h2>詳細內文</h2>
                <p>
                    我是詳細內文，我是詳細內文，我是詳細內文，我是詳細內文，我是詳細內文，我是詳細內文，我是詳細內文，我是詳細內文。
                </p>
            </div> */}

            {/* 流程圖 */}
            {/* <div className="artworkDetails-section">
        <h2>流程圖</h2>
        <div className="artworkDetails-flowSteps">
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
          <span>40%</span>
          <span>40%</span>
          <span>100%</span>
        </div>
        <div className="artworkDetails-flowLabels">
          <span>支付款項</span>
          <span>草稿</span>
          <span>線稿</span>
          <span>上色</span>
          <span>上色</span>
          <span>交付成品</span>
        </div>
      </div> */}

            {/* 補充資訊 */}
            {/* <div className="artworkDetails-section">
        <h2>補充資訊</h2>
        <p>完稿格式：.jpg</p>
        <p>作品尺寸：2560×1280px</p>
        <p>釋圖：繪師可將成品公開發佈</p>
      </div> */}

            {/* 評價 */}
            {/* <div className="artworkDetails-section">
        <h2>市集評價</h2>
        <div className="artworkDetails-reviewBox">
          <div className="artworkDetails-reviewHeader">
            <span className="review-user">保密企劃</span>
            <span className="review-stars">★★★★☆</span>
          </div>
          <div className="artworkDetails-reviewDate">2025.01.12</div>
          <div className="artworkDetails-reviewLabels">
            <span className="label">短期合作</span>
            <span className="label">品質保證</span>
          </div>
          <p className="artworkDetails-reviewText">
            委託溝通流暢，成品高質可愛，編輯人特別注重細節，還主動調整風格，團隊人員都非常滿意。您的作品超讚！
          </p>
        </div>
      </div> */}
        </div>
    );
}
