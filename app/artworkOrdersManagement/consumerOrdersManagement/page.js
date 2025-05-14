"use client";
import { useEffect } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkOrderManagementTabs from '@/components/Tabs/ArtworkOrderManagementTab';
import ArtworkOrderCard from "@/components/ArtworkOrderCard/ArtworkOrderCard.jsx";
import "./consumerOrdersManagement.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const ConsumerOrdersManagementPage = () => {
  

    const artworkOrders = useSelector((state) => state.artworkOrder.artworkOrders);

  
  
    const tabs = [
        {
            label: "目前案件",
            content:
                <div className="ConsumerOrdersManagement-currentCase-container">
                  {artworkOrders.map((order, index) => (
                    <ArtworkOrderCard
                        key={order.artworkOrderId}
                        orderIndex={index + 1}
                        statusLabel={order.status}
                        OrderTitle={order.marketName}
                        OrderSource={order.orderSource}
                        OrderEndDate={order.endDate}
                        orderId={order.artworkOrderId}
                        imageUrl={order.exampleImageUrl || ""}
                    />
                ))}
                </div>,
        },
        {
            label: "歷史案件",
            content: <div>Consumer歷史案件內容</div>,
        },
        {
            label: "行事曆",
            content: <div>Consumer行事曆內容</div>,
        },
        {
            label: "查看詳細資料",
            content: <div>Consumer查看詳細資料內容</div>,
        }
    ]





    return (
        <div className={`consumerOrdersManagementPage ${notoSansTCClass}`} >
            <div className="consumerOrdersManagement-tab-container">
                < ArtworkOrderManagementTabs tabs={tabs} />
            </div>
        </div>
    )


}


export default ConsumerOrdersManagementPage;