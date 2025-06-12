import "./CaseList.css";
import CaseListItem from "./CaseListItem";

export const CaseList = ({ events }) => {
  return (
    <div className="CaseList-wrapper">
      <div className="CaseList">
        {events.map((event, index) => (
          <CaseListItem
            key={index}
            color={event.color}
            dateRange={event.dateRange}
            title={event.title}
          />
        ))}
      </div>
    </div>
  );
};
