"use client"; 
import React, {useState, useEffect} from 'react'
import "./ArtworkPainterCalendar.css";
import "@fontsource/inter"; 

const ArtworkPainterCalendar = ({completion, reputation,statusData}) => {
  const [indicatorBarColors, setIndicatorBarColors] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    // 取得當前月份並生成接下來的5個月份
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    
    const generatedMonths = ["本月", ...Array.from({ length: 5 }, (_, i) => monthNames[(currentMonth + i + 1) % 12])];
    setMonths(generatedMonths);

    //行事曆狀態
    if (statusData) {
      const colors = statusData.map(status => {
        return status.map(item => {
          if (item === 2) return "bar-red";       
          if (item === 1) return "bar-green";     
          return "bar-gray";     
        });
      });
      setIndicatorBarColors(colors);
    } 
  }, [statusData]);

    return (
        <div className="ArtworkPainterCalendar-calendar-wrapper">
        <div className="ArtworkPainterCalendar-calendar-container">
          <div className="ArtworkPainterCalendar-calendar-content">
            <div className="ArtworkPainterCalendar-calendar-main">
              <div className="ArtworkPainterCalendar-calendar-section">
                <div className="ArtworkPainterCalendar-calendar-header">
                  <div className="ArtworkPainterCalendar-calendar-title">繪師行事曆</div>
                  <div className="ArtworkPainterCalendar-status-indicators">
                    <div className="ArtworkPainterCalendar-status-item">
                      <div className="ArtworkPainterCalendar-status-dot status-dot-gray"></div>
                      <div className="ArtworkPainterCalendar-status-text">無資訊</div>
                    </div>
                    <div className="ArtworkPainterCalendar-status-item">
                      <div className="ArtworkPainterCalendar-status-dot status-dot-red"></div>
                      <div className="ArtworkPainterCalendar-status-text">已額滿</div>
                    </div>
                    <div className="ArtworkPainterCalendar-status-item">
                      <div className="ArtworkPainterCalendar-status-dot status-dot-green"></div>
                      <div className="ArtworkPainterCalendar-status-text">尚有空閒</div>
                    </div>
                  </div>
                </div>
                {/*月份和狀態動態改變*/}
                <div className="ArtworkPainterCalendar-months-grid">
                    {months.map((month, index) => (
                        <div className="ArtworkPainterCalendar-month-card" key={index}>
                            <div className="ArtworkPainterCalendar-month-text">{month}</div>
                            <div className="ArtworkPainterCalendar-month-indicator">
                                {indicatorBarColors[index]?.map((colorClass, i) => (
                                    <div
                                      key={i}
                                      className={`ArtworkPainterCalendar-indicator-bar ${colorClass}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="ArtworkPainterCalendar-stats-column">
              <div className="ArtworkPainterCalendar-stats-container">
                <div className="ArtworkPainterCalendar-stats-item">
                  <div className="ArtworkPainterCalendar-stat-label">準時完成率</div>
                  <div className="ArtworkPainterCalendar-stat-value">{completion}</div>
                </div>
                <div className="ArtworkPainterCalendar-stat-item">
                  <div className="ArtworkPainterCalendar-stat-label">信譽評分</div>
                  <div className="ArtworkPainterCalendar-stat-value">{reputation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div> 
    )
}
export default ArtworkPainterCalendar
