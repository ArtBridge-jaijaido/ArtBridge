import { addMonths } from "date-fns";
import { useState } from "react";
import "./ArtworkCalendar.css";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";

export const ArtworkCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="ArtworkCalendar-container">
      <div className="ArtworkCalendar-calendar-field">
        <CalendarHeader
          currentDate={currentDate}
          onPrev={() => setCurrentDate((prev) => addMonths(prev, -1))}
          onNext={() => setCurrentDate((prev) => addMonths(prev, 1))}
        />
        <Calendar events={[]} date={currentDate} />
      </div>
    </div>
  );
};
