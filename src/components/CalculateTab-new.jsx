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
}) {
  const selectedBatch = batches?.find((b) => b.id === form.batchId);
  const batchSections = selectedBatch?.sections || [];

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
      <label>Institute</label>
      <select
        value={form.instituteId}
        onChange={(e) => setForm((p) => ({ ...p, instituteId: e.target.value }))}
      >
        {institutes.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.name}
          </option>
        ))}
        <option value="new">+ Add New Institute</option>
      </select>

      <label>Batch (Optional)</label>
      <select
        value={form.batchId || ""}
        onChange={(e) => setForm((p) => ({ ...p, batchId: e.target.value, sectionId: "" }))}
      >
        <option value="">-- No Batch --</option>
        {batches?.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.name}
          </option>
        ))}
      </select>

      {form.batchId && batchSections.length > 0 && (
        <>
          <label>Section/Topic (for selected batch)</label>
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
        </>
      )}

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
