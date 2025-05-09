"use client";
import React, { useState } from "react";
import "./EntrustUploadForm5.css";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx"; 


const EntrustUploadForm5 = ({ prev, next, formData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [milestones, setMilestones] = useState([
    { label: "0% 支付款項", id: 0 },
    { label: "30% 草稿", id: 1 },
    { label: "40% 線稿", id: 2 },
    { label: "80% 上色", id: 3 },
    { label: "100% 完稿", id: 4 }
  ]);

  const handleDelete = (id) => {
    setMilestones((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m, index) => ({
          ...m,
          id: index,
        }))
    );
  };

  const handlePublishClick = async () => {
    setIsLoading(true);
    try {
     
      await next({ milestones }); // 若 next 是同步可移除 await
    
    } catch (error) {
      console.error("發佈失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="EntrustUploadForm5-wrapper">
      <div className="EntrustUploadForm5-container">
        <h2 className="EntrustUploadForm5-title">委託流程</h2>

        <div className="EntrustUploadForm5-list">
          {milestones.map((m, index) => (
            <React.Fragment key={m.id}>
              <div className="EntrustUploadForm5-item">
                <div className="EntrustUploadForm5-circle" />
                <div className="EntrustUploadForm5-percent">{m.label.split(" ")[0]}</div>
                <div className="EntrustUploadForm5-label">{m.label.split(" ")[1]}</div>
                {(m.label.includes("線稿") || m.label.includes("上色")) && (
                  <button className="EntrustUploadForm5-delete" onClick={() => handleDelete(m.id)}>刪除</button>
                )}
              </div>
              {index !== milestones.length - 1 && <div className="EntrustUploadForm5-connector-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="EntrustUploadForm5-button-group">
          <button className="EntrustUploadForm5-prev" onClick={() => prev()}>上一步</button>
          <LoadingButton
            isLoading={isLoading}
            onClick={handlePublishClick}
            loadingText="發佈中..."
            className="EntrustUploadForm5-next"
          >
            發佈
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default EntrustUploadForm5;
