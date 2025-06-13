import {
  fetchAvailability,
  initAvailabilityIfMissing,
  updateAvailability,
} from "@/services/availabilityService"; // assuming these functions exist
import { useEffect, useRef, useState } from "react";
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP, STATUS_LIST } from "./constants";
import "./ScheduleAvailabilityPanel.css";
import ScheduleAvailabilityPanelLegend from "./ScheduleAvailabilityPanelLegend";

function ScheduleAvailabilityPanel({
  userUid,
  currentUserUid,
  availability: initialAvailability = [],
}) {
  const [availability, setAvailability] = useState(initialAvailability);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    if (!userUid) return;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // 如果是使用者自己本身則先初始化自己的資料
    if (currentUserUid == userUid) {
      initAvailabilityIfMissing(userUid, currentYear, currentMonth).then(() => {
        fetchAvailability(userUid, currentYear, currentMonth).then((data) => {
          setAvailability(data);
        });
      });
    }

    fetchAvailability(userUid, currentYear, currentMonth).then((data) => {
      setAvailability(data);
    });
  }, [userUid]);

  const handleStatusChange = (index, half, newStatus) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index] = {
      ...updatedAvailability[index],
      [half]: newStatus,
    };
    const target = updatedAvailability[index];
    updateAvailability({
      userUid,
      year: target.year,
      month: target.month,
      firstHalf: target.firstHalf,
      secondHalf: target.secondHalf,
    }).then(() => {
      setAvailability(updatedAvailability);
      setOpenDropdownIndex(null);
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))
      ) {
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
            {availability.map((info, index) => (
              <div
                className="ScheduleAvailabilityPanel-cell"
                key={info.month}
                style={{ position: "relative" }}
              >
                <div className="ScheduleAvailabilityPanel-month-label">
                  {index === 0 ? "本月" : `${info.month}月`}
                </div>
                <span
                  className="ScheduleAvailabilityPanel-month-bar left"
                  style={{
                    backgroundColor: STATUS_COLOR_MAP[info.firstHalf],
                  }}
                />
                <span
                  className="ScheduleAvailabilityPanel-month-bar right"
                  style={{
                    backgroundColor: STATUS_COLOR_MAP[info.secondHalf],
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
            {availability.map((info, index) => (
              <div className="ScheduleAvailabilityPanel-cell" key={info.month}>
                <div
                  className="ScheduleAvailabilityPanel-half-block-dropdown-wrapper"
                  ref={(el) => (dropdownRefs.current[index] = el)}
                >
                  <div
                    className="ScheduleAvailabilityPanel-half-block"
                    style={{
                      backgroundColor: STATUS_COLOR_MAP[info.firstHalf],
                    }}
                    onClick={() => {
                      if (currentUserUid !== userUid) return;
                      setOpenDropdownIndex(index);
                    }}
                  >
                    {STATUS_LABEL_MAP[info.firstHalf]}
                  </div>

                  {openDropdownIndex === index && (
                    <div className="ScheduleAvailabilityPanel-dropdown-menu">
                      {STATUS_LIST.filter(
                        (status) => status !== info.firstHalf
                      ).map((status) => (
                        <div
                          key={status}
                          className="ScheduleAvailabilityPanel-dropdown-item"
                          onClick={() => {
                            handleStatusChange(index, "firstHalf", status);
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
            {availability.map((info, index) => (
              <div className="ScheduleAvailabilityPanel-cell" key={index}>
                <div
                  className="ScheduleAvailabilityPanel-half-block-dropdown-wrapper"
                  ref={(el) =>
                    (dropdownRefs.current[availability.length + index] = el)
                  }
                >
                  <div
                    className="ScheduleAvailabilityPanel-half-block"
                    style={{
                      backgroundColor: STATUS_COLOR_MAP[info.secondHalf],
                    }}
                    onClick={() => {
                      if (currentUserUid !== userUid) return;
                      setOpenDropdownIndex(`second-${index}`);
                    }}
                  >
                    {STATUS_LABEL_MAP[info.secondHalf]}
                  </div>

                  {openDropdownIndex === `second-${index}` && (
                    <div className="ScheduleAvailabilityPanel-dropdown-menu">
                      {STATUS_LIST.filter(
                        (status) => status !== info.secondHalf
                      ).map((status) => (
                        <div
                          key={status}
                          className="ScheduleAvailabilityPanel-dropdown-item"
                          onClick={() => {
                            handleStatusChange(index, "secondHalf", status);
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
