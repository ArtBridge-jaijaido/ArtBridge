"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkEntrustSetTab from "@/components/ArtworkEntrustSetTab/ArtworkEntrustSetTab.jsx"; // 需檢查
import ArtworkEntrustMarketCard from "@/components/ArtworkEntrustMarketCard/ArtworkEntrustMarketCard.jsx"; // 要檢查
import { fetchUserEntrusts } from "@/services/artworkEntrustService"; // 需檢查
import "./artworkEntrustMarket.css"; //需檢查

const ArtworkEntrustMarketPage = () => {
    const [entrustCardVisibleItems, setEntrustCardVisibleItems] = useState(10);
    const [historyEntrustVisibleItems, setHistoryEntrustVisibleItems] = useState(10);
    const { user } = useSelector((state) => state.user);
    const [activeEntrusts, setActiveEntrusts] = useState([]);
    const [historyEntrusts, setHistoryEntrusts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            loadUserEntrusts(user.uid);
        }
    }, [user?.uid]);

    const loadUserEntrusts = async (userUid) => {
        setIsLoading(true);
        const fetchedEntrusts = await fetchUserEntrusts(userUid);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const active = [];
        const history = [];

        fetchedEntrusts.forEach((entrust) => {
            const endDate = new Date(entrust.endDate);
            if (currentDate <= endDate) {
                active.push(entrust);
            } else {
                history.push(entrust);
            }
        });

        setActiveEntrusts(active);
        setHistoryEntrusts(history);
        setIsLoading(false);
    };

    const tabs = [
        {
            label: "進行中",
            content: (
                <div className="artworkEntrustMarket-tab-wrapper">
                    {isLoading ? (
                        <p></p>
                    ) : activeEntrusts.length > 0 ? (
                        <div className="artworkEntrustMarket-marketCard-container">
                            {activeEntrusts.slice(0, entrustCardVisibleItems).map((entrust) => (
                                <ArtworkEntrustMarketCard
                                    key={entrust.entrustId}
                                    imageSrc={entrust.exampleImageUrl || "/images/default-image.png"}
                                    title={entrust.title}
                                    budget={entrust.budget}
                                />
                            ))}
                            {entrustCardVisibleItems < activeEntrusts.length && (
                                <button onClick={() => setEntrustCardVisibleItems((prev) => prev + 10)} className="artworkEntrustMarket-show-more-button">
                                    顯示更多
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>目前沒有進行中的委託。</p>
                    )}
                </div>
            ),
        },
        {
            label: "歷史委託",
            content: (
                <div className="artworkEntrustMarket-tab-wrapper">
                    {isLoading ? (
                        <p>載入中...</p>
                    ) : historyEntrusts.length > 0 ? (
                        <div className="artworkEntrustMarket-marketCard-container">
                            {historyEntrusts.slice(0, historyEntrustVisibleItems).map((entrust) => (
                                <ArtworkEntrustMarketCard
                                    key={entrust.entrustId}
                                    imageSrc={entrust.exampleImageUrl || "/images/default-image.png"}
                                    title={entrust.title}
                                    budget={entrust.budget}
                                    isHistoryTab={true}
                                />
                            ))}
                            {historyEntrustVisibleItems < historyEntrusts.length && (
                                <button onClick={() => setHistoryEntrustVisibleItems((prev) => prev + 10)} className="artworkEntrustMarket-show-more-button">
                                    顯示更多
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>目前沒有歷史委託。</p>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={`artworkEntrustMarket-page ${notoSansTCClass}`}>
            <div className="artworkEntrustMarket-setTab-container">
                <ArtworkEntrustSetTab tabs={tabs} />
            </div>
        </div>
    );
};

export default ArtworkEntrustMarketPage;
