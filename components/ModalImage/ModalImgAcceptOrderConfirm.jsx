import React, { useState,useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./ModalImgAcceptOrderConfirm.css";


const ModalImgAcceptOrderConfirm = ({ isOpen, onClose, onConfirm }) => {
    const [daysToStart, setDaysToStart] = useState(null);
    const [daysToComplete, setDaysToComplete] = useState("");
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen) {
          setDaysToStart(null);
          setDaysToComplete("");
        }
      }, [isOpen]);

    const handleSubmit = () => {
        
        // 檢查開始時間是否選擇
        if (!daysToStart) {
            addToast("error", "請選擇開始時間");
            return;
        }
        // 檢查完稿天數是否為正整數
        if (!daysToComplete || isNaN(daysToComplete) || parseInt(daysToComplete) <= 0) {
            addToast("error", "請輸入正確完稿天數");
            return;
        }

        onConfirm(startDate, parseInt(daysToComplete));
    };

    // 不顯示的狀態直接 return null
    if (!isOpen) return null;

    return (
        <div className="ModalImgAcceptOrderConfirm-overlay" onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}>
            <div className="ModalImgAcceptOrderConfirm-box" onClick={(e) => e.stopPropagation()} >
                <button
                    className="ModalImgAcceptOrderConfirm-close-btn"
                    onClick={onClose}
                    aria-label="關閉"
                >
                    ×
                </button>

                <p className="ModalImgAcceptOrderConfirm-title">
                    您已確認承接此案件，可以選擇開始時間。
                </p>
                <p className="ModalImgAcceptOrderConfirm-subtitle">
                    委託方將於開始前3日付款。
                </p>

                <div className="ModalImgAcceptOrderConfirm-input-group">
                <label>開始時間：</label>
                <input
                    type="date"
                    value={daysToStart || ""}
                    onChange={(e) => setDaysToStart(e.target.value)}
                    className="ModalImgAcceptOrderConfirm-input"
                />
                </div>

                <div className="ModalImgAcceptOrderConfirm-input-group">
                    <label>完稿天數：</label>
                    <input
                        type="number"
                        value={daysToComplete}
                        onChange={(e) => setDaysToComplete(e.target.value)}
                        placeholder="請輸入完稿天數"
                        className="ModalImgAcceptOrderConfirm-input"
                    />
                </div>

                <button
                    className="ModalImgAcceptOrderConfirm-confirm-btn"
                    onClick={handleSubmit}
                >
                    確認
                </button>
            </div>
        </div>
    );
};

export default ModalImgAcceptOrderConfirm;
