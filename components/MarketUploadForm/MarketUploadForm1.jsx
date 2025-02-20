"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 
import { artworkDeadlineOptions } from "@/lib/artworkDropdownOptions.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./MarketUploadForm1.css";

const MarketUploadFormPage1 = ({ next, formData }) => {
    const router = useRouter(); 
    const { addToast } = useToast();
    const [marketName, setMarketName] = useState(formData.marketName || "");
    const [completionTime, setCompletionTime] = useState(formData.completionTime || "");
    const [price, setPrice] = useState(formData.price || "");
    const [description, setDescription] = useState(formData.description || "");

    const [isStartDateActive, setIsStartDateActive] = useState(false);
    const [isEndDateActive, setIsEndDateActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const marketDealineOptions = artworkDeadlineOptions;
    const dropdownRef = useRef(null); 

    const handleSelect = (option) => {
        setCompletionTime(option);
        setIsOpen(false);
    };

   
    const handleMarketNameChange = (e) => {
        const value = e.target.value;
        if (value.length > 8) {
            addToast("error", "市集名稱最多 8 個字！");
        } else {
            setMarketName(value);
        }
    };

    const getFormattedDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    };

    const [startDate, setStartDate] = useState(formData.startDate || getFormattedDate());
    const [endDate, setEndDate] = useState(formData.endDate || getFormattedDate());

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        setIsStartDateActive(true);
    };
    
    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        setIsEndDateActive(true);
    };

    const validateDates = (start, end) => {
        if (new Date(start) > new Date(end)) {
            addToast("error", "開始時間不能晚於結束時間！");
            return false;
        }
        return true;
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            if (parseInt(value, 10) > 100000) {
                addToast("error", "價格不能超過 10 萬元！");
            } else {
                setPrice(value);
            }
        } else {
            addToast("error", "只能輸入數字！");
        }
    };


    const handleDescriptionChange = (e) => {
        setDescription(e.target.value); 
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const validateForm = () => {
        if (!marketName.trim()) {
            addToast("error", "請輸入市集名稱！");
            return false;
        }
        if (!completionTime) {
            addToast("error", "請選擇完稿時間！");
            return false;
        }
        if (!price.trim()) {
            addToast("error", "請輸入價格！");
            return false;
        }
        if (!description.trim()) { 
            addToast("error", "請輸入詳細解說！");
            return false;
        }
        if (!validateDates(startDate, endDate)) {
            return false; // 檢查開始時間與結束時間
        }
        return true;
    };

    const handleNextClick = () => {
        if (validateForm()) {
            next({
                marketName,
                startDate,
                endDate,
                completionTime,
                price,
                description
            });
        }
    };

    return (
        <div className="MarketUploadForm1-wrapper">
            <div className="MarketUploadForm1-container">
                <div className="MarketUploadForm1-row">
                    <div className="MarketUploadForm1-group market-name">
                        <label>市集名稱</label>
                        <input type="text" placeholder="請輸入名稱，最多8個字" value={marketName} onChange={handleMarketNameChange} />
                    </div>
                    <div className="MarketUploadForm1-time-container">
                        <div className="MarketUploadForm1-group">
                            <label>開始時間</label>
                            <input type="date" value={startDate} onChange={handleStartDateChange} 
                                className={`MarketUploadForm1-gray-text ${isStartDateActive ? 'black-text' : ''}`}
                            />
                        </div>
                        <div className="MarketUploadForm1-group">
                            <label>結束時間</label>
                            <input type="date" value={endDate} onChange={handleEndDateChange} 
                                className={`MarketUploadForm1-gray-text ${isEndDateActive ? 'black-text' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="MarketUploadForm1-row">
                    <div className="MarketUploadForm1-group dealine-dropdown" ref={dropdownRef}>
                        <label>完搞時間</label>
                        <div className={`MarketUploadForm1-dropdown ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                            <div className={`MarketUploadForm1-dropdown-selected ${completionTime ? 'black-text' : 'gray-text'}`}>{completionTime || "24小時/天數"}</div>
                            {isOpen && (
                                <div className="MarketUploadForm1-dropdown-options">
                                    {marketDealineOptions.map((option, index) => (
                                        <div key={index} className="MarketUploadForm1-dropdown-option" onClick={() => handleSelect(option)}>{option}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="MarketUploadForm1-group price-group">
                        <label>價格</label>
                        <div className="MarketUploadForm1-price-input">
                            <input type="text" placeholder="請輸入價格 (新台幣)" value={price} onChange={handlePriceChange} />
                            <span>元</span>
                        </div>
                    </div>
                </div>

                <div className="MarketUploadForm1-group full-width">
                    <label>詳細解說</label>
                    <textarea placeholder="請輸入內文" value={description} onChange={handleDescriptionChange}></textarea>
                </div>

                <div className="MarketUploadForm1-button-group">
                    <button className="MarketUploadForm1-cancel" onClick={() => router.push("/artworkPainterMarket")}>取消</button>
                    <button className="MarketUploadForm1-next" onClick={handleNextClick}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage1;
