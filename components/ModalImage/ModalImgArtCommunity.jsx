"use client";
import React, { useState, useEffect } from "react";
import "./ModalImgArtCommunity.css";
import Tabs from '@/components/Tabs/Tab.jsx';
import ArticleComment from '@/components/ArticleComments/ArticleComments.jsx';
import { toggleArticleCollect } from "@/services/artworkArticleService";
import { useToast } from "@/app/contexts/ToastContext.js";

const ModalImgArtCommunity = ({ isOpen, onClose, data }) => {

  

  if (!isOpen || !data  ) return null;

  console.log(data.isCollected);


  const tabs = [
    {
      label: "內文",
      content: { innerContext: data.innerContext, innerContextTitle: data.innerContextTitle }
       
    },
    {
      label: "留言板",
      content: data?.articleId && data?.userUid? (
        <ArticleComment
          articleId={data.articleId}
          userUid={data.userUid}
         
        />
      ) : <p>留言板載入中...</p>,
    },
    {
      label: "圖片資訊",
      content: { imageSource: data.imageSource, imageReleaseDate: data.imageReleaseDate, imageStyles: data.imageStyles, imageCategory: data.imageCategory },
    },
  ];

  
  
  

  return (
    <div className="ModalImgArtCommunity-overlay" onClick={onClose}>
      <div className="ModalImgArtCommunity-content" onClick={(e) => e.stopPropagation()}>
        <button className="ModalImgArtCommunity-close" onClick={onClose}>關閉X</button>
        <div className="ModalImgArtCommunity-body">
          {/* 左側圖片區域 */}
          <div className="ModalImgArtCommunity-image-section">
            <div className="ModalImgArtCommunity-header">
              <div className="ModalImgArtCommunity-artistInfo-container">
                <div className="ModalImgArtCommunity-artistAvatar-container">
                  <img src={data.authorAvatar} alt="artistAvatar" />
                </div>
                <div className="ModalImgArtCommunity-artistInfo-text">
                  <span className="ModalImgArtCommunity-artistName">{data.author}</span>
                  <span className="ModalImgArtCommunity-imageReleaseDate">{data.imageReleaseDate}</span>
                </div>
              </div>
              <div className="ModalImgArtCommunity-verifyIcon-container">
                <img src="/images/icons8-attendance-100-1.png" alt="verifyIcon"></img>
              </div>
            </div>


            <div className="ModalImgArtCommunity-image-container">
              <img src={data.src} alt="Artwork" />
            </div>

            <div className="ModalImgArtCommunity-styles-container">
              {data.imageStyles.map((style, index) => (
                <span key={index} className="ModalImgArtCommunity-styles">{style}</span>
              ))}
            </div>
          </div>

          {/* 右側選擇欄 */}
          <div className="ModalImgArtCommunity-tab-section">
            <Tabs tabs={tabs} />

          </div>


        </div>

        <div className="ModalImgArtCommunity-footer">
        <div className="ModalImgArtCommunity-left-footer">
              <div className="ModalImgArtCommunity-footer-icons">
                <img src="/images/icons8-love-96-13-1.png" alt="likesIcon"></img>
                <span>{data.likes}</span>
              </div>
              <div className="ModalImgArtCommunity-footer-icons">
                <img src="/images/icons8-message-96-1.png" alt="commentsIcon"></img>
                <span>{data.comments}</span>
              </div>
              <div className="ModalImgArtCommunity-footer-icons">
                <img src="/images/icons8-share-96-1.png" alt="sharesIcon"></img>
                <span>{data.shares}</span>
              </div>
              <div className="ModalImgArtCommunity-footer-icons ModalImgArtCommunity-collection">
                <img src={
                      data.isCollected
                        ? "/images/icons8-bookmark-96-6.png"
                        : "/images/icons8-bookmark-96-4.png"
                    }
                
                alt="collectionIcon"></img>
                <span>珍藏</span>
              </div>
            </div>

            <div className="ModalImgArtCommunity-right-footer">
              <div className="ModalImgArtCommunity-footer-icons">
                  <img src="/images/icons8-exclamation-mark-64-1.png" alt="reportIcon"></img>
                  <span>檢舉</span>
                </div>
            </div>   
        </div>
      </div>
    </div>
  )
}

export default ModalImgArtCommunity
