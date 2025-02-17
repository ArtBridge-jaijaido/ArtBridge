"use client";
import React, { useState ,useEffect, useRef } from "react";
import "./MarketUploadForm3.css";

const MarketUploadFormPage3 = ({ prev, next }) => {
    const [fileFormat, setFileFormat] = useState("");
    const [isFileFormatOpen, setIsFileFormatOpen] = useState(false);
    
    const [size, setSize] = useState("");
    const [sizeError, setSizeError] = useState(""); 
    const [permission, setPermission] = useState("");
    const [isPermissionOpen, setIsPermissionOpen] = useState(false);
    
    const [rejectedTypes, setRejectedTypes] = useState("");
    const fileFormatRef = useRef(null);
    const permissionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fileFormatRef.current && !fileFormatRef.current.contains(event.target)) {
                setIsFileFormatOpen(false);
            }
            if (permissionRef.current && !permissionRef.current.contains(event.target)) {
                setIsPermissionOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    

    const fileFormatOptions = ["JPG", "PNG", "GIF"];
    const permissionOptions = [
        "繪師可將成品公開發佈",
        "繪師不會將成品公開發佈",
        "雙方討論後決定最終權限",
    ];

    const handleSizeChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // 只允許數字
            setSize(value);
            setSizeError(""); // 清除錯誤訊息
        } else {
            setSizeError("只能輸入數字！"); // 顯示錯誤訊息
        }
    };

    return (
        <div className="MarketUploadForm3-wrapper">
            <div className="MarketUploadForm3-container">

                {/* 拒絕接洽的類型 */}
                <div className="MarketUploadForm3-group">
                    <label>拒絕接洽的類型</label>
                    <textarea
                        placeholder="請輸入拒絕接洽的案件類型"
                        value={rejectedTypes}
                        onChange={(e) => setRejectedTypes(e.target.value)}
                    />
                </div>

                {/* 檔案格式 & 作品尺寸 */}
                <div className="MarketUploadForm3-row">
                    <div className="MarketUploadForm3-group file-type" ref={fileFormatRef}>
                        <label>完成後的檔案格式</label>
                        <div
                            className={`dropdown ${isFileFormatOpen ? "open" : ""}`}
                            onClick={() => setIsFileFormatOpen(!isFileFormatOpen)}
                        >
                            <div className={`dropdown-selected ${fileFormat ? "black-text" : "gray-text"}`}>
                                {fileFormat || "JPG.PNG.GIF"}
                            </div>
                            {isFileFormatOpen && (
                                <div className="dropdown-options">
                                    {fileFormatOptions.map((option, index) => (
                                        <div key={index} className="dropdown-option" onClick={() => {
                                            setFileFormat(option);
                                            setIsFileFormatOpen(false);
                                        }}>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="MarketUploadForm3-group file-size">
                        <label>作品尺寸</label>
                        <div className="MarketUploadForm3-size-input">
                            <input
                                type="text" 
                                placeholder="請輸入尺寸"
                                value={size}
                                onChange={handleSizeChange} 
                            />
                            <span>px</span>
                        </div>
                        {sizeError && <p className="error-message">{sizeError}</p>} {/* 顯示錯誤訊息 */}
                    </div>
                </div>

                {/* 權限 */}
                <div className="MarketUploadForm3-group permission" ref={permissionRef}>
                    <label>權限</label>
                    <div className={`dropdown ${isPermissionOpen ? "open" : ""}`} onClick={() => setIsPermissionOpen(!isPermissionOpen)}>
                        <div className={`dropdown-selected ${permission ? "black-text" : "gray-text"}`}>
                            {permission || "請選擇權限"}
                        </div>
                        {isPermissionOpen && (
                            <div className="dropdown-options">
                                {permissionOptions.map((option, index) => (
                                    <div key={index} className="dropdown-option" onClick={() => {
                                        setPermission(option);
                                        setIsPermissionOpen(false);
                                    }}>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 按鈕區域 */}
                <div className="MarketUploadForm3-button-group">
                    <button className="MarketUploadForm3-prev" onClick={prev}>上一步</button>
                    <button className="MarketUploadForm3-next" onClick={next}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage3;
