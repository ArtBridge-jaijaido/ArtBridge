"use client";   
import React from "react";
import "./ArtworkEntrustCard.css";

const ArtworkEntrustCard = ({title, usernameText, applicantText, descriptionText, categoryText, dealineText, price, artworkImg}) => (
  <div className="artworkEntrust-Card-container">
    <div className="ArtworkEntrustCard-wrapper">
      <div className="ArtworkEntrustCard-content">
        <div className="ArtworkEntrustCard-main">
          <div className="ArtworkEntrustCard-details">
            <div className="ArtworkEntrustCard-title">{title}</div>
            <div className="ArtworkEntrustCard-meta-info">
              <div className="ArtworkEntrustCard-user-info">
                <div className="ArtworkEntrustCard-username">{usernameText}</div>
                <img src="images/user-icon.png" className="ArtworkEntrustCard-user-icon" />
              </div>
              <div className="ArtworkEntrustCard-applicants">
                <img src="images/applicant-icon.png" className="ArtworkEntrustCard-applicant-icon" />
                <div className="ArtworkEntrustCard-applicant-text">{applicantText}</div>
              </div>
            </div>
            <div className="ArtworkEntrustCard-description">
              {descriptionText}
            </div>
            <div className="ArtworkEntrustCard-divider"></div>
            <div className="ArtworkEntrustCard-footer-info">
              <div className="ArtworkEntrustCard-category">
                <img src="images/category-icon.png" className="ArtworkEntrustCard-category-icon" alt="Category icon" />
                <div className="ArtworkEntrustCard-category-text">{categoryText}</div>
              </div>
              <div className="ArtworkEntrustCard-deadline">
                <img src="images/dealine-icon.png" className="ArtworkEntrustCard-deadline-icon" alt="Calendar icon" />
                <div className="ArtworkEntrustCard-deadline-text">{dealineText}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="ArtworkEntrustCard-sidebar">
          <div className="ArtworkEntrustCard-sidebar-content">
            <div className="ArtworkEntrustCard-price-tag">
              <img src="images/price-icon.png"
                className="ArtworkEntrustCard-price-icon" alt="Currency icon" />
              <div className="ArtworkEntrustCard-price-text">{price}</div>
            </div>
            <img src={artworkImg} className="ArtworkEntrustCard-preview-image" />
          </div>
        </div>
      </div>
    </div>

  </div>
);

export default ArtworkEntrustCard;
