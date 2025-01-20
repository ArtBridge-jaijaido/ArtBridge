"use client";

import React, { useState, useEffect } from "react";
import ModalImgArtCommunity from "@/components/ModalImage/ModalImgArtCommunity.jsx";
import "./MasonryArtCommunity.css";

const MasonryArtCommunity = ({ images }) => {
  const defaultColumnWidths = [256, 260, 317, 220, 230];
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [columnItems, setColumnItems] = useState(new Array(defaultColumnWidths.length).fill([]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  
  useEffect(() => {
    const updateColumnWidths = () => {
      if (window.innerWidth <= 370) {
        setColumnWidths([140, 155]);
      }
      else if (window.innerWidth <= 440) {
        setColumnWidths([180, 180]);
      }
      else if (window.innerWidth <= 834) {
        setColumnWidths([160, 200, 180, 180]);
      } else if (window.innerWidth <= 1280) {
        setColumnWidths([190, 190, 260, 206, 210]);
      } else {
        setColumnWidths(defaultColumnWidths);
      }
    };

    updateColumnWidths();
    window.addEventListener("resize", updateColumnWidths);
    return () => window.removeEventListener("resize", updateColumnWidths);
  }, []);

  useEffect(() => {
    const newColumnItems = new Array(columnWidths.length).fill(null).map(() => []);

    images.forEach((image, index) => {
      const columnIndex = index % columnWidths.length; // 固定分配到列
      newColumnItems[columnIndex].push(image);
    });

    setColumnItems(newColumnItems); // 更新列數據
  }, [images, columnWidths]);


  const handleImageClick = (image) => {

    setCurrentData({
      src: image,
      author: "使用者名稱",
      authorAvatar: "/images/testing-artist-profile-image.png",
      imageCateorgy:["風格1", "風格2", "風格3","風格4"],
      imageReleaseDate: "2025.02.01",
      innerContext: "這是標題最多20個字喔喔喔喔喔喔！",
      description: "這裡是圖片的描述內容，可以包含更多文本。",
      likes: 999,
      comments: 20,
      shares: 52,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setCurrentData(null); 
  };



  return (
    <div className="MasonryArtCommunity-grid">
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="MasonryArtCommunity-grid-column"
          style={{
            maxWidth: `${columnWidths[columnIndex]}px`
          }}
        >
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="MasonryArtCommunity-grid-item">
              <img
                src={image}
                alt={`Artwork ${imageIndex + 1}`}
                className="MasonryArtCommunity-grid-item-image"
                onClick={() => handleImageClick(image)}
              />
              <span className="MasonryArtCommunity-artwork-title">這是標題最多放12個字...</span>
              <div className="MasonryArtCommunity-content-container">
                <div className="MasonryArtCommunity-artistInfo-container">
                  <img src="/images/testing-artist-profile-image.png" alt="artistAvatar"></img>
                  <span className="MasonryArtCommunity-artistName">使用者名稱</span>
                </div>
                <div className="MasonryArtCommunity-likesIcon-container">
                  <img src="/images/icons8-love-96-26.png" alt="numberOfLikes" ></img>
                  <span className="MasonryArtCommunity-likes-number">100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

       {/*  ModalImage  */}
       <ModalImgArtCommunity  isOpen={isModalOpen} onClose={closeModal} data={currentData} />
    </div>
  );
};

export default MasonryArtCommunity;
