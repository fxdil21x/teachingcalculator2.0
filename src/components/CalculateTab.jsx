import { useState } from "react";
import { CalendarDays, Clock, Coffee, Building2, ChevronDown, ChevronUp, Pencil, Trash2, Layers, Plus, X } from "lucide-react";
import { formatIndianCurrency } from "../utils/calculations";

export default function CalculateTab({
  form,
  setForm,
  institutes,
  batches,
  showNewInstitute,
  newInstitute,
  setNewInstitute,
  onSaveInstitute,
  onAddBatch,
  onAddSection,
  onDeleteBatch,
  onCalculate,
  result,
  onAddToRecord,
  onEditInstitute,
  onDeleteInstitute,
}) {
  const [showInstitutes, setShowInstitutes] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm((p) => ({ ...p, date: today }));
  };

  const setNow = (field) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setForm((p) => ({ ...p, [field]: time }));
  };

  // Batches for the currently selected institute
  const instituteBatches = batches.filter((b) => b.instituteId === form.instituteId);
  const selectedBatch = batches.find((b) => b.id === form.batchId);
  const batchSections = selectedBatch?.sections || [];

  function handleSaveBatch() {
    if (!newBatchName.trim()) return;
    onAddBatch(newBatchName.trim());
    setNewBatchName("");
    setShowAddBatch(false);
  }

  function handleSaveSection() {
    if (!newSectionName.trim()) return;
    onAddSection(form.batchId, newSectionName.trim());
    setNewSectionName("");
    setShowAddSection(false);
  }

  return (
    <div className="tab-content active space-y-4 animate-fade-in">
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

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1">
                <label className="mb-0 flex items-center gap-1 text-xs truncate">
                  <Clock size={13} />
                  From
                </label>
                <button type="button" className="quick-btn shrink-0" onClick={() => setNow("fromTime")}>
                  Now
                </button>
              </div>
              <input
                type="time"
                value={form.fromTime}
                onChange={(e) => setForm((p) => ({ ...p, fromTime: e.target.value }))}
                className="mb-0 text-sm px-2 sm:px-3 w-full min-w-0"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1">
                <label className="mb-0 flex items-center gap-1 text-xs truncate">
                  <Clock size={13} />
                  To
                </label>
                <button type="button" className="quick-btn shrink-0" onClick={() => setNow("toTime")}>
                  Now
                </button>
              </div>
              <input
                type="time"
                value={form.toTime}
                onChange={(e) => setForm((p) => ({ ...p, toTime: e.target.value }))}
                className="mb-0 text-sm px-2 sm:px-3 w-full min-w-0"
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
          onChange={(e) => setForm((p) => ({ ...p, instituteId: e.target.value, batchId: "", sectionId: "" }))}
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

      {/* Batch Card — only shown when a real institute is selected */}
      {form.instituteId && form.instituteId !== "new" && (
        <div className="form-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="form-card-header">
            <div
              className="form-card-icon"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
            >
              <Layers size={20} />
            </div>
            <div className="flex-1">
              <h3 className="form-card-title">Batch</h3>
            </div>
          </div>

          {/* No batches empty state */}
          {instituteBatches.length === 0 && !showAddBatch ? (
            <div className="py-3 text-center">
              <p className="text-sm text-slate-500 mb-3">No batches yet for this institute</p>
              <button
                type="button"
                className="btn-secondary w-auto px-4 py-2 mx-auto flex items-center gap-2 press-scale"
                onClick={() => setShowAddBatch(true)}
              >
                <Plus size={15} /> Add First Batch
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-3">
              {/* None chip */}
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                  !form.batchId
                    ? "bg-slate-700 border-slate-500 text-slate-200"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                }`}
                onClick={() => setForm((p) => ({ ...p, batchId: "", sectionId: "" }))}
              >
                None
              </button>

              {/* Batch chips */}
              {instituteBatches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    form.batchId === b.id
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}
                  onClick={() => setForm((p) => ({ ...p, batchId: b.id, sectionId: "" }))}
                >
                  {b.name}
                </button>
              ))}

              {/* Add batch chip */}
              {!showAddBatch && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-slate-500 text-slate-300 hover:border-slate-300 hover:text-slate-100 transition-all duration-150"
                  onClick={() => setShowAddBatch(true)}
                >
                  + Add
                </button>
              )}
            </div>
          )}

          {/* Add batch input */}
          {showAddBatch && (
            <div className="flex gap-2 mb-3 animate-scale-in">
              <input
                type="text"
                placeholder="e.g. Batch A, Morning Group"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="mb-0 flex-1"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveBatch()}
              />
              <button
                type="button"
                className="btn-secondary w-auto px-3"
                onClick={handleSaveBatch}
              >
                Save
              </button>
              <button
                type="button"
                className="icon-btn text-slate-400"
                onClick={() => { setShowAddBatch(false); setNewBatchName(""); }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Section / Topic — shown when a batch is selected */}
          {form.batchId && (
            <div className="border-t border-slate-700/40 pt-4 mt-1">
              <div className="flex items-center justify-between mb-3">
                <label className="mb-0 text-xs uppercase tracking-wide text-slate-400">
                  Section / Topic
                </label>
              </div>

              {/* No sections empty state */}
              {batchSections.length === 0 && !showAddSection ? (
                <div className="py-2 text-center">
                  <p className="text-xs text-slate-500 mb-2">No sections yet for this batch</p>
                  <button
                    type="button"
                    className="btn-secondary w-auto px-3 py-1.5 text-xs mx-auto flex items-center gap-1 press-scale"
                    onClick={() => setShowAddSection(true)}
                  >
                    <Plus size={13} /> Add Section
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* None chip */}
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                      !form.sectionId
                        ? "bg-slate-700 border-slate-500 text-slate-200"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                    }`}
                    onClick={() => setForm((p) => ({ ...p, sectionId: "" }))}
                  >
                    None
                  </button>

                  {/* Section chips */}
                  {batchSections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                        form.sectionId === sec.id
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                      }`}
                      onClick={() => setForm((p) => ({ ...p, sectionId: sec.id }))}
                    >
                      {sec.name}
                    </button>
                  ))}

                  {/* Add section chip */}
                  {!showAddSection && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-slate-500 text-slate-300 hover:border-slate-300 hover:text-slate-100 transition-all duration-150"
                      onClick={() => setShowAddSection(true)}
                    >
                      + Add
                    </button>
                  )}
                </div>
              )}

              {/* Add section input */}
              {showAddSection && (
                <div className="flex gap-2 mt-2 animate-scale-in">
                  <input
                    type="text"
                    placeholder="e.g. Chapter 1, Arrays, Week 3"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="mb-0 flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveSection()}
                  />
                  <button
                    type="button"
                    className="btn-secondary w-auto px-3"
                    onClick={handleSaveSection}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="icon-btn text-slate-400"
                    onClick={() => { setShowAddSection(false); setNewSectionName(""); }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Delete batch */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/30">
                <span className="text-xs text-slate-600">
                  {selectedBatch?.sections?.length || 0} section
                  {(selectedBatch?.sections?.length || 0) !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-300 bg-transparent px-0 flex items-center gap-1"
                  onClick={() => onDeleteBatch(form.batchId)}
                >
                  <Trash2 size={12} /> Delete batch
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
              <div className="result-value text-emerald-400 animate-count-up">₹{formatIndianCurrency(result.salary)}</div>
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
                      ₹{formatIndianCurrency(inst.hourlyRate)}/hr {inst.tds && <span className="text-amber-400">• TDS</span>}
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
