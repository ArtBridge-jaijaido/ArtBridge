"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notoSansTCClass } from '@/app/layout.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import EntrustProgressBar from "@/components/MarketProgressBar/MarketProgressBar.jsx";
import EntrustUploadForm1 from "@/components/EntrustUploadForm/EntrustUploadForm1.jsx";
import EntrustUploadForm2 from "@/components/EntrustUploadForm/EntrustUploadForm2.jsx";
import EntrustUploadForm3 from "@/components/EntrustUploadForm/EntrustUploadForm3.jsx";
import EntrustUploadForm4 from "@/components/EntrustUploadForm/EntrustUploadForm4.jsx";
import EntrustUploadForm5 from "@/components/EntrustUploadForm/EntrustUploadForm5.jsx";
import "./artworkUploadEntrust.css";
import { useSelector } from "react-redux";
import { uploadEntrust } from "@/services/artworkEntrustService";
import { createOrderFromEntrust } from "@/services/artworkOrderService.js";
import {updateEntrustLinkedOrderId } from "@/services/artworkEntrustService.js";
import { useDispatch } from "react-redux";
import { addEntrust } from "@/app/redux/feature/entrustSlice"
import { addConsumerOrder} from "@/app/redux/feature/artworkOrderSlice";


const ArtworkUploadEntrustPage = () => {
  const dispatch = useDispatch();
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
    fileFormat: "",
    size: "",
    reportProgress: "",
    colorMode: "",
    permission: "",
    milestones: [],
    assignedArtist: "",
    selectedCategory: "",
    selectedStyles: [],
    usage: ""
  });

  const handleNext = (newData) => {
    setFormData({ ...formData, ...newData });
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = (newData) => {
    setFormData({ ...formData, ...newData });
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = async (newData) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    const userSerialId = user?.userSerialId;
    const userUid = user?.uid;
    const response = await uploadEntrust(userUid, userSerialId, updatedData);
    if (response.success) {

      dispatch(addEntrust(response.entrustData));

      // 同步建立 artworkOrder 
      const orderResponse = await createOrderFromEntrust(response.entrustData);
      if (orderResponse.success) {
        dispatch(addConsumerOrder(orderResponse.orderData)); 
        const createdOrder = orderResponse.orderData;
        
        addToast("success", "已發佈您的委託！");
        setStep(6);

        // 更新 artworkOrder 的 id 到 entrust
        try {
          await updateEntrustLinkedOrderId(userUid, createdOrder.fromEntrustId, createdOrder.artworkOrderId);
        } catch (err) {
          console.error(" linkedOrderId 更新失敗", err);
         
        }
      } else {
        console.error("建立 artworkOrder 失敗", orderResponse.message);
        addToast("error", "建立案件管理資料失敗");
      }
     
     
    } else {
      addToast("error", "發佈失敗，請稍後再試！");
    }
  };

  return (
    <div className={`artworkUploadEntrust-page ${notoSansTCClass}`}>
      <div className="artworkUploadEntrust-progressbar">
        {step !== 6 && <EntrustProgressBar step={step} totalSteps={5} />}
      </div>
      <div className="artworkUploadEntrust-form-content">
        {step === 1 && <EntrustUploadForm1 next={handleNext} formData={formData} />}
        {step === 2 && <EntrustUploadForm2 prev={handlePrev} next={handleNext} formData={formData} />}
        {step === 3 && <EntrustUploadForm3 prev={handlePrev} next={handleNext} formData={formData} />}
        {step === 4 && <EntrustUploadForm4 prev={handlePrev} next={handleNext} formData={formData} />}
        {step === 5 && <EntrustUploadForm5 prev={handlePrev} next={handlePublish} formData={formData} />}
        {step === 6 && (
          <div className="artworkUploadEntrust-success">
            <img src="/images/success-icon.gif" alt="成功" className="artworkUploadEntrust-success-icon" />
            <h2 className="artworkUploadEntrust-success-message">您的委託已成功發佈！</h2>
            <button className="artworkUploadEntrust-success-button" onClick={() => router.push("/artworkEntrustMarket")}>
              前往我的委託
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkUploadEntrustPage;
