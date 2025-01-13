"use client";   
import React from 'react'
import "./ArtworkPainterProfileCard.css";

const ArtworkPainterProfileCard = () => {
    return (
        <div className="ArtworkPainterProfileCard">
            <div className="ArtworkPainterProfileCard-header">
                <div className="artworkPainterProfileCard-info">
                    <div className="artworkPainterProfileCard-avator-container">
                    <img src="images/testing-artist-profile-image.png" className="artworkPainterProfileCard-avator"></img>
                    <img src="images/icons8-star-64-1.png" className="artworkPainterProfileCard-verify-star"></img>
                    </div>
                    <div className="artworkPainterProfileCard-info-text">
                        <span className="artworkPainterProfileCard-name">王小美</span>
                        <div className="artworkPainterProfileCard-status-container">
                             <img src="images/icons8-tick-50-1.png"></img>
                             <span className="artworkPainterProfileCard-status">2025年3月有空檔</span>
                        </div>
                       
                          
                    </div>
                </div>
                <div className="artworkPainterProfileCard-actions">
                    <button className="ArtworkPainterProfileCard-action-btn ArtworkPainterProfileCard-view-reviews">查看評價</button>
                    <button className="ArtworkPainterProfileCard-action-btn ArtworkPainterProfileCard-assign-artist">委託繪師</button>
                </div>
            </div>
            <div className="ArtworkPainterProfileCard-top-five-artworks">
                <div className="ArtworkPainterProfileCard-artwork-image-container">
                    <img src="images/testing-Arkwork-image.png" alt="ArtworkPainterProfileCard-artwork" className="ArtworkPainterProfileCard-artwork"></img>
                </div>
                <div className="ArtworkPainterProfileCard-artwork-image-container">
                    <img src="images/testing-Arkwork-image.png" alt="ArtworkPainterProfileCard-artwork" className="ArtworkPainterProfileCard-artwork"></img>
                </div>
                <div className="ArtworkPainterProfileCard-artwork-image-container">
                    <img src="images/testing-Arkwork-image.png" alt="ArtworkPainterProfileCard-artwork" className="ArtworkPainterProfileCard-artwork"></img>
                </div>
                <div className="ArtworkPainterProfileCard-artwork-image-container">
                    <img src="images/testing-Arkwork-image.png" alt="ArtworkPainterProfileCard-artwork" className="ArtworkPainterProfileCard-artwork"></img>
                </div>
                <div className="ArtworkPainterProfileCard-artwork-image-container">
                    <img src="images/testing-Arkwork-image.png" alt="ArtworkPainterProfileCard-artwork" className="ArtworkPainterProfileCard-artwork"></img>
                </div>
            </div>

        </div>
    )
}

export default ArtworkPainterProfileCard
