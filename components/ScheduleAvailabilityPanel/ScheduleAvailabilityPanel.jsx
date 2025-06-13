import { useEffect, useRef, useState } from "react";
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP, STATUS_LIST } from "./constants";
import "./ScheduleAvailabilityPanel.css";
import ScheduleAvailabilityPanelLegend from "./ScheduleAvailabilityPanelLegend";

function ScheduleAvailabilityPanel({ availability = [] }) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="ScheduleAvailabilityPanel-panel">
      <div className="ScheduleAvailabilityPanel-legend">
        <span>點即可選擇狀態</span>
        {STATUS_LIST.map((status) => (
          <ScheduleAvailabilityPanelLegend
            key={status}
            color={STATUS_COLOR_MAP[status]}
            label={STATUS_LABEL_MAP[status]}
          />
        ))}
      </div>

      {/* 第一列：月份列表 */}
      <div className="ScheduleAvailabilityPanel-grid">
        <div className="ScheduleAvailabilityPanel-month-row">
          <div className="ScheduleAvailabilityPanel-cell-title">月份</div>
          <div className="ScheduleAvailabilityPanel-cell-container">
            {availability.map((m, i) => (
              <div
                className="ScheduleAvailabilityPanel-cell"
                key={i}
                style={{ position: "relative" }}
              >
                <div className="ScheduleAvailabilityPanel-month-label">
                  {m.isCurrent ? "本月" : `${m.month}月`}
                </div>
                <span
                  className="ScheduleAvailabilityPanel-month-bar left"
                  style={{
                    backgroundColor: STATUS_COLOR_MAP[m.firstHalf.status],
                  }}
                />
                <span
                  className="ScheduleAvailabilityPanel-month-bar right"
                  style={{
                    backgroundColor: STATUS_COLOR_MAP[m.secondHalf.status],
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 第二列：上半月份列表 */}
        <div className="ScheduleAvailabilityPanel-half-row">
          <div className="ScheduleAvailabilityPanel-cell-title">上半月</div>
          <div className="ScheduleAvailabilityPanel-cell-container">
            {availability.map((m, i) => (
              <div className="ScheduleAvailabilityPanel-cell" key={i}>
                <div
                  className="ScheduleAvailabilityPanel-half-block-dropdown-wrapper"
                  ref={dropdownRef}
                >
                  <div
                    className="ScheduleAvailabilityPanel-half-block"
                    style={{
                      backgroundColor: STATUS_COLOR_MAP[m.firstHalf.status],
                    }}
                    onClick={() => setOpenDropdownIndex(i)}
                  >
                    {STATUS_LABEL_MAP[m.firstHalf.status]}
                  </div>

                  {openDropdownIndex === i && (
                    <div className="ScheduleAvailabilityPanel-dropdown-menu">
                      {STATUS_LIST.filter(
                        (status) => status !== m.firstHalf.status
                      ).map((status) => (
                        <div
                          key={status}
                          className="ScheduleAvailabilityPanel-dropdown-item"
                          onClick={() => {
                            console.log("Change to:", status);
                            setOpenDropdownIndex(null);
                          }}
                        >
                          {STATUS_LABEL_MAP[status]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 第三列：下半月份列表 */}
        <div className="ScheduleAvailabilityPanel-half-row">
          <div className="ScheduleAvailabilityPanel-cell-title">下半月</div>
          <div className="ScheduleAvailabilityPanel-cell-container">
            {availability.map((m, i) => (
              <div className="ScheduleAvailabilityPanel-cell" key={i}>
                <div
                  className="ScheduleAvailabilityPanel-half-block-dropdown-wrapper"
                  ref={dropdownRef}
                >
                  <div
                    className="ScheduleAvailabilityPanel-half-block"
                    style={{
                      backgroundColor: STATUS_COLOR_MAP[m.secondHalf.status],
                    }}
                    onClick={() => setOpenDropdownIndex(`second-${i}`)}
                  >
                    {STATUS_LABEL_MAP[m.secondHalf.status]}
                  </div>

                  {openDropdownIndex === `second-${i}` && (
                    <div className="ScheduleAvailabilityPanel-dropdown-menu">
                      {STATUS_LIST.filter(
                        (status) => status !== m.secondHalf.status
                      ).map((status) => (
                        <div
                          key={status}
                          className="ScheduleAvailabilityPanel-dropdown-item"
                          onClick={() => {
                            console.log("Change to:", status);
                            setOpenDropdownIndex(null);
                          }}
                        >
                          {STATUS_LABEL_MAP[status]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleAvailabilityPanel;
