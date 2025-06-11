import { format } from "date-fns";
import "./CaseListHeader.css";

function CaseListHeader({ date }) {
  const displayText = `${format(date, "yyyy / MM")}案件`;
  return <div className="CaseListHeader">{displayText}</div>;
}

export default CaseListHeader;
