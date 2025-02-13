import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./DatePicker.css";

const DatePicker = ({ value, onChange }) => {
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (dateInputRef.current) {
      flatpickr(dateInputRef.current, {
        dateFormat: "Y/m/d",
        allowInput: true,
        disableMobile: true,
        static: true,
        appendTo: dateInputRef.current.parentNode,
        onChange: (selectedDates, dateStr) => {
          onChange(dateStr);
        },
      });

      // 如果沒有輸入生日，顯示 placeholder
      if (!value) {
        dateInputRef.current.placeholder = "請輸入生日";
      }
    }
  }, [value, onChange]);

  return (
    <input
      type="text"
      ref={dateInputRef}
      className="custom-datepicker"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="請輸入生日"
    />
  );
};

export default DatePicker;
