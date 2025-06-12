import { isWithinInterval, parse } from "date-fns";
import "./CaseDots.css";

function CaseDots({ date, events }) {
  const year = date.getFullYear();

  const dots = events.filter((event) => {
    const [startStr, endStr] = event.dateRange.split("~");

    const startDate = parse(`${year}/${startStr}`, "yyyy/MM/dd", new Date());
    const endDate = parse(`${year}/${endStr}`, "yyyy/MM/dd", new Date());

    return isWithinInterval(date, { start: startDate, end: endDate });
  });

  return (
    <div className="CaseDots-row">
      {dots.map((event, i) => (
        <span
          key={i}
          className="CaseDots-dot"
          style={{ backgroundColor: event.color }}
        />
      ))}
    </div>
  );
}

export default CaseDots;
