"use client";
import { notoSansTCClass } from '@/app/layout.js';
import PortfolioUploadForm from "@/components/PortfolioUploadForm/PortfolioUploadForm.jsx"; // 可依需求更換為 Entrust 專用 form
import "./artworkEntrustUploadPortfolio.css";

const ArtworkEntrustUploadPortfolioPage = () => {

    const handleFormSubmit = (formData) => {
        console.log("Form Data from EntrustUpload page.js:", formData);
    };
    console.log("=== 測試頁面 type 傳入 ===");

    return (
        <div className={`artworkEntrustUploadPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkEntrustUploadPortfolio-form-content">
              <PortfolioUploadForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
};

export default ArtworkEntrustUploadPortfolioPage;
