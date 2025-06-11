"use client";
import "./Calendar.css";
import { WEEKDAYS } from "./constants";

export default function Calendar({ events, date }) {
  return (
    <div className="Calendar-table">
      <div className="Calendar-row">
        {WEEKDAYS.map((label) => (
          <div key={label} className="Calendar-header-cell">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
