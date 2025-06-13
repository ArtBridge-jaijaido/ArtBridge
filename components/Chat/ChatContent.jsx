"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import PainterMilestoneProgress from "../PainterMilestoneProgress/PainterMilestoneProgress";
import { formatLastOnline } from "@/lib/functions";
import { subscribeToMessages } from "@/lib/messageListener";
import { sendTextMessage, sendImageMessage } from "@/services/messageService";
import { updateUserData } from "@/services/userService";
import { fetchArtworkOrderById } from "@/services/artworkOrderService";
import { useToast } from "@/app/contexts/ToastContext";
import MessageItem from "./ChatMessageItem";
import dayjs from "dayjs";
import "./ChatContent.css";







const ChatContent = ({ chat }) => {

    const [artworkOrder, setArtworkOrder] = useState(null); // 當下聊天的藝術品訂單
    const orderId = chat?.orderId; // 從 chat 中獲取 orderId
    const [inputText, setInputText] = useState(""); // 新增輸入狀態
    const imageInputRef = useRef(null);
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
    const allUsers = useSelector((state) => state.user.allUsers);
    const currentUser = useSelector((state) => state.user.user);
    const otherUid = chat?.participants?.find((uid) => uid !== currentUser?.uid);
    const otherUser = allUsers?.[otherUid] || {};
    const lastOnlineText = formatLastOnline(otherUser?.lastOnline);
    const { addToast } = useToast();

    const messages = useSelector(
        (state) => state.messages.messageMap[chat?.id] || []
    );

    // 處理發送訊息的邏輯
    const handleTextSend = async () => {
        if (!inputText.trim()) return;
        if (!chat?.id) {
            addToast("error", "請選擇傳送訊息對象");
            return;
        }
        try {
            await sendTextMessage(chat, currentUser.uid, inputText.trim());
            setInputText(""); // 清空輸入框
        } catch (err) {
            console.error(" 發送訊息失敗", err);
        }
    };

    // 處理發送圖片訊息的邏輯
    const handleImageSend = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!chat?.id) {
            addToast("error", "請選擇傳送對象");
            return;
        }

        // 限制檔案格式
        if (!file.type.startsWith("image/")) {
            addToast("error", "只能上傳圖片檔案");
            return;
        }

        try {
            await sendImageMessage(chat, currentUser.uid, file);
            e.target.value = ""; // 清空 input，允許再次選擇相同圖片
        } catch (err) {
            console.error("圖片訊息發送失敗", err);
            addToast("error", "圖片發送失敗");
        }
    };



    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleTextSend();
        }
    };

    const handlePayNow =  async ()  => {
        const res = await fetch("/api/newebpay/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              artistNickname: otherUser.nickname || "繪師",
              amount: artworkOrder?.price,
              orderId: artworkOrder?.artworkOrderId,
              artistUid: artworkOrder?.assignedPainterUid,
              expectedDays:null,
              expectedPrice: null,
              type: "market",
            }),
          });
        
          const html = await res.text();
        
          
          const blob = new Blob([html], { type: "text/html" });
          const url = URL.createObjectURL(blob);
        
          
          window.location.href = url;
      };

    let manageButton = null;
    const isEntruster = currentUser?.uid === artworkOrder?.userUid;
    // 根據第一個里程碑的狀態決定顯示的按鈕
    const firstMilestoneStatus = artworkOrder?.artworkOrderMilestones?.[0]?.status;
    switch (firstMilestoneStatus) {
    case "等待中":
        manageButton = isEntruster ? (
        <button
            className="chatContent-manageBtn-payNowEntrustOnly"
            onClick={handlePayNow}
        >
            點此立即付款
        </button>
        ) : null;
        break;

    case "已付款":
        manageButton = (
        <button
            className={`chatContent-manageBtn ${isMilestoneOpen ? "open" : ""}`}
            onClick={() => setIsMilestoneOpen(!isMilestoneOpen)}
        >
            案件管理
        </button>
        );
        break;

    default:
        manageButton = null; // 其他狀態不顯示任何按鈕
    }
    

    // 當 orderId 改變時，重新獲取該訂單資料
    useEffect(() => {
        if (!orderId) return;    
        const fetchOrder = async () => {
          const data = await fetchArtworkOrderById(orderId);
          setArtworkOrder(data);
        };
      
        fetchOrder();
    }, [orderId]);




    useEffect(() => {
        if (!chat?.id || !currentUser?.uid) return;

        // 使用者開啟聊天室時，更新 Firestore 裡的 currentOpenChatId
        updateUserData(currentUser.uid, { currentOpenChatId: chat.id });

        // 訂閱訊息變化
        const unsubscribe = subscribeToMessages(chat.id);

        //  當聊天室被關閉（或切換聊天室）時，清空 currentOpenChatId 並取消訂閱
        return () => {
            updateUserData(currentUser.uid, { currentOpenChatId: null });
            unsubscribe();
        };
    }, [chat?.id, currentUser?.uid]);

    

    const groupedMessagesByDate = useMemo(() => {
        const groups = {};
        messages.forEach((msg) => {
            const dateKey = dayjs(msg.createdAt).format("YYYY/MM/DD");
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(msg);
        });
        return groups;
    }, [messages]);



    return (
        <div className="chatContent">
            {chat && (
                <>
                    <div className="chatContent-header">
                        <img src={otherUser.profileAvatar || "/images/default-avatar.png"} alt="avatar" className="chatContent-avatar" />
                        <div className="chatContent-userInfo">
                            <div className="chatContent-username">{otherUser.nickname}</div>
                            <div className="chatContent-online">{lastOnlineText}</div>
                        </div>
                        {/* <button
                            className={`chatContent-manageBtn ${isMilestoneOpen ? "open" : ""}`}
                            onClick={() => setIsMilestoneOpen(!isMilestoneOpen)}
                        >
                            案件管理
                        </button> */}
                        {manageButton}
                        <img src="/images/icons8-exclamation-mark-64-1.png" alt="檢舉按鈕" className="chatContent-reportIcon" />
                    </div>

                    <div className={`chatContent-milestone-container ${isMilestoneOpen ? "visible" : "hidden"}`}>
                        <PainterMilestoneProgress milestones={artworkOrder?.artworkOrderMilestones||[]} status={true} />
                        <div className="chatContent-divider"></div>
                    </div>


                </>
            )}

            {/* 訊息區塊 */}
            <div className="chatContent-messages">
                {Object.entries(groupedMessagesByDate).map(([date, msgs]) => (
                    <div key={date}>
                        <div className="chatContent-date-divider">{date}</div>
                        {msgs.map((msg) => (
                            <MessageItem
                                key={msg.id}
                                message={msg}
                                isOwn={msg.senderUid === currentUser?.uid}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* 輸入區固定在底部 */}
            <div className="chatContent-inputBar">
                <input
                    className="chatContent-input"
                    type="text"
                    placeholder="請輸入訊息……"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="chatContent-sendBtn" onClick={handleTextSend}>
                    ➤
                </button>
                <button
                    className="chatContent-attachBtn"
                    onClick={() => imageInputRef.current?.click()}
                >
                    📎
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageSend}
                />
            </div>
        </div>
    );
};

export default ChatContent;