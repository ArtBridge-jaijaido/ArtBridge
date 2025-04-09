"use client";
import React, { useState,useEffect } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkCollectionListTab from "@/components/Tabs/ArtworkCollectionListTab.jsx";
import {fetchLikedArtworksByUser} from "@/services/artworkMarketService.js";
import { useSelector } from "react-redux";
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard.jsx";

import "./artworkCollectionList.css";


const ArtworkCollectionListage = () => {

    const currentUser = useSelector((state) => state.user.user);
   
    const [likedArtworks, setLikedArtworks] = useState([]);

    const allUsers = useSelector((state) => state.user.allUsers);

    console.log("allUsers", allUsers);

    useEffect(() => {
        const fetchUserLikedArtworkData = async () => {
          if (!currentUser || !currentUser.uid) {
            return;
          }

          const response = await fetchLikedArtworksByUser(currentUser.uid);
          if (response.success) {
            setLikedArtworks(response.data);
          } else {
            console.error(response.message);
          }
        };

        fetchUserLikedArtworkData();

    }, [currentUser]);

    console.log("likedArtworks", likedArtworks);
    

    const tabs = [
        {
            label: "按讚作品",
            content: <>按讚作品</>
          },
        {
            label: "貼文珍藏",
            content: <>貼文珍藏</>
        },

        {
            label: "按讚市集",
            content: (
                <div className="artworkCollectionList-artworkCard-container">
                  {likedArtworks.length > 0 ? (
                    likedArtworks.map((artwork) => {
                      const user = allUsers[artwork.userUid] || {};
                      return (
                        <ArtworkCard
                          key={artwork.id}
                          imageSrc={artwork.exampleImageUrl}
                          title={artwork.marketName}
                          price={artwork.price}
                          artistProfileImg={user.profileAvatar || "/images/kv-min-4.png"}
                          artistNickName={user.nickname || "使用者名稱"}
                          artistUid={artwork.userUid}
                          artworkId={artwork.artworkId}
                          likedby={artwork.likedBy || []}
                        />
                      );
                    })
                  ) : (
                    <p>目前沒有任何按讚的作品</p>
                  )}
                </div>
              ),
        }
    ]

    return (
        <div className={`artworkCollectionListPage ${notoSansTCClass}`} >
            <div className="artworkCollectionList-tab-container">
                < ArtworkCollectionListTab tabs={tabs} />
            </div>
        </div>
    )

};


export default ArtworkCollectionListage;