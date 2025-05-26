"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkEntrustSetTab from "@/components/Tabs/ArtworkEntrustSetTab.jsx";
import ArtworkEntrustCard from "@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx";
import { fetchUserEntrusts } from "@/services/artworkEntrustService";
import "./artworkEntrustMarket.css";

const ArtworkEntrustMarketPage = () => {
    const [entrustCardVisibleItems, setEntrustCardVisibleItems] = useState(10);
    const [historyEntrustVisibleItems, setHistoryEntrustVisibleItems] = useState(10);
    const { user } = useSelector((state) => state.user);
    const allUsers = useSelector((state) => state.user.allUsers);
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

            const isActive = entrust.isActive === true;
            const isNotExpired = currentDate <= endDate;

            if (isActive && isNotExpired) {
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
            label: "上架中",
            content: (
                <div className="artworkEntrustMarket-tab-wrapper">
                    {isLoading ? (
                        <p></p>
                    ) : activeEntrusts.length > 0 ? (
                        <div className="artworkEntrustMarket-marketCard-container">
                            {activeEntrusts.slice(0, entrustCardVisibleItems).map((entrust) => {
                                const user = allUsers[entrust.userUid];
                                return (
                                    <ArtworkEntrustCard
                                        key={entrust.entrustId}
                                        entrustId={entrust.entrustId}
                                        EntrustImageUrl={entrust.exampleImageUrl}
                                        marketName={entrust.marketName}
                                        price={entrust.price}
                                        description={entrust.description}
                                        applicationCount={entrust.applicationCount}
                                        categoryText={entrust.selectedCategory}
                                        deadlineText={entrust.endDate}
                                        entrustNickname={user?.nickname || "使用者名稱"}
                                        entrustProfileImg={user?.profileAvatar|| "/images/kv-min-4.png"}
                                        entrustUserUid={entrust.userUid}
                                        entrustUserSerialId={entrust.userId}
                                        onDeleteSuccess={() =>
                                            setActiveEntrusts((prev) =>
                                              prev.filter((e) => e.entrustId !== entrust.entrustId)
                                            )
                                          }
                                    />
                                );
                            })}
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
                    {historyEntrusts
                      .slice(0, historyEntrustVisibleItems)
                      .map((entrust) => {
                        const user = allUsers[entrust.userUid];
                        return (
                          <ArtworkEntrustCard
                            key={entrust.entrustId}
                            entrustId={entrust.entrustId}
                            EntrustImageUrl={entrust.exampleImageUrl}
                            marketName={entrust.marketName}
                            price={entrust.price}
                            description={entrust.description}
                            applicationCount={entrust.applicationCount}
                            categoryText={entrust.selectedCategory}
                            deadlineText={entrust.endDate}
                            entrustNickname={user?.nickname || "使用者名稱"}
                            entrustProfileImg={user?.profileAvatar|| "/images/kv-min-4.png"}
                            entrustUserUid={entrust.userUid}
                            entrustUserSerialId={entrust.userId}
                            isHistoryTab={true}
                            onDeleteSuccess={() =>
                              setHistoryEntrusts((prev) =>
                                prev.filter((e) => e.entrustId !== entrust.entrustId)
                              )
                            }
                          />
                        );
                      })}
                    {historyEntrustVisibleItems < historyEntrusts.length && (
                      <button
                        onClick={() =>
                          setHistoryEntrustVisibleItems((prev) => prev + 10)
                        }
                        className="artworkEntrustMarket-show-more-button"
                      >
                        顯示更多
                      </button>
                    )}
                  </div>
                ) : (
                  <p>目前沒有歷史委託。</p>
                )}
              </div>
            ),
          }
          
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
