"use client";
import React, { useState, useEffect, useRef } from "react";
import { fileFormatOptions, permissionOptions } from "@/lib/artworkDropdownOptions.js";
import { useToast } from "@/app/contexts/ToastContext.js";
import "./MarketUploadForm3.css";

const MarketUploadFormPage3 = ({ prev, next,formData  }) => {
    const { addToast } = useToast();
    const [fileFormat, setFileFormat] = useState(formData.fileFormat || "");
    const [size, setSize] = useState(formData.size || "");
    const [permission, setPermission] = useState(formData.permission || "");
    const [rejectedTypes, setRejectedTypes] = useState(formData.rejectedTypes || "");

    const [isFileFormatOpen, setIsFileFormatOpen] = useState(false);
    const [sizeError, setSizeError] = useState("");
    const [isPermissionOpen, setIsPermissionOpen] = useState(false);


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

    const marketFileFormatOptions = fileFormatOptions;
    const marketPermissionOptions = permissionOptions;

    const handleSizeChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            if (value.length > 4) {
                addToast("error", "尺寸最多 4 位數！");
            } else {
                setSize(value);
                setSizeError("");
            }
        } else {
            addToast("error", "只能輸入數字！");
        }
    };

    const validateForm = () => {
        if (!fileFormat) {
            addToast("error", "請選擇檔案格式！");
            return false;
        }
        if (!size || size.length > 4 || isNaN(size)) {
            addToast("error", "請輸入最多 4 位數的尺寸！");
            return false;
        }
        if (!permission) {
            addToast("error", "請選擇權限設定！");
            return false;
        }
        return true;
    };

    const handleNextClick = () => {
        if (validateForm()) {
            next({
                rejectedTypes,
                fileFormat,
                size,
                permission
            });
        }
    };

    return (
        <div className="MarketUploadForm3-wrapper">
            <div className="MarketUploadForm3-container">
                <div className="MarketUploadForm3-group">
                    <label>拒絕接洽的類型</label>
                    <textarea
                        placeholder="請輸入拒絕接洽的案件類型"
                        value={rejectedTypes}
                        onChange={(e) => setRejectedTypes(e.target.value)}
                    />
                </div>

                <div className="MarketUploadForm3-row">
                    <div className="MarketUploadForm3-group file-type" ref={fileFormatRef}>
                        <label>完成後的檔案格式</label>
                        <div
                            className={`MarketUploadForm3-dropdown ${isFileFormatOpen ? "open" : ""}`}
                            onClick={() => setIsFileFormatOpen(!isFileFormatOpen)}
                        >
                            <div className={`MarketUploadForm3-dropdown-selected ${fileFormat ? "black-text" : "gray-text"}`}>
                                {fileFormat || "JPG.PNG.GIF"}
                            </div>
                            {isFileFormatOpen && (
                                <div className="MarketUploadForm3-dropdown-options">
                                    {marketFileFormatOptions.map((option, index) => (
                                        <div key={index} className="MarketUploadForm3-dropdown-option" onClick={() => {
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
                    </div>
                </div>

                <div className="MarketUploadForm3-group permission" ref={permissionRef}>
                    <label>權限</label>
                    <div className={`MarketUploadForm3-dropdown ${isPermissionOpen ? "open" : ""}`} onClick={() => setIsPermissionOpen(!isPermissionOpen)}>
                        <div className={`MarketUploadForm3-dropdown-selected ${permission ? "black-text" : "gray-text"}`}>
                            {permission || "請選擇權限"}
                        </div>
                        {isPermissionOpen && (
                            <div className="MarketUploadForm3-dropdown-options">
                                {marketPermissionOptions.map((option, index) => (
                                    <div key={index} className="MarketUploadForm3-dropdown-option" onClick={() => {
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

                <div className="MarketUploadForm3-button-group">
                    <button className="MarketUploadForm3-prev" onClick={prev}>上一步</button>
                    <button className="MarketUploadForm3-next" onClick={handleNextClick}>下一步</button>
                </div>
            </div>
        </div>
    );
};

export default MarketUploadFormPage3;
