import { notoSansTCClass } from '@/app/layout.js';
import ArtworkOrderManagementTabs from '@/components/Tabs/ArtworkOrderManagementTab';
import ArtworkOrderCard from "@/components/ArtworkOrderCard/ArtworkOrderCard.jsx";
import "./consumerOrdersManagement.css";

const ConsumerOrdersManagementPage = () => {


    const tabs = [
        {
            label: "目前案件",
            content:
                <div className="ConsumerOrdersManagement-currentCase-container">
                    <ArtworkOrderCard
                        orderIndex="1"
                        statusLabel="等待承接"
                        OrderTitle="封面插畫"
                        OrderSource="我的邀約 / 繪師應徵"
                        OrderEndDate="2025/01/05 ~ 2025/02/05"
                        orderId="00000000"
                        imageUrl=""
                    />
                    <ArtworkOrderCard
                        orderIndex="2"
                        statusLabel="進行中"
                        OrderTitle="角色設計"
                        OrderSource="我的邀約 / 繪師應徵"
                        OrderEndDate="2025/03/01 ~ 2025/04/01"
                        orderId="00000000"
                        imageUrl=""
                    />
                    <ArtworkOrderCard
                        orderIndex="3"
                        statusLabel="準時完成"
                        OrderTitle="角色設計"
                        OrderSource="我的邀約 / 繪師應徵"
                        OrderEndDate="2025/03/05 ~ 2025/04/11"
                        orderId="00000000"
                        imageUrl=""
                    />
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