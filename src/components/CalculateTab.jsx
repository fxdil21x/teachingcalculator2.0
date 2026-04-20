import { useState } from "react";
import { CalendarDays, Clock, Coffee, Building2, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

export default function CalculateTab({
  form,
  setForm,
  institutes,
  showNewInstitute,
  newInstitute,
  setNewInstitute,
  onSaveInstitute,
  onCalculate,
  result,
  onAddToRecord,
  onEditInstitute,
  onDeleteInstitute,
}) {
  const [showInstitutes, setShowInstitutes] = useState(false);

  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm((p) => ({ ...p, date: today }));
  };

  const setNow = (field) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setForm((p) => ({ ...p, [field]: time }));
  };

  return (
    <div className="tab-content active space-y-4">
      {/* Session Details Card */}
      <div className="form-card animate-slide-up">
        <div className="form-card-header">
          <div className="form-card-icon">
            <CalendarDays size={20} />
          </div>
          <h3 className="form-card-title">Session Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="mb-0">Date</label>
              <button type="button" className="quick-btn" onClick={setToday}>
                Today
              </button>
            </div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="mb-0"
            />
          </div>

          <div className="grid-two">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="mb-0 flex items-center gap-2">
                  <Clock size={14} />
                  From
                </label>
                <button type="button" className="quick-btn" onClick={() => setNow("fromTime")}>
                  Now
                </button>
              </div>
              <input
                type="time"
                value={form.fromTime}
                onChange={(e) => setForm((p) => ({ ...p, fromTime: e.target.value }))}
                className="mb-0"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="mb-0 flex items-center gap-2">
                  <Clock size={14} />
                  To
                </label>
                <button type="button" className="quick-btn" onClick={() => setNow("toTime")}>
                  Now
                </button>
              </div>
              <input
                type="time"
                value={form.toTime}
                onChange={(e) => setForm((p) => ({ ...p, toTime: e.target.value }))}
                className="mb-0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <Coffee size={14} />
              Break (minutes)
            </label>
            <input
              type="number"
              value={form.breakTime}
              onChange={(e) => setForm((p) => ({ ...p, breakTime: e.target.value }))}
              placeholder="0"
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Institute Card */}
      <div className="form-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="form-card-header">
          <div className="form-card-icon">
            <Building2 size={20} />
          </div>
          <h3 className="form-card-title">Institute</h3>
        </div>

        <select
          value={form.instituteId}
          onChange={(e) => setForm((p) => ({ ...p, instituteId: e.target.value }))}
          className="mb-0"
        >
          {institutes.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
          <option value="new">+ Add New Institute</option>
        </select>

        {showNewInstitute && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-scale-in">
            <h4 className="text-sm font-medium text-slate-300 mb-3">New Institute</h4>
            <input
              type="text"
              placeholder="Institute Name"
              value={newInstitute.name}
              onChange={(e) => setNewInstitute((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Rate per hour (₹)"
              value={newInstitute.rate}
              onChange={(e) => setNewInstitute((p) => ({ ...p, rate: e.target.value }))}
            />
            <label className="inline-label mb-3">
              <input
                type="checkbox"
                checked={newInstitute.tds}
                onChange={(e) => setNewInstitute((p) => ({ ...p, tds: e.target.checked }))}
              />
              TDS (10%) Applicable
            </label>
            <button type="button" className="btn-secondary press-scale" onClick={onSaveInstitute}>
              Save Institute
            </button>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button
        type="button"
        onClick={onCalculate}
        className="btn-primary w-full h-14 text-lg font-semibold press-scale animate-slide-up"
        style={{ animationDelay: "0.25s" }}
      >
        Calculate Hours & Salary
      </button>

      {/* Result Card */}
      {result.hours !== "0" && (
        <div className="result-card animate-scale-in">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="result-label">Hours Worked</div>
              <div className="result-value text-blue-400 animate-count-up">{result.hours}h</div>
            </div>
            <div className="text-center">
              <div className="result-label">Salary Earned</div>
              <div className="result-value text-emerald-400 animate-count-up">₹{result.salary}</div>
            </div>
          </div>
          <div className="text-center text-sm text-slate-400 mb-4">
            Date: {result.date}
          </div>
          <button type="button" className="btn-success w-full press-scale" onClick={onAddToRecord}>
            Add to Monthly Record
          </button>
        </div>
      )}

      {/* Collapsible Institutes Section */}
      <div className="animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <button
          type="button"
          onClick={() => setShowInstitutes(!showInstitutes)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <span className="text-sm font-medium">Manage Institutes ({institutes.length})</span>
          {showInstitutes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showInstitutes && (
          <div className="mt-3 space-y-2 animate-scale-in">
            {institutes.map((inst, index) => (
              <div
                key={inst.id}
                className="entry-card stagger-item"
                style={{ animationDelay: `${0.1 + index * 0.08}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{inst.name}</div>
                    <div className="text-sm text-slate-400">
                      ₹{inst.hourlyRate}/hr {inst.tds && <span className="text-amber-400">• TDS</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                      onClick={() => onEditInstitute(inst.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                      onClick={() => onDeleteInstitute(inst.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
