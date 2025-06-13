import "./ScheduleAvailabilityPanelLegend.css";
function LegendDot({ color, label }) {
  return (
    <div className="ScheduleAvailabilityPanelLegend">
      <span
        className="ScheduleAvailabilityPanelLegend-dot"
        style={{ backgroundColor: color }}
      />
      <span className="ScheduleAvailabilityPanelLegend-label">{label}</span>
    </div>
  );
}

export default LegendDot;
