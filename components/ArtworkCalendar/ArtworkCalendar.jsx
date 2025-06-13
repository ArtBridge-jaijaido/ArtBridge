import { addMonths } from "date-fns";
import { useEffect, useRef, useState } from "react";
import ScheduleAvailabilityPanel from "../ScheduleAvailabilityPanel/ScheduleAvailabilityPanel";
import "./ArtworkCalendar.css";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";
import { CaseList } from "./CaseList";
import CaseListHeader from "./CaseListHeader";
import { convertOrdersToCaseFormat } from "./helper";

export const ArtworkCalendar = ({ consumerOrders = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(
    convertOrdersToCaseFormat(consumerOrders, currentDate)
  );

  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  useEffect(() => {
    if (calendarRef.current) {
      const height = calendarRef.current.offsetHeight;
      setCalendarHeight(height);
    }
  }, [currentDate]);

  const mockAvailability = [
    {
      month: 6,
      isCurrent: true,
      firstHalf: { status: "unknown" },
      secondHalf: { status: "full" },
    },
    {
      month: 7,
      isCurrent: false,
      firstHalf: { status: "full" },
      secondHalf: { status: "available" },
    },
    {
      month: 8,
      isCurrent: false,
      firstHalf: { status: "available" },
      secondHalf: { status: "available" },
    },
    {
      month: 9,
      isCurrent: false,
      firstHalf: { status: "available" },
      secondHalf: { status: "available" },
    },
    {
      month: 10,
      isCurrent: false,
      firstHalf: { status: "unknown" },
      secondHalf: { status: "unknown" },
    },
    {
      month: 11,
      isCurrent: false,
      firstHalf: { status: "full" },
      secondHalf: { status: "full" },
    },
  ];

  return (
    <div className="ArtworkCalendar-container">
      <div className="ArtworkCalendar-top">
        <div className="ArtworkCalendar-calendar-field" ref={calendarRef}>
          <CalendarHeader
            currentDate={currentDate}
            onPrev={() => setCurrentDate((prev) => addMonths(prev, -1))}
            onNext={() => setCurrentDate((prev) => addMonths(prev, 1))}
          />
          <Calendar events={events} date={currentDate} />
        </div>
        <div
          className="ArtworkCalendar-cases-field"
          style={{ height: calendarHeight }}
        >
          <CaseListHeader date={currentDate} />
          <CaseList events={events} />
        </div>
      </div>
      <div className="ArtworkCalendar-down">
        <ScheduleAvailabilityPanel availability={mockAvailability} />
      </div>
    </div>
  );
};
