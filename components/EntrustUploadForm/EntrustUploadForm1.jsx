"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { artworkDeadlineOptions, EntrustPriceOptions } from "@/lib/artworkDropdownOptions.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import Dropdown from "@/components/Dropdown/Dropdown.jsx";
import "./EntrustUploadForm1.css";

const EntrustUploadForm1 = ({ next, formData }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const [marketName, setMarketName] = useState(formData.marketName || "");
  const [completionTime, setCompletionTime] = useState(formData.completionTime || "");
  const [price, setPrice] = useState(formData.price || "");
  const [description, setDescription] = useState(formData.description || "");

  const [isStartDateActive, setIsStartDateActive] = useState(false);
  const [isEndDateActive, setIsEndDateActive] = useState(false);



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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

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
      addToast("error", "請選擇價格區間！");
      return false;
    }
    if (!description.trim()) {
      addToast("error", "請輸入詳細解說！");
      return false;
    }
    if (!validateDates(startDate, endDate)) {
      return false;
    }
    return true;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      next({ marketName, startDate, endDate, completionTime, price, description });
    }
  };

  return (
    <div className="EntrustUploadForm1-wrapper">
      <div className="EntrustUploadForm1-container">
        <div className="EntrustUploadForm1-row">
          <div className="EntrustUploadForm1-group market-name">
            <label>市集名稱</label>
            <input type="text" placeholder="請輸入名稱，最多8個字" value={marketName} onChange={handleMarketNameChange} />
          </div>
          <div className="EntrustUploadForm1-time-container">
            <div className="EntrustUploadForm1-group">
              <label>開始時間</label>
              <input type="date" value={startDate} onChange={handleStartDateChange} className={`EntrustUploadForm1-gray-text ${isStartDateActive ? 'black-text' : ''}`} />
            </div>
            <div className="EntrustUploadForm1-group">
              <label>結束時間</label>
              <input type="date" value={endDate} onChange={handleEndDateChange} className={`EntrustUploadForm1-gray-text ${isEndDateActive ? 'black-text' : ''}`} />
            </div>
          </div>
        </div>

        <div className="EntrustUploadForm1-row">
          <div className="EntrustUploadForm1-group dealine-dropdown">
            <label>完稿時間</label>
            <Dropdown
              options={artworkDeadlineOptions}
              value={completionTime}
              onSelect={(val) => setCompletionTime(val)}
              placeholder="24小時/天數"
            />
          </div>

          <div className="EntrustUploadForm1-group price-group">
            <label>價格</label>
            <Dropdown
              options={EntrustPriceOptions}
              value={price}
              onSelect={(val) => setPrice(val)}
              placeholder="請選擇價格區間"
            />
          </div>
        </div>

        <div className="EntrustUploadForm1-group full-width">
          <label>詳細解說</label>
          <textarea placeholder="請輸入內文" value={description} onChange={handleDescriptionChange}></textarea>
        </div>

        <div className="EntrustUploadForm1-button-group">
          <button className="EntrustUploadForm1-cancel" onClick={() => router.push("/artworkPainterMarket")}>取消</button>
          <button className="EntrustUploadForm1-next" onClick={handleNextClick}>下一步</button>
        </div>
      </div>
    </div>
  );
};

export default EntrustUploadForm1;
