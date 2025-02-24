"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import MarketProgressBar from "@/components/MarketProgressBar/MarketProgressBar.jsx";
import MarketUploadForm1 from "@/components/MarketUploadForm/MarketUploadForm1.jsx";
import MarketUploadForm2 from "@/components/MarketUploadForm/MarketUploadForm2.jsx";
import MarketUploadForm3 from "@/components/MarketUploadForm/MarketUploadForm3.jsx";
import MarketUploadForm4 from "@/components/MarketUploadForm/MarketUploadForm4.jsx";
import "./artworkUploadMarket.css";
import { useSelector, useDispatch } from "react-redux";
import { uploadArtwork } from "@/services/artworkMarketService";

const ArtworkUploadMarketPage = () => {
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { user } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        marketName: "",
        startDate: "",
        endDate: "",
        completionTime: "",
        price: "",
        description: "",
        exampleImage: null,
        exampleImageName: "",
        supplementaryImages: [],
        supplementaryImageName: [],
        rejectedTypes: "",
        fileFormat: "",
        size: "",
        permission: "",
        selectedCategory: "",
        selectedStyles: [],
        reference: ""
    });

    const handleNext = (newData) => {
        setFormData({ ...formData, ...newData });
        if (step < 4) setStep(step + 1);
    };

    const handleprev = (newData) => {
        setFormData({ ...formData, ...newData });
        if (step > 1) setStep(step - 1);
    };

    // const handlePublish = (newData) => {
    //     const updatedData = { ...formData, ...newData };
    //     setFormData(updatedData);
    //     setStep(5);
    //     console.log("提交的資料：",updatedData); 

    // };

    const handlePublish = async (newData) => {
        const updatedData = { ...formData, ...newData };
        setFormData(updatedData);
        const userSerialId = user?.userSerialId;
        const userUid = user?.uid;
        const response = await uploadArtwork(userUid, userSerialId, updatedData);
        if (response.success) {
            addToast("success", "作品已成功上傳！");
            setStep(5); // 成功頁面
        } else {
            console.error("❌ 上傳失敗:", response.message);
            addToast("error", "上傳失敗，請稍後再試");
        }
    };

    return (
        <div className={`artworkUploadMarket-page ${notoSansTCClass}`}>
            <div className="artworkUploadMarket-progressbar">
                {/* 進度條 (步驟 5 成功畫面不顯示進度條) */}
                {step !== 5 && <MarketProgressBar step={step} totalSteps={4} />}
            </div>
            <div className="artworkUploadMarket-form-content">
                {step === 1 && <MarketUploadForm1 next={handleNext} formData={formData} />}
                {step === 2 && <MarketUploadForm2 prev={handleprev} next={handleNext} formData={formData} />}
                {step === 3 && <MarketUploadForm3 prev={handleprev} next={handleNext} formData={formData} />}
                {step === 4 && <MarketUploadForm4 prev={handleprev} next={handlePublish} formData={formData} />}

                {/* 成功提交畫面 */}
                {step === 5 && (
                    <div className="artworkUploadMarket-success-page">
                        <img src="/images/success-icon.gif" alt="成功" className="success-icon" />
                        <h2 className="success-message">已成功上傳！</h2>
                        <button className="success-button" onClick={() => router.push("/artworkPainterMarket")}>
                            我的市集
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}


export default ArtworkUploadMarketPage
