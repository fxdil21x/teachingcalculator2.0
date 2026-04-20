import { useState } from "react";
import Swal from "sweetalert2";
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

export default function BatchTab({
  batches,
  onAddBatch,
  onDeleteBatch,
  onAddSection,
  onDeleteSection,
}) {
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [newBatchName, setNewBatchName] = useState("");
  const [newSectionNames, setNewSectionNames] = useState({});

  async function handleAddBatch() {
    if (!newBatchName.trim()) {
      Swal.fire("Error", "Batch name is required", "error");
      return;
    }
    try {
      await onAddBatch(newBatchName);
      setNewBatchName("");
      Swal.fire("Success", "Batch created successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }

  async function handleDeleteBatch(batchId) {
    const confirm = await Swal.fire({
      title: "Delete Batch?",
      text: "This will delete the batch and all associated section information. Entries will remain.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await onDeleteBatch(batchId);
        Swal.fire("Deleted", "Batch deleted successfully", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  }

  async function handleAddSection(batchId) {
    const sectionName = newSectionNames[batchId];
    if (!sectionName?.trim()) {
      Swal.fire("Error", "Section name is required", "error");
      return;
    }
    try {
      await onAddSection(batchId, sectionName);
      setNewSectionNames((prev) => ({ ...prev, [batchId]: "" }));
      Swal.fire("Success", "Section added successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }

  async function handleDeleteSection(batchId, sectionId) {
    const confirm = await Swal.fire({
      title: "Delete Section?",
      text: "Hours logged to this section will no longer be tracked.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await onDeleteSection(batchId, sectionId);
        Swal.fire("Deleted", "Section deleted successfully", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  }

  return (
    <div className="tab-content active">
      <h2>Batch Management</h2>

      {/* Add New Batch Section */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0 }}>Create New Batch</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Batch name (e.g., Batch A, Session 2026)"
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
            onClick={handleAddBatch}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            + Add Batch
          </button>
        </div>
      </div>

      {/* Batches List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {batches.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
            No batches created yet
          </p>
        ) : (
          batches.map((batch) => (
            <div key={batch.id} className="card">
              {/* Batch Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
                onClick={() =>
                  setExpandedBatchId(
                    expandedBatchId === batch.id ? null : batch.id
                  )
                }
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                    {batch.name}
                  </h3>
                  {batch.totalHours !== undefined && (
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                      <strong>{batch.totalHours.toFixed(1)}</strong> total hours
                      • <strong>{batch.sections?.length || 0}</strong> sections
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBatch(batch.id);
                    }}
                    style={{
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  {expandedBatchId === batch.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedBatchId === batch.id && (
                <div style={{ marginTop: "10px" }}>
                  {/* Sections List */}
                  {batch.sections && batch.sections.length > 0 && (
                    <div style={{ marginBottom: "15px" }}>
                      <h4 style={{ marginBottom: "10px", fontSize: "14px" }}>
                        Sections:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {batch.sections.map((section) => (
                          <div
                            key={section.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px",
                              backgroundColor: "#f9f9f9",
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                            }}
                          >
                            <div>
                              <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>
                                {section.name}
                              </p>
                              <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                                {section.totalHours?.toFixed(1) || "0"} hours
                                {section.entryCount > 0 && ` • ${section.entryCount} entries`}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteSection(batch.id, section.id)
                              }
                              style={{
                                background: "#ff6666",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Section */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="New section name"
                      value={newSectionNames[batch.id] || ""}
                      onChange={(e) =>
                        setNewSectionNames((prev) => ({
                          ...prev,
                          [batch.id]: e.target.value,
                        }))
                      }
                      style={{
                        flex: 1,
                        padding: "6px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      onClick={() => handleAddSection(batch.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {/* Batch Summary */}
                  {batch.totalHours !== undefined && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "10px",
                        backgroundColor: "#e8f4f8",
                        borderRadius: "4px",
                        borderLeft: "4px solid #0066cc",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        <strong>Batch Total:</strong> {batch.totalHours.toFixed(1)} hours
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
