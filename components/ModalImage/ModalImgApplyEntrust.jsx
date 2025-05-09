"use client";
import React, { useState } from "react";
import "./ModalImgApplyEntrust.css";

const ModalImgApplyEntrust = ({
    isOpen,
    onClose,
    entrustData,
    entrustNickname,
    entrustProfileImg,
}) => {
    const [expectedDays, setExpectedDays] = useState("");
    const [expectedPrice, setExpectedPrice] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    if (!isOpen || !entrustData) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(files);
    };

    return (
        <div className="ModalImgApplyEntrust-overlay" onClick={onClose}>
            <div
                className="ModalImgApplyEntrust-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="ModalImgApplyEntrust-warning">
                    ❗ 平台會向委託方保管款項，於訂單完成後發放給繪師
                </p>

                <div className="ModalImgApplyEntrust-header">
                    <div className="ModalImgApplyEntrust-entrustInfo">
                        <img
                            src={entrustProfileImg}
                            alt="委託方頭像"
                            className="ModalImgApplyEntrust-profile-img"
                        />
                        <span>{entrustNickname || "委託方名稱"}</span>
                    </div>
                    <div className="ModalImgApplyEntrust-title">
                        {entrustData.marketName || "企劃標題（至多8字）"}
                    </div>
                </div>

                <div className="ModalImgApplyEntrust-section">
                    <p>金額區間：{entrustData.price || "未填寫"}</p>
                    <p>委託方希望截稿時間：{entrustData.completionTime || "未填寫"}</p>
                </div>

                <div className="ModalImgApplyEntrust-form">
                    <label>繪師確認截稿時間：</label>
                    <div className="ModalImgApplyEntrust-input-group">
                        <input
                            type="text"
                            placeholder="請輸入天數"
                            value={expectedDays}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,4}$/.test(value)) {
                                    setExpectedDays(value);
                                }
                            }}
                            maxLength={4}
                        />
                        <span className="ModalImgApplyEntrust-unit">天</span>
                    </div>


                    <label>繪師期望金額：</label>
                    <div className="ModalImgApplyEntrust-input-group">
                        <input
                            type="text"
                            placeholder="請輸入金額"
                            value={expectedPrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,6}$/.test(value)) {
                                    setExpectedPrice(value);
                                }
                            }}
                            maxLength={6}
                        />
                        <span className="ModalImgApplyEntrust-unit">元</span>
                    </div>

                    <label>上傳作品或履歷照片(JPG或PNG，最大5MB):</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={handleFileChange}
                    />
                   
                </div>

                <div className="ModalImgApplyEntrust-buttons">
                    <button className="ModalImgApplyEntrust-cancel-btn" onClick={onClose}>
                        取消
                    </button>
                    <button className="ModalImgApplyEntrust-confirm-btn">確認應徵</button>
                </div>
            </div>
        </div>
    );
};

export default ModalImgApplyEntrust;
