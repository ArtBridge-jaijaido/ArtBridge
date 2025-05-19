"use client";
import React, { useState } from "react";
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
  const [startDate, setStartDate] = useState(formData.startDate || getToday());
  const [endDate, setEndDate] = useState(formData.endDate || getToday());

  function getToday() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }

  const validateForm = () => {
    if (!marketName.trim()) return addToast("error", "請輸入市集名稱！");
    if (marketName.length >8) return addToast("error", "市集名稱最多 8 個字！");
    if (!completionTime) return addToast("error", "請選擇完稿時間！");
    if (!price.trim()) return addToast("error", "請選擇價格！");
    if (!description.trim()) return addToast("error", "請輸入詳細解說！");
    if (new Date(startDate) > new Date(endDate)) {
      return addToast("error", "開始時間不能晚於結束時間！");
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
    <div className="EntrustUploadForm1-wrapper">
      <div className="EntrustUploadForm1-container">
        {/* 第一列：市集名稱 + 開始/結束時間 */}
        <div className="EntrustUploadForm1-row">
          <div className="EntrustUploadForm1-group market-name">
            <label>委託名稱</label>
            <input
              type="text"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              placeholder="請輸入名稱，最多8個字"
            />
          </div>
          <div className="EntrustUploadForm1-time-container">
            <div className="EntrustUploadForm1-group">
              <label>開始時間</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="EntrustUploadForm1-group">
              <label>結束時間</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 第二列：完稿時間 + 價格 */}
        <div className="EntrustUploadForm1-row">
          <div className="EntrustUploadForm1-group deadline-dropdown">
            <label>完稿時間</label>
            <Dropdown
              className="entrustUpload-dropdown"
              options={artworkDeadlineOptions}
              value={completionTime}
              onSelect={(val) => setCompletionTime(val)}
              placeholder="24小時/天數"
            />
          </div>
          <div className="EntrustUploadForm1-group price-group">
            <label>價格</label>
            <Dropdown
              className="entrustUpload-dropdown"
              options={EntrustPriceOptions}
              value={price}
              onSelect={(val) => setPrice(val)}
              placeholder="請選擇價格區間"
            />
          </div>
        </div>

        {/* 第三列：詳細解說 */}
        <div className="EntrustUploadForm1-group full-width">
          <label>詳細解說</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="請輸入內文"
          />
        </div>

        {/* 按鈕列 */}
        <div className="EntrustUploadForm1-button-group">
          <button
            className="EntrustUploadForm1-cancel"
            onClick={() => router.push("/artworkEntrustMarket")}
          >
            取消
          </button>
          <button className="EntrustUploadForm1-next" onClick={handleNextClick}>
            下一步
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntrustUploadForm1;
