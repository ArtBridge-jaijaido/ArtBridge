import React, { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./ModalImgAcceptOrderConfirm.css";

const ModalImgAcceptOrderConfirm = ({ isOpen, onClose, onConfirm }) => {
    const [dateToStart, setDateToStart] = useState(null);
    const [completionDays, setCompletionDays] = useState("");
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setDateToStart(null);
            setCompletionDays("");
        }
    }, [isOpen]);

    const handleConfirm = (e) => {
        e.stopPropagation();

        if (!dateToStart) {
            addToast("error", "請選擇開始時間");
            return;
        }

        const selectedDate = new Date(dateToStart);

        // 今天（淨化時間）
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 今天 + 3 天
        const minAllowedDate = new Date(today);
        minAllowedDate.setDate(minAllowedDate.getDate() + 4);
        
        //  檢查是否早於今天
        if (selectedDate < today) {
          addToast("error", "開始時間不能早於今天");
          return;
        }
        
        //  檢查是否 <= 今天 + 4 天（排除 =）
        if (selectedDate <= minAllowedDate) {
        
          addToast("error", `為等待委託方付款，選擇的開始時間需為T+3天後`);
          return;
        }

        if (!completionDays || isNaN(completionDays) || parseInt(completionDays) <= 0) {
            addToast("error", "請輸入正確完稿天數");
            return;
        }

        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + parseInt(completionDays));
        const dateToEnd = endDate.toISOString().split("T")[0];

       
        onConfirm(e, dateToStart, dateToEnd);
    };

    if (!isOpen) return null;

    return (
        <div
            className="ModalImgAcceptOrderConfirm-overlay"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className="ModalImgAcceptOrderConfirm-box" onClick={(e) => e.stopPropagation()}>
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
                        value={dateToStart || ""}
                        onChange={(e) => setDateToStart(e.target.value)}
                        className="ModalImgAcceptOrderConfirm-input"
                    />
                </div>

                <div className="ModalImgAcceptOrderConfirm-input-group">
                    <label>完稿天數：</label>
                    <input
                        type="number"
                        value={completionDays}
                        onChange={(e) => setCompletionDays(e.target.value)}
                        placeholder="請輸入完稿天數"
                        className="ModalImgAcceptOrderConfirm-input"
                    />
                </div>

                <button
                    className="ModalImgAcceptOrderConfirm-confirm-btn"
                    onClick={handleConfirm}
                >
                    確認
                </button>
            </div>
        </div>
    );
};

export default ModalImgAcceptOrderConfirm;
