"use client"
import React from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkPainterAccountSettingTabs from '@/components/Tabs/ArtworkPainterAccountSettingTab.jsx';
import './artworkPainterAccountSetting.css';

const ArtworkPainterAccountSettingPage = () => {

  const tabs = [
    {
      label: "帳號設定",
      
    },
    {
      label: "個人檔案設定",
     
    },
    {
      label: "封鎖名單",
     
    },
    {
      label: "官方驗證🚨",
      
    }
  ]

  return (
    <div className={`artworkPainterAccountSettingPage ${notoSansTCClass}`}>
        <ArtworkPainterAccountSettingTabs tabs={tabs} />
    </div>
  )
}

export default ArtworkPainterAccountSettingPage 
