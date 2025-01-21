"use client";
import React, { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterDetail from '@/components/ArtworkPainterDetail/ArtworkPainterDetail.jsx';
import Pagination from '@/components/Pagination/Pagination.jsx';
import "./ArtworkPainterProfile.css";


const ArtworkPainterProfilePage = () => {
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
         return () => {
        document.removeEventListener("mousedown", handleClickOutside);
         };
    }, []);

    return (
        <div className={`artworkPainterProfilePage ${notoSansTCClass}`}>
            <div className="artworkPainterDetail-container">
               {currentItems.map((_, index) => (
                    <ArtworkPainterDetail key={index} />
                ))}
            </div>
        </div>
    )
}

export default ArtworkPainterProfilePage