"use client";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import "./ArtworkEntrustCard.css";
import { usePathname } from "next/navigation";
import { deleteUserEntrust } from "@/services/artworkEntrustService";
import {deleteArtworkOrderFromService  } from "@/services/artworkOrderService.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { deleteEntrust } from "@/app/redux/feature/entrustSlice";
import { deleteArtworkOrder} from "@/app/redux/feature/artworkOrderSlice";
import { useToast } from "@/app/contexts/ToastContext.js";


const ArtworkEntrustCard = ({ entrustId, entrustNickname, entrustProfileImg, marketName, applicationCount, description, categoryText, deadlineText, price, EntrustImageUrl, entrustUserUid, entrustUserSerialId, onDeleteSuccess }) => {

  const pathname = usePathname();
  const isArtworkEntrustMarketPage = pathname.includes("artworkEntrustMarket");
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const user = useSelector((state) => state.user);
  const { setIsLoading } = useLoading();
  const navigate = useNavigation();
  const artworkOrders = useSelector((state) => state.artworkOrder.artworkOrders);
 

  // 檢查描述文字是否超過 35 字
  const truncatedDescription = description.length > 35
    ? `${description.substring(0, 35)}...`
    : description;

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirm = window.confirm(`確定要刪除委託「${marketName}」嗎？`);
    if (!confirm) return;

    const linkedOrder = artworkOrders.find(
      (order) => order.fromEntrustId === entrustId
    );


    onDeleteSuccess?.();

   
    const response = await deleteUserEntrust(entrustUserUid, entrustUserSerialId, entrustId);

    if (response.success) {
      console.log(entrustId);
      dispatch(deleteEntrust(entrustId));

      if (linkedOrder&& linkedOrder.status==="等待承接") {
        await deleteArtworkOrderFromService(linkedOrder.artworkOrderId);
        dispatch(deleteArtworkOrder(linkedOrder.artworkOrderId));
      }

      addToast("success", "委託已刪除成功");
    } else {
      addToast("error", "刪除失敗，請稍後再試");
    }
  };

  const handleHeadingToDetail = (e) => {
    e.stopPropagation();
    navigate(`/artworkEntrustDetails/${entrustId}?nickname=${encodeURIComponent(entrustNickname)}&avatar=${encodeURIComponent(entrustProfileImg)}&image=${encodeURIComponent(EntrustImageUrl)}`);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }


  return (
    <div className="artworkEntrustCard-container"
      onClick={handleHeadingToDetail}
    >
      <div className="ArtworkEntrustCard-wrapper">
        <div className="ArtworkEntrustCard-content">
          <div className="ArtworkEntrustCard-main">
            <div className="ArtworkEntrustCard-details">
              <div className="ArtworkEntrustCard-title">{marketName}</div>
              <div className="ArtworkEntrustCard-meta-info">
                <div className="ArtworkEntrustCard-user-info">
                  <div className="ArtworkEntrustCard-username"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >{entrustNickname}
                  </div>
                  <img src="/images/user-icon.png" className="ArtworkEntrustCard-user-icon" />
                </div>
                <div className="ArtworkEntrustCard-applicants">
                  <img src="/images/applicant-icon.png" className="ArtworkEntrustCard-applicant-icon" />
                  <div className="ArtworkEntrustCard-applicant-text">已有{applicationCount}人應徵</div>
                </div>
              </div>
              <div className="ArtworkEntrustCard-description">
                <span>{truncatedDescription}</span>
              </div>
              <div className="ArtworkEntrustCard-divider"></div>
              <div className="ArtworkEntrustCard-footer-info">
                <div className="ArtworkEntrustCard-category">
                  <img src="/images/category-icon.png" className="ArtworkEntrustCard-category-icon" alt="Category icon" />
                  <div className="ArtworkEntrustCard-category-text">{categoryText}</div>
                </div>
                <div className="ArtworkEntrustCard-deadline">
                  <img src="/images/dealine-icon.png" className="ArtworkEntrustCard-deadline-icon" alt="Calendar icon" />
                  <div className="ArtworkEntrustCard-deadline-text">截止於:{deadlineText}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="ArtworkEntrustCard-sidebar">
            <div className="ArtworkEntrustCard-sidebar-content">
              <div className="ArtworkEntrustCard-price-tag">
                <img src="/images/price-icon.png"
                  className="ArtworkEntrustCard-price-icon" alt="Currency icon" />
                <div className="ArtworkEntrustCard-price-text">{price}</div>
              </div>
              <div className="ArtworkEntrustCard-preview-image">
                {!isImageLoaded && (
                  <div className="ArtworkEntrustCard-loader">
                    <FadeLoader
                      color="white"
                      height={12}
                      width={3}
                      radius={5}
                      margin={-4}

                    />
                  </div>
                )}
                <img
                  src={EntrustImageUrl}
                  alt="entrustImg"
                  onLoad={() => setIsImageLoaded(true)}
                  style={{ display: isImageLoaded ? 'block' : 'none' }}
                />

              </div>

            </div>
          </div>
        </div>
      </div>



      {isArtworkEntrustMarketPage && (
        <div className="ArtworkEntrustCard-delete-icon" onClick={(e) => handleDelete(e)}>
          <img src="/images/delete-icon.png" alt="Delete" />
        </div>
      )}

    </div>

  );
};

export default ArtworkEntrustCard;
