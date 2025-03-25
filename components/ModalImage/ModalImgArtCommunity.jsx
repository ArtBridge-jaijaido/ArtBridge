"use client";
import React from 'react'
import "./ModalImgArtCommunity.css";
import Tabs from '@/components/Tabs/Tab.jsx';
import ArticleComment from '@/components/ArticleComments/ArticleComments.jsx';
import { useSelector } from 'react-redux';

const ModalImgArtCommunity = ({ isOpen, onClose, data }) => {

  const currentUser = useSelector((state) => state.user.user);

  if (!isOpen || !data || !currentUser ) return null;



  const tabs = [
    {
      label: "內文",
      content: { innerContext: data.innerContext, innerContextTitle: data.innerContextTitle }
       
    },
    {
      label: "留言板",
      content: data?.articleId && data?.userUid && currentUser ? (
        <ArticleComment
          articleId={data.articleId}
          userUid={data.userUid}
          currentUser={currentUser}
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
                <img src="/images/icons8-bookmark-96-1.png" alt="collectionIcon"></img>
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
