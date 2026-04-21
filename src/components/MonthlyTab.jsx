import { ChevronLeft, ChevronRight, Clock, Pencil, Trash2, Calendar } from "lucide-react";
import { MONTHS, YEAR_OPTIONS } from "../utils/constants";
import EmptyState from "./ui/EmptyState";

export default function MonthlyTab({ month, year, setMonth, setYear, totalHours, entries, onEdit, onDelete }) {
  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="tab-content active space-y-4 animate-fade-in">
      {/* Month Selector */}
      <div className="month-selector animate-fade-in">
        <button type="button" className="month-selector-btn press-scale" onClick={goToPrevMonth}>
          <ChevronLeft size={20} />
        </button>
        <div className="month-selector-text">
          {MONTHS[month]} {year}
        </div>
        <button type="button" className="month-selector-btn press-scale" onClick={goToNextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Year Dropdown (for quick navigation) */}
      <div className="flex justify-center animate-fade-in">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-auto text-center bg-slate-800/50 border-slate-700/50 text-sm py-1 px-3 rounded-lg"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Card */}
      <div className="card card-elevated animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">Total Hours</div>
            <div className="text-3xl font-bold text-blue-400 animate-count-up">
              {totalHours.toFixed(2)}h
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Clock size={28} className="text-blue-400" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} recorded
          </div>
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={`No entries for ${MONTHS[month]}`}
          description="Start adding your teaching hours to see them here."
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const date = new Date(entry.date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayOfMonth = date.getDate();

            return (
              <div
                key={entry.id}
                className="entry-card stagger-item"
                style={{ animationDelay: `${0.1 + index * 0.08}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-slate-200">{dayOfMonth}</span>
                      <span className="text-xs text-slate-500 uppercase">{dayOfWeek}</span>
                    </div>
                    <div>
                      <div className="entry-card-hours">{(entry.minutes / 60).toFixed(2)}h</div>
                      <div className="entry-card-details">{entry.instituteName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                      onClick={() => onEdit(entry)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
