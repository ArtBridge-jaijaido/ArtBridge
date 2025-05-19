import { notoSansTCClass } from '@/app/layout.js';
import ArtworkOrderManagementTabs from '@/components/Tabs/ArtworkOrderManagementTab';
import "./painterOrdersManagement.css";

const painterOrdersManagementPage =() =>{

    const tabs = [
        {
            label: "目前案件",
            content: <div>painter目前案件內容</div>,
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