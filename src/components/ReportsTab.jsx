import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { MONTHS, YEAR_OPTIONS } from "../utils/constants";

function ProfessionalBreakdown({ title, rows, total, period, delay = 0 }) {
  return (
    <div
      className="bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-700/50 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
          {period}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {rows.map((row, index) => (
          <div
            key={row.name}
            className="stagger-item flex flex-col gap-2 rounded-xl bg-slate-900/30 p-3 border border-slate-700/30 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: `${delay + (index + 1) * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-slate-300 font-medium">{row.name}</span>
            </div>
            <div className="text-right">
              <div className="text-slate-200 font-semibold">{row.hours.toFixed(2)}h</div>
              <div className="text-green-400 text-sm">₹{row.salary.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Total Earnings</span>
          <span className="text-xl font-bold text-green-400 animate-count-up">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ReportsTab({
  month,
  year,
  setMonth,
  setYear,
  monthlyRows,
  monthlyTotal,
  allTimeRows,
  allTimeTotal,
  onDownloadCsv,
}) {
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
    <div className="tab-content active space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-200">Salary Reports</h2>
        <button
          type="button"
          className="btn-outline flex items-center justify-center gap-2 press-scale mt-0"
          onClick={onDownloadCsv}
        >
          <Download size={16} />
          Download Report
        </button>
      </div>

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

      {/* Year Dropdown */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfessionalBreakdown
          title="Monthly Performance"
          rows={monthlyRows}
          total={monthlyTotal}
          period={`${MONTHS[month]} ${year}`}
          delay={0.1}
        />
        <ProfessionalBreakdown
          title="All-Time Performance"
          rows={allTimeRows}
          total={allTimeTotal}
          period="Complete History"
          delay={0.2}
        />
      </div>

      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Report Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="card-stat">
            <div className="card-stat-value text-blue-400 animate-count-up">{monthlyRows.length}</div>
            <div className="card-stat-label">Active Institutes</div>
          </div>
          <div className="card-stat">
            <div className="card-stat-value text-green-400 animate-count-up">{monthlyRows.reduce((sum, r) => sum + r.hours, 0).toFixed(1)}h</div>
            <div className="card-stat-label">Monthly Hours</div>
          </div>
          <div className="card-stat">
            <div className="card-stat-value text-purple-400 animate-count-up">₹{monthlyTotal.toFixed(0)}</div>
            <div className="card-stat-label">Monthly Earnings</div>
          </div>
          <div className="card-stat">
            <div className="card-stat-value text-orange-400 animate-count-up">{allTimeRows.length}</div>
            <div className="card-stat-label">Total Institutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
