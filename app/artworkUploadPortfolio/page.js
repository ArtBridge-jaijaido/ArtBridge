"use client"; 
import { notoSansTCClass } from '@/app/layout.js';
import PortfolioUploadForm from "@/components/PortfolioUploadForm/PortfolioUploadForm.jsx";
import "./artworkUploadPortfolio.css"; 

const ArtworkUploadPortfolioPage = () => {

    const handleFormSubmit = (formData) => {
        console.log("Form Data from page.js:", formData); 
    };

    return (
        <div className={`artworkUploadPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkUploadPortfolio-form-content">
                <PortfolioUploadForm onSubmit={handleFormSubmit} />

            </div>
        </div>
    );
}


export default ArtworkUploadPortfolioPage
