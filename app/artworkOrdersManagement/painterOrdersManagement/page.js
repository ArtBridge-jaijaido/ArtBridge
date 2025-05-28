"use client";
import { notoSansTCClass } from '@/app/layout.js';
import ArtworkOrderManagementTabs from '@/components/Tabs/ArtworkOrderManagementTab';
import ArtworkOrderCard from "@/components/ArtworkOrderCard/ArtworkOrderCard.jsx";
import { useSelector } from "react-redux";

import "./painterOrdersManagement.css";



const painterOrdersManagementPage =() =>{

    const painterOrders = useSelector((state) => state.artworkOrder.painterOrders);

    

    const tabs = [
        {
            label: "目前案件",
            content: (
              <div className="painterOrdersManagement-currentCase-container">
                {[...painterOrders]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order, index) => (
                    <ArtworkOrderCard
                      key={order.artworkOrderId}
                      orderIndex={index + 1}
                      statusLabel={order.status}
                      OrderTitle={order.marketName}
                      OrderSource={order.orderSource}
                      OrderEndDate={order.endDate}
                      OrderAssignedPainter={order.assignedPainterUid}
                      orderId={order.artworkOrderId}
                      imageUrl={order.exampleImageUrl || ""}
                    />
                  ))}
              </div>
            ),
        },
        {
            label: "歷史案件",
            content: <div>painter歷史案件內容</div>,
        },
        {
            label: "行事曆",
            content: <div>painter行事曆內容</div>,
        },
        {
            label: "查看詳細資料",
            content: <div>painter查看詳細資料內容</div>,
        }
    ]


    return (
        <div className={`painterOrdersManagementPage ${notoSansTCClass}`} >
          <div className="painterOrdersManagement-tab-container">
            < ArtworkOrderManagementTabs tabs={tabs} />
          </div>
        </div>
      )

}


export default painterOrdersManagementPage;