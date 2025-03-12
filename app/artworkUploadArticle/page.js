"use client"; 
import { notoSansTCClass } from '@/app/layout.js';
import ArticleUploadForm from "@/components/ArticleUploadForm/ArticleUploadForm.jsx";
import "./artworkUploadArticle.css"; 

const ArtworkUploadArticlePage = () => {

    const handleFormSubmit = (formData) => {
        console.log("Form Data from page.js:", formData); 
    };

    return (
        <div className={`artworkUploadArticle-page ${notoSansTCClass}`}>
            <div className="artworkUploadArticle-form-content">
                <ArticleUploadForm onSubmit={handleFormSubmit} />

            </div>
        </div>
    );
}


export default  ArtworkUploadArticlePage
