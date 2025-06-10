// "use client"; 
// import { notoSansTCClass } from '@/app/layout.js';
// import PortfolioUploadForm from "@/components/PortfolioUploadForm/PortfolioUploadForm.jsx";
// import "./artworkUploadPortfolio.css"; 

// const ArtworkUploadPortfolioPage = () => {

//     const handleFormSubmit = (formData) => {
//         console.log("Form Data from page.js:", formData); 
//     };

//     return (
//         <div className={`artworkUploadPortfolio-page ${notoSansTCClass}`}>
//             <div className="artworkUploadPortfolio-form-content">
//                 <PortfolioUploadForm onSubmit={handleFormSubmit} />
//             </div>
//         </div>
//     );
// }


// export default ArtworkUploadPortfolioPage

"use client";
import { useSelector } from "react-redux";
import { notoSansTCClass } from '@/app/layout.js';
import PortfolioUploadForm from "@/components/PortfolioUploadForm/PortfolioUploadForm.jsx";
import PortfolioEntrustUploadForm from "@/components/PortfolioEntrustUploadForm/PortfolioEntrustUploadForm.jsx";
import "./artworkUploadPortfolio.css";

const ArtworkUploadPortfolioPage = () => {
    const { user } = useSelector((state) => state.user);

    const handleFormSubmit = (formData) => {
        console.log("📤 Form Data:", formData);
    };

    const renderForm = () => {
        if (!user) return null;

        if (user.role === "artist") {
            return <PortfolioUploadForm onSubmit={handleFormSubmit} />;
        }

        if (user.role === "client") {
            return <PortfolioEntrustUploadForm onSubmit={handleFormSubmit} />;
        }

        return <p>不支援的角色：{user.role}</p>;
    };

    return (
        <div className={`artworkUploadPortfolio-page ${notoSansTCClass}`}>
            <div className="artworkUploadPortfolio-form-content">
                {renderForm()}
            </div>
        </div>
    );
};

export default ArtworkUploadPortfolioPage;

