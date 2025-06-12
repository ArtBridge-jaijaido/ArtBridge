import "./CaseListItem.css";

function CaseListItem({ color, dateRange, title }) {
  return (
    <div className="CaseListItem">
      <div className="CaseListItem-color-field">
        <span className="CaseListItem-dot" style={{ backgroundColor: color }} />
        <span className="CaseListItem-date">{dateRange}</span>
      </div>
      <span className="CaseListItem-title">{title}</span>
    </div>
  );
}

export default CaseListItem;
