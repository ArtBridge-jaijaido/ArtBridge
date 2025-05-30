"use client";
import React, { useState, useEffect } from "react";
import "./ModalImgApplyEntrust.css";
import { useToast } from "@/app/contexts/ToastContext.js";
import { useSelector } from "react-redux";
import { handlePainterApplyEntrust, checkIfPainterApplied } from "@/services/artworkOrderService.js";
import { useDispatch } from "react-redux";
import { updateEntrust} from "@/app/redux/feature/entrustSlice.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import { triggerNotificationOnApply } from "@/services/notificationService";


const ModalImgApplyEntrust = ({
    isOpen,
    onClose,
    entrustData,
    entrustNickname,
    entrustProfileImg,
}) => {
    const [expectedDays, setExpectedDays] = useState("");
    const [expectedPrice, setExpectedPrice] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const currentUser = useSelector((state) => state.user.user);    // 當前應徵繪師
    const  [isSaving, setIsSaving] = useState(false); 
    const dispatch = useDispatch();
    
    
    const { addToast } = useToast();

    useEffect(() => {
        if (!isOpen) {
          setExpectedDays("");
          setExpectedPrice("");
          setUploadedFiles([]);
        }
      }, [isOpen]);

    if (!isOpen || !entrustData) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(files);
    };

    const handleConfirmApply = async () => {
        // 新增登入狀態檢查
        if (!currentUser || !currentUser.uid) {
            addToast("error", "請先登入後再應徵");
            console.error("未登入使用者，無法應徵");
            return;
        }

      
        
        if (!expectedDays || !expectedPrice|| uploadedFiles.length === 0) {
            addToast("error", "請完整填寫並上傳履歷");
            return;
        }

        const isAlreadyApplied = await checkIfPainterApplied(
            entrustData.linkedArtworkOrderId,
            currentUser.uid
          );

        if (isAlreadyApplied) {
            addToast("error", "您已經應徵過該委託，請勿重複應徵");
            return;
        }

        setIsSaving(true);

        const file = uploadedFiles[0]; 

        try {
            await handlePainterApplyEntrust({
              file,
              user: currentUser,
              expectedDays,
              expectedPrice,
              orderId: entrustData.linkedArtworkOrderId,
              entrustId: entrustData.entrustId,
              entrustUserUid: entrustData.userUid,
            });

            console.log(entrustData.entrustId)
            // 新增 log 檢查登入使用者 uid
            console.log("觸發通知 userId:", currentUser.uid);

            await triggerNotificationOnApply({
                targetUserId: entrustData.userUid,
                artistUid: currentUser.uid,
                entrustTitle: entrustData.marketName || "未命名委託",
                entrustId: entrustData.entrustId
              });   //新增通知
                          

            dispatch(updateEntrust({
                entrustId: entrustData.entrustId,
                applicationCount: entrustData.applicationCount + 1,
              }));
        
            addToast("success", "應徵成功！");
            onClose();
          } catch (err) {
            console.error(" 應徵失敗:", err);
            addToast("error", "應徵失敗，請稍後再試");
          }finally{
            setIsSaving(false);
          }
    };

    return (
        <div className="ModalImgApplyEntrust-overlay" onClick={onClose}>
            <div
                className="ModalImgApplyEntrust-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="ModalImgApplyEntrust-warning">
                    ❗ 平台會向委託方保管款項，於訂單完成後發放給繪師
                </p>

                <div className="ModalImgApplyEntrust-header">
                    <div className="ModalImgApplyEntrust-entrustInfo">
                        <img
                            src={entrustProfileImg}
                            alt="委託方頭像"
                            className="ModalImgApplyEntrust-profile-img"
                        />
                        <span>{entrustNickname || "委託方名稱"}</span>
                    </div>
                    <div className="ModalImgApplyEntrust-title">
                        {entrustData.marketName || "企劃標題（至多8字）"}
                    </div>
                </div>

                <div className="ModalImgApplyEntrust-section">
                    <p>金額區間：{entrustData.price || "未填寫"}</p>
                    <p>委託方希望截稿時間：{entrustData.completionTime || "未填寫"}</p>
                </div>

                <div className="ModalImgApplyEntrust-form">
                    <label>繪師確認截稿時間：</label>
                    <div className="ModalImgApplyEntrust-input-group">
                        <input
                            type="text"
                            placeholder="請輸入天數"
                            value={expectedDays}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,4}$/.test(value)) {
                                    setExpectedDays(value);
                                }
                            }}
                            maxLength={4}
                        />
                        <span className="ModalImgApplyEntrust-unit">天</span>
                    </div>


                    <label>繪師期望金額：</label>
                    <div className="ModalImgApplyEntrust-input-group">
                        <input
                            type="text"
                            placeholder="請輸入金額"
                            value={expectedPrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,6}$/.test(value)) {
                                    setExpectedPrice(value);
                                }
                            }}
                            maxLength={6}
                        />
                        <span className="ModalImgApplyEntrust-unit">元</span>
                    </div>

                    <label>上傳履歷 (僅限 PDF，最大 5MB):</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                </div>

                <div className="ModalImgApplyEntrust-buttons">
                    <button className="ModalImgApplyEntrust-cancel-btn" onClick={onClose}>
                        取消
                    </button>
                    <LoadingButton
                        className="ModalImgApplyEntrust-confirm-btn"
                        onClick={handleConfirmApply}
                        isLoading={isSaving}
                        loadingText="應徵中..."
                    >
                        確認應徵
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default ModalImgApplyEntrust;
