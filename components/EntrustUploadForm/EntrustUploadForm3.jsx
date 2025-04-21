"use client";
import React, { useState, useEffect } from "react";
import { fileFormatOptions, permissionOptions, EntrustReportProgressOptions, EntrustColorModeOptions } from "@/lib/artworkDropdownOptions.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import Dropdown from "@/components/Dropdown/Dropdown.jsx";
import "./EntrustUploadForm3.css";

const EntrustUploadForm3 = ({ prev, next, formData }) => {
  const { addToast } = useToast();
  const [fileFormat, setFileFormat] = useState(formData.fileFormat || "");
  const [size, setSize] = useState(formData.size || "");
  const [permission, setPermission] = useState(formData.permission || "");
  const [reportProgress, setReportProgress] = useState(formData.reportProgress || "");
  const [colorMode, setColorMode] = useState(formData.colorMode || "");
  const [artist, setArtist] = useState(formData.artist || "");

  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const allArtists = ["小明 (@xiaoming)", "阿花 (@ahua)", "夜貓子 (@nightcat)", "光光 (@guangguang)"];

  const handleSizeChange = (e) => {
    const value = e.target.value;
    if (/^[\d*xX]*$/.test(value)) {
      if (value.length > 9) {
        addToast("error", "尺寸最多 9 個字！");
      } else {
        setSize(value);
      }
    } else {
      addToast("error", "只能輸入數字、* 或 x！");
    }
  };

  const handleArtistInputChange = (e) => {
    const input = e.target.value;
    setArtist(input);
    if (input.trim()) {
      const filtered = allArtists.filter((a) => a.toLowerCase().includes(input.toLowerCase()));
      setArtistSuggestions(filtered);
    } else {
      setArtistSuggestions([]);
    }
  };

  const handleSelectArtist = (name) => {
    setArtist(name);
    setArtistSuggestions([]);
  };

  const validateForm = () => {
    if (!fileFormat || !size || !permission || !reportProgress || !colorMode) {
      addToast("error", "請完整填寫所有欄位");
      return false;
    }
    return true;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      next({ fileFormat, size, permission, reportProgress, colorMode, artist });
    }
  };

  return (
    <div className="EntrustUploadForm3-wrapper">
      <div className="EntrustUploadForm3-container">
        {/* row 1 */}
        <div className="EntrustUploadForm3-row">
          <div className="EntrustUploadForm3-group file-type">
            <label>完成後的檔案格式</label>
            <Dropdown
              options={fileFormatOptions}
              value={fileFormat}
              onSelect={setFileFormat}
              placeholder="請選擇格式"
            />
          </div>

          <div className="EntrustUploadForm3-group file-size">
            <label>作品尺寸</label>
            <div className="EntrustUploadForm3-size-input">
              <input type="text" placeholder="請輸入尺寸" value={size} onChange={handleSizeChange} />
              <span>px</span>
            </div>
          </div>
        </div>

        {/* row 2 */}
        <div className="EntrustUploadForm3-row">
          <div className="EntrustUploadForm3-group file-type">
            <label>回報進度</label>
            <Dropdown
              options={EntrustReportProgressOptions}
              value={reportProgress}
              onSelect={setReportProgress}
              placeholder="請選擇"
            />
          </div>

          <div className="EntrustUploadForm3-group file-size">
            <label>色彩模式</label>
            <Dropdown
              options={EntrustColorModeOptions}
              value={colorMode}
              onSelect={setColorMode}
              placeholder="請選擇"
            />
          </div>
        </div>

        {/* row 3 */}
        <div className="EntrustUploadForm3-row">
          <div className="EntrustUploadForm3-group file-type">
            <label>權限</label>
            <Dropdown
              options={permissionOptions}
              value={permission}
              onSelect={setPermission}
              placeholder="請選擇"
            />
          </div>

          <div className="EntrustUploadForm3-group file-size">
            <label>指定一名繪師</label>
            <input
              type="text"
              placeholder="請輸入繪師名或帳號"
              value={artist}
              onChange={handleArtistInputChange}
              className="EntrustUploadForm3-artist-input"
            />
            {artistSuggestions.length > 0 && (
              <ul className="EntrustUploadForm3-suggestion-list">
                {artistSuggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSelectArtist(item)}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="EntrustUploadForm3-button-group">
          <button className="EntrustUploadForm3-prev" onClick={prev}>上一步</button>
          <button className="EntrustUploadForm3-next" onClick={handleNextClick}>下一步</button>
        </div>
      </div>
    </div>
  );
};

export default EntrustUploadForm3;
