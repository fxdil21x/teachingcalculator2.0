import { MONTHS } from "../utils/constants";
import { calculateSalary } from "../utils/calculations";

export default function AdminDashboardTab({
  users,
  selectedUserId,
  onSelectUser,
  selectedUser,
  month,
  year,
  setMonth,
  setYear,
  monthlyRows,
  monthlyHours,
  monthlySalary,
  instituteCount,
}) {
  return (
    <div className="tab-content active">
      <h2>Admin Dashboard</h2>

      <div className="grid-two">
        <div className="entry-item">
          <strong>Total Users</strong>
          <p>{users.length}</p>
        </div>
        <div className="entry-item">
          <strong>Selected User Institutes</strong>
          <p>{instituteCount}</p>
        </div>
      </div>

      <label>Choose User</label>
      <select value={selectedUserId} onChange={(e) => onSelectUser(e.target.value)}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>

      {!selectedUser && <p className="section-label">Choose a user to view details.</p>}

      {selectedUser && (
        <>
          <h3 className="section-label">Personal Data</h3>
          <div className="entry-item">
            <div>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status || "unknown"}
              </p>
              <p>
                <strong>User ID:</strong> {selectedUser.id}
              </p>
            </div>
          </div>

          <h3 className="section-label">Monthly Breakdown</h3>
          <div className="grid-two">
            <div>
              <label>Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Year</label>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid-two">
            <div className="entry-item">
              <strong>Monthly Hours</strong>
              <p>{monthlyHours.toFixed(2)}</p>
            </div>
            <div className="entry-item">
              <strong>Monthly Salary</strong>
              <p>₹{monthlySalary.toFixed(2)}</p>
            </div>
          </div>

          <h3 className="section-label">By Institute</h3>
          <div>
            {monthlyRows.length === 0 && <p>No data found for selected month.</p>}
            {monthlyRows.map((row) => (
              <div className="entry-item" key={row.name}>
                <div>
                  <strong>{row.name}</strong>
                  <p>Hours: {row.hours.toFixed(2)}</p>
                </div>
                <div>₹{row.salary.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function buildAdminMonthlyRows(entries, month, year) {
  const monthName = MONTHS[month];
  const filtered = entries.filter((entry) => entry.month === monthName && Number(entry.year) === Number(year));
  const map = {};
  for (const entry of filtered) {
    if (!map[entry.instituteName]) map[entry.instituteName] = { name: entry.instituteName, hours: 0, salary: 0 };
    map[entry.instituteName].hours += entry.minutes / 60;
    map[entry.instituteName].salary += calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
  }
  return Object.values(map).sort((a, b) => b.salary - a.salary);
}
