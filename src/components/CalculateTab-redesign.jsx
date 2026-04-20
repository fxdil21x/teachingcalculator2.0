import { useState } from "react";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

export default function CalculateTab({
  form,
  setForm,
  institutes,
  batches,
  showNewInstitute,
  newInstitute,
  setNewInstitute,
  onSaveInstitute,
  onCalculate,
  result,
  onAddToRecord,
  onEditInstitute,
  onDeleteInstitute,
  onAddBatch,
  onAddSection,
}) {
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const selectedInstitute = institutes.find((i) => i.id === form.instituteId);
  const instituteBatches = selectedInstitute ? (batches[form.instituteId] || []) : [];
  const selectedBatch = instituteBatches.find((b) => b.id === form.batchId);
  const batchSections = selectedBatch?.sections || [];

  async function handleAddBatchClick() {
    if (!newBatchName.trim()) {
      Swal.fire("Error", "Batch name is required", "error");
      return;
    }
    try {
      await onAddBatch(form.instituteId, newBatchName);
      setNewBatchName("");
      setShowAddBatch(false);
      Swal.fire("Success", "Batch added!", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }

  async function handleAddSectionClick() {
    if (!newSectionName.trim()) {
      Swal.fire("Error", "Section name is required", "error");
      return;
    }
    try {
      await onAddSection(form.instituteId, form.batchId, newSectionName);
      setNewSectionName("");
      setShowAddSection(false);
      Swal.fire("Success", "Section added!", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }

  return (
    <div className="tab-content active">
      <h2>Calculate Hours</h2>
      <label>Select Date</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
      />
      <div className="grid-two">
        <div>
          <label>From</label>
          <input
            type="time"
            value={form.fromTime}
            onChange={(e) => setForm((p) => ({ ...p, fromTime: e.target.value }))}
          />
        </div>
        <div>
          <label>To</label>
          <input
            type="time"
            value={form.toTime}
            onChange={(e) => setForm((p) => ({ ...p, toTime: e.target.value }))}
          />
        </div>
      </div>
      <label>Break (mins)</label>
      <input
        type="number"
        value={form.breakTime}
        onChange={(e) => setForm((p) => ({ ...p, breakTime: e.target.value }))}
      />

      {/* INSTITUTE - BATCH - SECTION HIERARCHY */}
      <label>Institute</label>
      <select
        value={form.instituteId}
        onChange={(e) => setForm((p) => ({ ...p, instituteId: e.target.value, batchId: "", sectionId: "" }))}
      >
        {institutes.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.name}
          </option>
        ))}
        <option value="new">+ Add New Institute</option>
      </select>

      {showNewInstitute && (
        <div className="new-institute-form">
          <input
            type="text"
            placeholder="Institute Name"
            value={newInstitute.name}
            onChange={(e) => setNewInstitute((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Rate per hour"
            value={newInstitute.rate}
            onChange={(e) => setNewInstitute((p) => ({ ...p, rate: e.target.value }))}
          />
          <label className="inline-label">
            <input
              type="checkbox"
              checked={newInstitute.tds}
              onChange={(e) => setNewInstitute((p) => ({ ...p, tds: e.target.checked }))}
            />
            TDS (10%)
          </label>
          <button type="button" className="btn-muted" onClick={onSaveInstitute}>
            Save Institute
          </button>
        </div>
      )}

      {/* BATCH SELECTOR */}
      {form.instituteId && form.instituteId !== "new" && (
        <div>
          <label>
            Batch (Optional)
            {!showAddBatch && (
              <button
                type="button"
                className="text-btn"
                onClick={() => setShowAddBatch(true)}
                style={{ marginLeft: "10px", fontSize: "12px" }}
              >
                + Add New
              </button>
            )}
          </label>

          {showAddBatch && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Batch name"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                type="button"
                onClick={handleAddBatchClick}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowAddBatch(false); setNewBatchName(""); }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <select
            value={form.batchId || ""}
            onChange={(e) => setForm((p) => ({ ...p, batchId: e.target.value, sectionId: "" }))}
          >
            <option value="">-- No Batch --</option>
            {instituteBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SECTION SELECTOR */}
      {form.batchId && batchSections.length > 0 && (
        <div>
          <label>
            Section/Topic
            {!showAddSection && (
              <button
                type="button"
                className="text-btn"
                onClick={() => setShowAddSection(true)}
                style={{ marginLeft: "10px", fontSize: "12px" }}
              >
                + Add New
              </button>
            )}
          </label>

          {showAddSection && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Section name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                type="button"
                onClick={handleAddSectionClick}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowAddSection(false); setNewSectionName(""); }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <select
            value={form.sectionId || ""}
            onChange={(e) => setForm((p) => ({ ...p, sectionId: e.target.value }))}
          >
            <option value="">-- Select Section --</option>
            {batchSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="button" onClick={onCalculate}>
        Calculate
      </button>
      <div className="result">
        <p>
          Hours: <span className="value-highlight">{result.hours}</span> | Salary:{" "}
          <span className="value-highlight">₹{result.salary}</span>
        </p>
        <p>
          Date: <span>{result.date}</span>
        </p>
        <button type="button" className="btn-success" onClick={onAddToRecord}>
          Add to Monthly Record
        </button>
      </div>

      <h3 className="section-label">Institutes</h3>
      <div>
        {institutes.map((inst) => (
          <div className="entry-item" key={inst.id}>
            <span>
              {inst.name} | TDS: {inst.tds ? "Yes" : "No"}
            </span>
            <span>
              <button type="button" className="text-btn edit-btn" onClick={() => onEditInstitute(inst.id)}>
                Edit
              </button>
              <button type="button" className="text-btn delete-btn" onClick={() => onDeleteInstitute(inst.id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
