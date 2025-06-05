"use client"; 
import { notoSansTCClass } from '@/app/layout.js';
import PortfolioUploadForm from "@/components/PortfolioUploadForm/PortfolioUploadForm.jsx";
import "./artworkUploadPortfolio.css"; 
import { useSearchParams } from 'next/navigation';

const ArtworkUploadPortfolioPage = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'painter'; // 預設為 'painter'
    const handleFormSubmit = (formData) => {
        console.log("Form Data from page.js:", formData); 
    };

    return (
        <div className={`artworkUploadPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkUploadPortfolio-form-content">
                <PortfolioUploadForm type={type} onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}


export default ArtworkUploadPortfolioPage
