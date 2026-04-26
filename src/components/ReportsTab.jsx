import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { MONTHS, YEAR_OPTIONS } from "../utils/constants";

function ProfessionalBreakdown({ title, rows, total, period, delay = 0, control }) {
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
      {control && <div className="mb-4">{control}</div>}

      <div className="space-y-3 mb-4">
        {rows.map((row, index) => (
          <div
            key={row.name}
            className="stagger-item flex flex-col gap-2 rounded-xl bg-slate-900/30 p-3 border border-slate-700/30 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: `${delay + 0.1 + (index + 1) * 0.08}s` }}
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
  fiscalYear,
  setFiscalYear,
  fiscalRows,
  fiscalTotal,
  fiscalTdsEstimate,
  fiscalYearLabel,
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

  const [showFiscalBreakdown, setShowFiscalBreakdown] = useState(false);

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="tab-content active space-y-6 animate-fade-in">
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

      <div className="grid grid-cols-1 gap-6">
        <ProfessionalBreakdown
          title="Monthly Performance"
          rows={monthlyRows}
          total={monthlyTotal}
          period={`${MONTHS[month]} ${year}`}
          delay={0.15}
          control={(
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">Choose month and year to update monthly results.</div>
              <div className="flex flex-wrap gap-2 items-center justify-center">
                <button type="button" className="btn-outline press-scale w-10 h-10 flex items-center justify-center" onClick={goToPrevMonth}>
                  <ChevronLeft size={18} />
                </button>
                <div className="text-sm text-slate-200 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-900/60 min-w-[130px] text-center">
                  {MONTHS[month]} {year}
                </div>
                <button type="button" className="btn-outline press-scale w-10 h-10 flex items-center justify-center" onClick={goToNextMonth}>
                  <ChevronRight size={18} />
                </button>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="text-sm bg-slate-800/50 border border-slate-700/50 px-3 py-2 rounded-lg w-full sm:w-auto"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        />
      </div>

      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.45s" }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-1">Fiscal Year Report</h4>
            <div className="text-slate-400">Showing salary data for the selected fiscal year.</div>
          </div>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(Number(e.target.value))}
            className="w-full max-w-xs text-center bg-slate-800/50 border-slate-700/50 text-sm py-2 px-3 rounded-lg"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {`FY ${y}-${String(y + 1).slice(-2)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
            <div className="text-sm text-slate-400">Fiscal Year</div>
            <div className="mt-2 text-slate-200 font-semibold">{fiscalYearLabel}</div>
          </div>
          <button
            type="button"
            onClick={() => setShowFiscalBreakdown((prev) => !prev)}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4 text-left hover:border-blue-400 transition"
          >
            <div className="text-sm text-slate-400">Total Fiscal Year Earnings</div>
            <div className="mt-2 text-2xl font-semibold text-green-300">₹{fiscalTotal.toFixed(2)}</div>
            <div className="mt-2 text-xs text-slate-400">
              {showFiscalBreakdown ? "Hide institute breakdown" : "Click here for institute breakdown"}
            </div>
          </button>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
            <div className="text-sm text-slate-400">Estimated TDS withheld</div>
            <div className="mt-2 text-2xl font-semibold text-emerald-300">₹{fiscalTdsEstimate.toFixed(2)}</div>
          </div>
        </div>

        {showFiscalBreakdown && (
          <div className="mt-4 space-y-3">
            {fiscalRows.map((row) => (
              <div key={row.name} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-slate-200 font-semibold">{row.name}</div>
                  <div className="text-xs text-slate-400">{row.hours.toFixed(2)}h</div>
                </div>
                <div className="text-slate-200 font-semibold">₹{row.salary.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
