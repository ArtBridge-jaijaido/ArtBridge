"use client";
import { format, isSameDay, isSameMonth } from "date-fns";
import "./Calendar.css";
import { DAYS_IN_WEEK, WEEKDAYS } from "./constants";
import getCalendarGrid from "./getCalendarGrid";

export default function Calendar({ events, date }) {
  const days = getCalendarGrid(date);

  return (
    <div className="Calendar-table">
      <div className="Calendar-row">
        {WEEKDAYS.map((label) => (
          <div key={label} className="Calendar-header-cell">
            {label}
          </div>
        ))}
      </div>

      {Array.from({ length: Math.ceil(days.length / DAYS_IN_WEEK) }).map(
        (_, rowIndex) => (
          <div key={rowIndex} className="Calendar-row">
            {days
              .slice(
                rowIndex * DAYS_IN_WEEK,
                rowIndex * DAYS_IN_WEEK + DAYS_IN_WEEK
              )
              .map((day) => (
                <div key={day.toString()} className="Calendar-cell">
                  <div
                    className={`Calendar-date ${
                      isSameMonth(day, date)
                        ? "Calendar-text"
                        : "Calendar-text--other"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="Calendar-event-row">
                    {events
                      .filter((e) => isSameDay(day, new Date(e.date)))
                      .map((e, i) => (
                        <span key={i} />
                        // TODO: 案件圓點
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )
      )}
    </div>
  );
}
