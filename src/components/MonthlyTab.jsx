import { MONTHS, YEAR_OPTIONS } from "../utils/constants";

export default function MonthlyTab({ month, year, setMonth, setYear, totalHours, entries, onEdit, onDelete }) {
  return (
    <div className="tab-content active">
      <h2>Monthly Tracker</h2>
      <div className="grid-two">
        <div>
          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Year</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="result">
        <p>
          Total Hours for <span>{MONTHS[month]}</span>:{" "}
          <span className="value-highlight">{totalHours.toFixed(2)}</span>
        </p>
      </div>
      <div className="spaced-list">
        {entries.map((entry) => {
          const date = new Date(entry.date);
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayOfMonth = date.getDate();
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const formattedDate = `${dayOfMonth} ${monthName} (${dayOfWeek})`;

          return (
            <div className="entry-item" key={entry.id}>
              <span>
                {formattedDate}: {(entry.minutes / 60).toFixed(2)}h ({entry.instituteName})
              </span>
              <span>
                <button type="button" className="text-btn edit-btn" onClick={() => onEdit(entry)}>
                  Edit
                </button>
                <button type="button" className="text-btn delete-btn" onClick={() => onDelete(entry.id)}>
                  Delete
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
