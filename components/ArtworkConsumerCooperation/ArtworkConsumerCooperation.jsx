"use client"; 
import React, {useState, useEffect} from 'react'
import "./ArtworkConsumerCooperation.css";
import "@fontsource/inter"; 

const ArtworkConsumerCooperation = ({cooperationNum, finishNum}) => {
    /*計算完成率*/
    const completionRate = (finishNum / cooperationNum) * 100;

    let ratingImg = "";
    let ratingText = "";
    let ratingBgColor = "";

    if (completionRate > 95) {
        ratingImg = "/images/Best-rating.png";
        ratingText = "極高";
        ratingBgColor="#2DAEF4";
    } else if (completionRate > 80) {
        ratingImg = "/images/high-rating.png";
        ratingText = "高";
        ratingBgColor="#22B68C";
    } else if (completionRate > 60) {
        ratingImg = "/images/middle-rating.png";
        ratingText = "中";
        ratingBgColor="#FFC922";
    } else {
        ratingImg = "/images/lowest-rating.png";
        ratingText = "極低";
        ratingBgColor="#EF5353";
    }

    return(
        <div className="ArtworkConsumerCooperation-stats-wrapper">
        <div className="ArtworkConsumerCooperation-stats-container">
            <div className="ArtworkConsumerCooperation-stats-content">
                <div className="ArtworkConsumerCooperation-stat-item">
                    <div className="ArtworkConsumerCooperation-stat-label">已合作次數</div>
                    <div className="ArtworkConsumerCooperation-stat-value">{cooperationNum}</div>
                </div>
                <div className="ArtworkConsumerCooperation-stat-item">
                    <div className="ArtworkConsumerCooperation-stat-label">合作完成次數</div>
                    <div className="ArtworkConsumerCooperation-stat-value">{finishNum}</div>
                </div>
            </div>
            <div className="ArtworkConsumerCooperation-rating-container">
                <img src={ratingImg} className="ArtworkConsumerCooperation-rating-icon"/>
                <div className="ArtworkConsumerCooperation-rating-text" style={{ backgroundColor: ratingBgColor }}>{ratingText}</div>
            </div>
        </div>
        </div>
    )
}

export default ArtworkConsumerCooperation