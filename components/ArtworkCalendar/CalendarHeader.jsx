import { format } from "date-fns";
import "./CalendarHeader.css";

const CalendarHeader = ({ currentDate, onPrev, onNext }) => {
  return (
    <div className="CalendarHeader">
      <button onClick={onPrev}>{"<"}</button>
      <span>{format(currentDate, "yyyy / MM")}</span>
      <button onClick={onNext}>{">"}</button>
    </div>
  );
};

export default CalendarHeader;
