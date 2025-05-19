"use client";
import React from "react";
import "./PainterApplicantCard.css";

const PainterApplicantCard = ({
  artistNickname,
  artistProfileImg,
  expectedDays,
  expectedPrice,
  resumeUrl,
  completionRate,
  reputationScore,
  monthlyStats = [],
}) => {
  return (
    <div className="PainterApplicantCard-wrapper">
      <div className="PainterApplicantCard-header-buttom">
        選定繪師
      </div>

      <div className="PainterApplicantCard-body-grid">
        {/* 左側區塊 */}
        <div className="PainterApplicantCard-left">
          <div className="PainterApplicantCard-user">
            
            <img
              className="PainterApplicantCard-avatar"
              src={artistProfileImg}
              alt="Artist Profile"
            />
            <span className="PainterApplicantCard-nickname">{artistNickname}</span>
          </div>

          <div className="PainterApplicantCard-info">
            <p>截稿時間：{expectedDays} 天</p>
            <p>期望金額：{expectedPrice} 元</p>
            <p>
              查看履歷：
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                點擊查看
              </a>
            </p>
          </div>
        </div>

        {/* 右側區塊 */}
        <div className="PainterApplicantCard-right">
          <div className="PainterApplicantCard-stats">
            <div className="PainterApplicantCard-stat">
              <div>準時完成率</div>
              <div className="PainterApplicantCard-statValue blue">{completionRate}%</div>
            </div>
            <div className="PainterApplicantCard-stat">
              <div>信譽評分</div>
              <div className="PainterApplicantCard-statValue blue">{reputationScore}分</div>
            </div>
          </div>

          <div className="PainterApplicantCard-months">
            {monthlyStats.map((month, idx) => (
              <button
                key={idx}
                className={`PainterApplicantCard-monthBtn ${month.status}`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterApplicantCard;
