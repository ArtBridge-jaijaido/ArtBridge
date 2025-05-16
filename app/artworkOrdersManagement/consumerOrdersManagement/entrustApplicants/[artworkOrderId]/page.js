"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchEntrustPainterApplicants } from "@/services/artworkOrderService";
import PainterApplicantCard from "@/components/PainterApplicantCard/PainterApplicantCard";
import { useSelector } from "react-redux";
import "./entrustApplicants.css";

const EntrustApplicantsPage = () => {
  const { artworkOrderId } = useParams();
  const router = useRouter();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const allUsers = useSelector((state) => state.user.allUsers);

  useEffect(() => {
    const getApplicants = async () => {
      const data = await fetchEntrustPainterApplicants(artworkOrderId);
      setApplicants(data);
    };
    getApplicants();
    setLoading(false);
  }, [artworkOrderId ]);

 

  return (
    <div className="entrustApplicants-page">
    <div className="entrustApplicants-button-container">
      <button className="entrustApplicants-back-button" onClick={() => router.back()}>
        ← 返回案件管理
      </button>
    </div>


      {loading ? (
        <p>載入中...</p>
      ) : applicants.length === 0 ? (
        <p>目前尚無人應徵此委託。</p>
      ) : (
        <div className="entrustApplicants-applicants-container">
          {applicants.map((applicant, index) => {
             const user = allUsers[applicant.painterUid];
             return(
            <PainterApplicantCard
              key={index}
              artistNickname={user?.nickname || "使用者名稱"}
              artistProfileImg={user?.profileAvatar ||"/images/kv-min-4.png"}
              expectedDays={applicant.expectedDays}
              expectedPrice={applicant.expectedPrice}
              resumeUrl={applicant.resumePdfUrl}
              completionRate={100}
              reputationScore={100} 
              monthlyStats={[
                { label: "本月", status: "red" },
                { label: "1月", status: "green" },
                { label: "2月", status: "gray" },
                { label: "3月", status: "green" },
                { label: "4月", status: "green" },
                { label: "5月", status: "gray" },
            ]}
            />
          );
        })}
        </div>
      )}
    </div>
  );
};

export default EntrustApplicantsPage;