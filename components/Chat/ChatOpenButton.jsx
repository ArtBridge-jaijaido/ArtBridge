"use client";
import React,{useMemo} from "react";
import { useSelector } from "react-redux";
import "./ChatOpenButton.css";

const ChatOpenButton = ({ onClick}) => {

  const chats = useSelector((state) => state.chat.chats);
  const currentUser = useSelector((state) => state.user.user);
  const unreadCount = useMemo(() => {
         return chats.reduce((total, chat) => {
           const count = chat.unreadCounts?.[currentUser?.uid] || 0;
           return total + count;
         }, 0);
       }, [chats, currentUser?.uid]);
  

  return (
    <button className="ChatOpenButton-btn" onClick={onClick}>
      <img src="/images/icons8-message-96-8.png" alt="Chat Icon" className="ChatOpenButton-icon" />
      { (
        <span className="ChatOpenButton-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
      )}
    </button>
  );
};

export default ChatOpenButton;
