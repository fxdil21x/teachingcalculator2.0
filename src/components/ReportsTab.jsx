import { MONTHS, YEAR_OPTIONS } from "../utils/constants";

function Breakdown({ title, rows, total, allTime }) {
  return (
    <div className={`result ${allTime ? "all-time" : ""}`}>
      <h3>{title}</h3>
      {rows.map((row) => (
        <p key={row.name}>
          {row.name}: {row.hours.toFixed(2)}h - ₹{row.salary.toFixed(2)}
        </p>
      ))}
      <b>Total: ₹{total.toFixed(2)}</b>
    </div>
  );
}

function ProfessionalBreakdown({ title, rows, total, period }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
          {period}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {rows.map((row, index) => (
          <div key={row.name} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-b-0">
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
          <span className="text-xl font-bold text-green-400">₹{total.toFixed(2)}</span>
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
  return (
    <div className="tab-content active">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200">Salary Reports</h2>
        <button
          type="button"
          className="btn-outline flex items-center gap-2"
          onClick={onDownloadCsv}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Professional Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfessionalBreakdown
          title="Monthly Performance"
          rows={monthlyRows}
          total={monthlyTotal}
          period={`${MONTHS[month]} ${year}`}
        />
        <ProfessionalBreakdown
          title="All-Time Performance"
          rows={allTimeRows}
          total={allTimeTotal}
          period="Complete History"
        />
      </div>

      <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Report Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{monthlyRows.length}</div>
            <div className="text-xs text-slate-400">Active Institutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{monthlyRows.reduce((sum, r) => sum + r.hours, 0).toFixed(1)}h</div>
            <div className="text-xs text-slate-400">Monthly Hours</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">₹{monthlyTotal.toFixed(0)}</div>
            <div className="text-xs text-slate-400">Monthly Earnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">{allTimeRows.length}</div>
            <div className="text-xs text-slate-400">Total Institutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
