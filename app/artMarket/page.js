"use client";
import React from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import CustomIconButton from '@/components/CustomButton/CustomIconButton.jsx';
import ArtMarketDropButton from '@/components/CustomButton/ArtMarketDropButton.jsx';
import { artMarketProduct, artMarketCategory, artMarketStyle, artMarketPirceRange, artMarketDeadline } from '@/lib/artMarketDropdownOptions.js';


import "./artMarket.css";

const artMarketPage = () => {

    const handleOptionSelect = (option) => {
        console.log("選中的選項:", option);
        // 這裡可以寫更多的業務邏輯
      };



    return (



        <>
            <div className={`artMarket-page ${notoSansTCClass}`}>


                <div className="artMarket-iconButton-container">
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-24h-service-56-1.png" alt="artMarket-icon" text="24H速貨" />
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-top-96-11.png" alt="artMarket-icon" text="收藏TOP" />
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-fire-100-1.png" alt="artMarket-icon" text="熱銷" />
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-time-48-1.png" alt="artMarket-icon" text="限時搶購" />
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-idea-40-1.png" alt="artMarket-icon" text="即將上架" />
                    <CustomIconButton iconSrc="/images/artMarketImage/icons8-new-40-1.png" alt="artMarket-icon" text="最新上架" />
                </div>

                <div className="artMarket-dropdownButton-container">
                    <ArtMarketDropButton buttonText="價格最低" options={artMarketProduct} onOptionSelect={handleOptionSelect} />
                    <ArtMarketDropButton buttonText="類別選擇" options={artMarketCategory} onOptionSelect={handleOptionSelect} />
                    <ArtMarketDropButton buttonText="風格選擇" options={artMarketStyle} onOptionSelect={handleOptionSelect} />
                    <ArtMarketDropButton buttonText="價格區間" options={ artMarketPirceRange} onOptionSelect={handleOptionSelect} />
                    <ArtMarketDropButton buttonText="完稿時間" options={artMarketDeadline} onOptionSelect={handleOptionSelect} />
                  
                </div>

            </div>

        </>
    )
}

export default artMarketPage
