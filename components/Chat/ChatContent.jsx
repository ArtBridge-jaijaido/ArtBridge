import React, { useState } from "react";
import PainterMilestoneProgress from "../PainterMilestoneProgress/PainterMilestoneProgress";
import "./ChatContent.css";

const ChatContent = ({ chat }) => {
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);

    const testingMilestones = [
        { label: "0% 支付款項", percent: 0, id: 0, status: "等待中" },
        { label: "30% 草稿", percent: 30, id: 1, status: "等待中" },
        { label: "40% 線稿", percent: 40, id: 2, status: "等待中" },
        { label: "70% 上色", percent: 3, id: 3, status: "等待中" },
        { label: "100% 交付成品", percent: 100, id: 4, status: "等待中" },
    ];

    if (!chat) return null;

    return (
        <div className="chatContent">
            <div className="chatContent-header">
                <img src={chat.avatarUrl} alt="avatar" className="chatContent-avatar" />
                <div className="chatContent-userInfo">
                    <div className="chatContent-username">{chat.username}</div>
                    <div className="chatContent-online">3天前上線</div>
                </div>
                <button
                    className={`chatContent-manageBtn ${isMilestoneOpen ? "open" : ""}`}
                    onClick={() => setIsMilestoneOpen(!isMilestoneOpen)}
                >
                    案件管理
                </button>
            </div>

            <div className={`chatContent-milestone-container ${isMilestoneOpen ? "visible" : "hidden"}`}>
                <PainterMilestoneProgress milestones={testingMilestones} status={true} />
                <div className="chatContent-divider"></div>
            </div>

            <div className="chatContent-messages">
                {/* <div className="chatContent-date">2024/02/01</div>
                    <div className="chatContent-systemMsg">
                    <div className="systemMsg-bubble">
                        <strong>您已付款，該案件開始進行。</strong><br />
                        截稿時間：剩餘15天又20小時15分
                    </div>
                    <div className="systemMsg-time">13:59</div>
                    </div> */}
                {chat.preview}
            </div>

            <div className="chatContent-inputBar">
                <input
                    className="chatContent-input"
                    type="text"
                    placeholder="請輸入訊息……"
                />
                <button className="chatContent-sendBtn">➤</button>
                <button className="chatContent-attachBtn">📎</button>
            </div>
        </div>
    );
};

export default ChatContent;
