import { addMonths } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ScheduleAvailabilityPanel from "../ScheduleAvailabilityPanel/ScheduleAvailabilityPanel";
import "./ArtworkCalendar.css";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";
import { CaseList } from "./CaseList";
import CaseListHeader from "./CaseListHeader";
import { convertOrdersToCaseFormat } from "./helper";

export const ArtworkCalendar = ({ orders = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(
    convertOrdersToCaseFormat(orders, currentDate)
  );

  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  useEffect(() => {
    if (calendarRef.current) {
      const height = calendarRef.current.offsetHeight;
      setCalendarHeight(height);
    }
  }, [currentDate]);

  const { user } = useSelector((state) => state.user);
  const isArtist = user.role === "artist";

  const buildUserAvailabilityField = () => {
    if (isArtist) {
      return (
        <div className="ArtworkCalendar-down">
          <ScheduleAvailabilityPanel
            userUid={user.uid}
            currentUserUid={user.uid}
          />
        </div>
      );
    }

    return null;
  };

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
      {buildUserAvailabilityField()}
    </div>
  );
};
