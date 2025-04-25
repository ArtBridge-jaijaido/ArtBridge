"use client";
import React from "react";
import ArtworkEntrustCard from "@/components/ArtworkEntrustCard/ArtworkEntrustCard.jsx";

const ArtworkEntrustMarketCard = ({ imageSrc, title, price, isHistoryTab }) => {
  return (
    <ArtworkEntrustCard
      imageSrc={imageSrc}
      title={title}
      price={price}
      isHistoryTab={isHistoryTab}
    />
  );
};

export default ArtworkEntrustMarketCard;
