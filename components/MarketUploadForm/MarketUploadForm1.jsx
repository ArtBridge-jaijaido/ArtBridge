"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 
import "./MarketUploadForm1.css";

const MarketUploadFormPage1 = ({ next }) => {
    const router = useRouter(); 
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [price, setPrice] = useState(""); 
    const [priceError, setPriceError] = useState("")

    const dropdownRef = useRef(null); 

    const options = [
        "24小時",
        "2～7天",
        "8～14天",
        "15～30天",
        "31天以上",
    ];

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false); // 選擇後關閉選單
    };

     // 價格限制只能輸入數字
     const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // 只允許數字
            setPrice(value);
            setPriceError(""); 
        } else {
            setPriceError("只能輸入數字！"); // 顯示錯誤訊息
        }
    };

    // 當點擊選單外部時自動關閉
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="MarketUploadForm1-wrapper">
        <div className="MarketUploadForm1-container">

            {/* 第一列：市集名稱、開始時間、結束時間 */}
            <div className="MarketUploadForm1-row">
                <div className="MarketUploadForm1-group market-name">
                    <label>市集名稱</label>
                    <input type="text" placeholder="請輸入名稱，最多8個字" />
                </div>

            {/* 第二列：開始時間、結束時間 */}
                <div className="MarketUploadForm1-time-container">
                    <div className="MarketUploadForm1-group">
                        <label>開始時間</label>
                        <input type="date" defaultValue="2025-05-01" className="gray-text"/>
                    </div>
                    <div className="MarketUploadForm1-group">
                        <label>結束時間</label>
                        <input type="date" defaultValue="2025-05-30" className="gray-text"/>
                    </div>
                </div>
            </div>

            {/* 第二列：完稿時間、價格 */}
            <div className="MarketUploadForm1-row">
            <div className="MarketUploadForm1-group dealine-dropdown"  ref={dropdownRef}>
                <label>完搞時間</label>
                <div className={`dropdown ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <div className={`dropdown-selected ${selectedOption ? 'black-text' : 'gray-text'}`}>
                                {selectedOption || "24小時/天數"}
                    </div>
                    {isOpen && (
                        <div className="dropdown-options">
                            {options.map((option, index) => (
                                <div 
                                    key={index} 
                                    className="dropdown-option"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
                <div className="MarketUploadForm1-group price-group">
                    <label>價格</label>
                    <div className="MarketUploadForm1-price-input">
                        <input
                            type="text" 
                            placeholder="請輸入價格 (新台幣)"
                            value={price}
                            onChange={handlePriceChange} 
                        />
                        <span>元</span>
                    </div>
                    {priceError && <p className="error-message">{priceError}</p>} {/* 修正：顯示錯誤訊息 */}
                </div>
            </div>

            {/* 第三列：詳細解說 */}
            <div className="MarketUploadForm1-group full-width">
                <label>詳細解說</label>
                <textarea placeholder="請輸入內文"></textarea>
            </div>

            {/* 按鈕區域 */}
            <div className="MarketUploadForm1-button-group">
                <button className="MarketUploadForm1-cancel" onClick={() => router.push("/artworkPainterMarket")}>取消</button>
                <button className="MarketUploadForm1-next" onClick={next}>下一步</button>
            </div>
        </div>
        </div>
    );
};

export default MarketUploadFormPage1;
