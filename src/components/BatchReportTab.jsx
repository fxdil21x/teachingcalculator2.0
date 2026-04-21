import { useMemo, useState } from "react";
import { BookOpen, Layers, Building2, Clock, Pencil, Trash2, Check, X } from "lucide-react";

export default function BatchReportTab({
  entries,
  batches,
  institutes,
  onRenameBatch,
  onDeleteBatch,
}) {
  const [editingBatch, setEditingBatch] = useState(null); // { id, name }

  // Compute hours from entries: batchId -> { total, sections: { secId -> mins } }
  const hoursMap = useMemo(() => {
    const map = {};
    for (const entry of entries) {
      if (!entry.batchId) continue;
      if (!map[entry.batchId]) map[entry.batchId] = { total: 0, sections: {} };
      map[entry.batchId].total += entry.minutes || 0;
      const secKey = entry.sectionId || entry.sectionName || "__none__";
      map[entry.batchId].sections[secKey] = (map[entry.batchId].sections[secKey] || 0) + (entry.minutes || 0);
    }
    return map;
  }, [entries]);

  // Group batches by institute
  const grouped = useMemo(() => {
    const map = {};
    for (const batch of batches) {
      const instId = batch.instituteId;
      if (!map[instId]) {
        const inst = institutes.find((i) => i.id === instId);
        map[instId] = { name: inst?.name || batch.instituteName || "Unknown", batches: [] };
      }
      map[instId].batches.push(batch);
    }
    return map;
  }, [batches, institutes]);

  function fmtHours(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  async function commitBatchRename() {
    if (!editingBatch?.name?.trim()) return;
    await onRenameBatch(editingBatch.id, editingBatch.name.trim());
    setEditingBatch(null);
  }

  return (
    <div className="tab-content active space-y-4 animate-fade-in">
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="form-card-title">Batch Report</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hours tracked per batch &amp; section</p>
          </div>
        </div>

        {batches.length === 0 && (
          <div className="empty-state py-8">
            <Layers className="empty-state-icon" />
            <p className="empty-state-title">No batches yet</p>
            <p className="empty-state-description">
              Go to the Calculator tab, select an institute, and add a batch.
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([instId, inst]) => (
          <div key={instId} className="mb-6 last:mb-0">
            {/* Institute header */}
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={16} className="text-blue-400 shrink-0" />
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wide">
                {inst.name}
              </span>
            </div>

            <div className="space-y-3 pl-1">
              {inst.batches.map((batch) => {
                const batchHours = hoursMap[batch.id];
                const isEditingThisBatch = editingBatch?.id === batch.id;

                return (
                  <div
                    key={batch.id}
                    className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden"
                  >
                    {/* Batch header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/40 bg-slate-800/60">
                      <Layers size={15} className="text-amber-400 shrink-0" />

                      {isEditingThisBatch ? (
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="text"
                            value={editingBatch.name}
                            onChange={(e) => setEditingBatch((p) => ({ ...p, name: e.target.value }))}
                            className="mb-0 py-1 h-8 text-sm flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitBatchRename();
                              if (e.key === "Escape") setEditingBatch(null);
                            }}
                          />
                          <button
                            type="button"
                            className="icon-btn text-emerald-400 px-1"
                            onClick={commitBatchRename}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn text-slate-500 px-1"
                            onClick={() => setEditingBatch(null)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-200 flex-1 truncate">
                            {batch.name}
                          </span>
                          {batchHours && (
                            <span className="text-amber-300 text-sm font-bold flex items-center gap-1 shrink-0">
                              <Clock size={13} />
                              {fmtHours(batchHours.total)}
                            </span>
                          )}
                          <button
                            type="button"
                            className="icon-btn text-blue-400 hover:text-blue-300 px-1"
                            title="Rename batch"
                            onClick={() => setEditingBatch({ id: batch.id, name: batch.name })}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn text-red-400 hover:text-red-300 px-1"
                            title="Delete batch"
                            onClick={() => onDeleteBatch(batch.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Sections */}
                    {batch.sections && batch.sections.length > 0 ? (
                      <div className="divide-y divide-slate-700/30">
                        {batch.sections.map((sec) => {
                          const secMins =
                            batchHours?.sections?.[sec.id] ||
                            batchHours?.sections?.[sec.name] ||
                            0;

                          return (
                            <div
                              key={sec.id}
                              className="flex items-center justify-between px-5 py-2.5"
                            >
                              <span className="text-sm text-slate-300 flex-1 truncate">
                                {sec.name}
                              </span>
                              {secMins > 0 && (
                                <span className="text-sm text-emerald-400 font-medium shrink-0">
                                  {fmtHours(secMins)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-5 py-3 text-xs text-slate-600 italic">
                        No sections defined
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
