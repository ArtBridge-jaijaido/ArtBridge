"use client";
import { notoSansTCClass } from "@/app/layout.js";
import { ArtworkCalendar } from "@/components/ArtworkCalendar/ArtworkCalendar";
import ArtworkOrderCard from "@/components/ArtworkOrderCard/ArtworkOrderCard.jsx";
import ArtworkOrderManagementTabs from "@/components/Tabs/ArtworkOrderManagementTab";
import { useSelector } from "react-redux";
import "./consumerOrdersManagement.css";

const ConsumerOrdersManagementPage = () => {
  const consumerOrders = useSelector(
    (state) => state.artworkOrder.consumerOrders
  );
  const tabs = [
    {
      label: "目前案件",
      content: (
        <div className="consumerOrdersManagement-currentCase-container">
          {[...consumerOrders]
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
                OrderEntruster={order.userUid}
                orderId={order.artworkOrderId}
                exampleImageUrl={order.exampleImageUrl || ""}
                referenceImageUrl={order.referenceImageUrl || ""}
                customRequirement={order.customRequirement || ""}
              />
            ))}
        </div>
      ),
    },
    {
      label: "歷史案件",
      content: <div>Consumer歷史案件內容</div>,
    },
    {
      label: "行事曆",
      content: <ArtworkCalendar orders={consumerOrders} />,
    },
    {
      label: "查看詳細資料",
      content: <div>Consumer查看詳細資料內容</div>,
    },
  ];

  return (
    <div className={`consumerOrdersManagementPage ${notoSansTCClass}`}>
      <div className="consumerOrdersManagement-tab-container">
        <ArtworkOrderManagementTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default ConsumerOrdersManagementPage;
