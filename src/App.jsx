import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Menu, X, User, Lock, Key, HelpCircle, LogOut, Shield } from "lucide-react";
import Swal from "sweetalert2";
import AdminTab from "./components/AdminTab";
import AdminDashboardTab, { buildAdminMonthlyRows } from "./components/AdminDashboardTab";
import AuthSection from "./components/AuthSection";
import CalculateTab from "./components/CalculateTab";
import ChangePassword from "./components/ChangePassword";
import InsightsTab from "./components/InsightsTab";
import MonthlyTab from "./components/MonthlyTab";
import ReportsTab from "./components/ReportsTab";
import Tabs from "./components/Tabs";
import { useAuthState } from "./hooks/useAuthState";
import { usePwaInstall } from "./hooks/usePwaInstall";
import { login, logout, signup, forgotPassword } from "./services/authService";
import {
  addEntry,
  addInstitute,
  approveUser,
  deleteUser,
  listEntries,
  listEntriesByUser,
  listInstitutes,
  listInstitutesByUser,
  listUsers,
  rejectUser,
  removeEntry,
  removeInstitute,
  updateEntry,
  updateInstitute,
  updateUserProfile,
} from "./services/dataService";
import { ADMIN_EMAIL } from "./services/firebase";
import { buildEntryPayload, calculateMinutes, calculateSalary, getYearForEntry } from "./utils/calculations";
import { MONTHS } from "./utils/constants";

function aggregateRows(entries, sortDesc = false) {
  const map = {};
  for (const entry of entries) {
    const hours = entry.minutes / 60;
    const salary = calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
    if (!map[entry.instituteName]) map[entry.instituteName] = { name: entry.instituteName, hours: 0, salary: 0 };
    map[entry.instituteName].hours += hours;
    map[entry.instituteName].salary += salary;
  }
  const rows = Object.values(map);
  if (sortDesc) rows.sort((a, b) => b.salary - a.salary);
  return rows;
}

const ALL_TABS = ["today", "monthly", "salary", "insights", "adminDashboard", "admin"];
const ADMIN_ONLY_TABS = ["adminDashboard", "admin"];

export default function App() {
  const { user, isAdmin, isApproved, loading } = useAuthState();
  const { install } = usePwaInstall();

  const now = new Date();
  const [activeTab, setActiveTab] = useState("today");
  const [institutes, setInstitutes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSelectedUserId, setAdminSelectedUserId] = useState("");
  const [adminEntries, setAdminEntries] = useState([]);
  const [adminInstitutes, setAdminInstitutes] = useState([]);
  const [adminMonth, setAdminMonth] = useState(now.getMonth());
  const [adminYear, setAdminYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [menuOpen, setMenuOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [year, setYear] = useState(now.getFullYear());
  const [salaryMonth, setSalaryMonth] = useState(now.getMonth());
  const [salaryYear, setSalaryYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ date: "", fromTime: "", toTime: "", breakTime: "0", instituteId: "" });
  const [newInstitute, setNewInstitute] = useState({ name: "", rate: "", tds: false });
  const [result, setResult] = useState({ hours: "0", salary: "0", date: "" });
  const [todayPayload, setTodayPayload] = useState(null);
  const [signupEmail, setSignupEmail] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Workers not supported");
      return;
    }
    navigator.serviceWorker.register("/service-worker.js").then((registration) => {
      console.log("Service Worker registered successfully:", registration);
    }).catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
  }, []);

  async function reloadData() {
    const [inst, ent] = await Promise.all([listInstitutes(), listEntries()]);
    setInstitutes(inst);
    setEntries(ent);
    setForm((prev) => ({
      ...prev,
      instituteId: inst.length > 0 ? prev.instituteId || inst[0].id : "new",
    }));
  }

  async function reloadUsers() {
    if (!isAdmin) return;
    const users = await listUsers();
    setAdminUsers(users.filter((u) => u.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()));
  }

  async function loadAdminUserData(uid) {
    if (!uid) {
      setAdminEntries([]);
      setAdminInstitutes([]);
      return;
    }
    const [entriesByUser, institutesByUser] = await Promise.all([listEntriesByUser(uid), listInstitutesByUser(uid)]);
    setAdminEntries(entriesByUser);
    setAdminInstitutes(institutesByUser);
  }

  useEffect(() => {
    if (!user || !isApproved) {
      setInstitutes([]);
      setEntries([]);
      return;
    }
    reloadData().catch((e) => window.alert(e.message));
  }, [user, isApproved]);

  useEffect(() => {
    if (isAdmin && activeTab === "admin") {
      reloadUsers().catch((e) => window.alert(e.message));
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    if (!isAdmin || activeTab !== "adminDashboard") return;
    reloadUsers().catch((e) => window.alert(e.message));
  }, [isAdmin, activeTab]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminUserData(adminSelectedUserId).catch((e) => window.alert(e.message));
  }, [isAdmin, adminSelectedUserId]);

  useEffect(() => {
    const syncTabFromHash = () => {
      const hashTab = window.location.hash.replace("#", "");
      const allowedTabs = ALL_TABS;
      if (!allowedTabs.includes(hashTab)) return;
      if ((hashTab === "admin" || hashTab === "adminDashboard") && !isAdmin) return;
      setActiveTab(hashTab);
    };
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, [isAdmin]);

  function handleTabChange(nextTab) {
    setActiveTab(nextTab);
    window.location.hash = nextTab;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleMenuLogout() {
    closeMenu();
    await logout();
  }

  async function handleMenuChangePassword() {
    closeMenu();
    setChangePasswordModal(true);
  }

  function handleMenuSupport() {
    closeMenu();
    window.alert("For support, please contact support@teachinghours.com or visit the support section.");
  }

  function handleAdminRedirect() {
    closeMenu();
    setAdminMode(true);
    setActiveTab("adminDashboard");
  }

  function handleExitAdminMode() {
    setAdminMode(false);
    setActiveTab("today");
    window.location.hash = "today";
  }

  const filteredMonthly = useMemo(() => {
    const monthName = MONTHS[month];
    return entries
      .filter((e) => e.month === monthName && getYearForEntry(e) === year)
      .sort((a, b) => a.day - b.day);
  }, [entries, month, year]);

  const monthlyHours = useMemo(
    () => filteredMonthly.reduce((sum, e) => sum + e.minutes, 0) / 60,
    [filteredMonthly],
  );

  const monthlySalaryEntries = useMemo(() => {
    const monthName = MONTHS[salaryMonth];
    return entries.filter((e) => e.month === monthName && getYearForEntry(e) === salaryYear);
  }, [entries, salaryMonth, salaryYear]);

  const monthlyRows = useMemo(() => aggregateRows(monthlySalaryEntries), [monthlySalaryEntries]);
  const allTimeRows = useMemo(() => aggregateRows(entries, true), [entries]);

  const monthlyTotal = monthlyRows.reduce((sum, r) => sum + r.salary, 0);
  const allTimeTotal = allTimeRows.reduce((sum, r) => sum + r.salary, 0);
  const selectedAdminUser = adminUsers.find((u) => u.id === adminSelectedUserId) || null;
  const adminMonthlyRows = useMemo(
    () => buildAdminMonthlyRows(adminEntries, adminMonth, adminYear),
    [adminEntries, adminMonth, adminYear],
  );
  const adminMonthlyHours = adminMonthlyRows.reduce((sum, row) => sum + row.hours, 0);
  const adminMonthlySalary = adminMonthlyRows.reduce((sum, row) => sum + row.salary, 0);

  const showNewInstitute = form.instituteId === "new";

  async function handleSaveInstitute() {
    const rate = Number.parseFloat(newInstitute.rate);
    if (!newInstitute.name.trim() || !rate) {
      window.alert("Fill institute name & hourly rate");
      return;
    }
    const newInstituteItem = await addInstitute({ name: newInstitute.name.trim(), hourlyRate: rate, tds: newInstitute.tds });
    setInstitutes((prev) => [...prev, newInstituteItem]);
    setNewInstitute({ name: "", rate: "", tds: false });
    setForm((prev) => ({
      ...prev,
      instituteId: prev.instituteId === "new" ? newInstituteItem.id : prev.instituteId,
    }));
  }

  async function handleEditInstitute(id) {
    const current = institutes.find((i) => i.id === id);
    if (!current) return;

    const { value: formValues } = await Swal.fire({
      title: "Edit Institute",
      html: `
        <input id="swal-name" type="text" class="swal2-input" placeholder="Institute name" value="${current.name}" />
        <input id="swal-rate" type="number" step="0.01" min="0" class="swal2-input" placeholder="Hourly rate (₹)" value="${current.hourlyRate}" />
        <label style="display: block; margin-top: 10px;">
          <input id="swal-tds" type="checkbox" ${current.tds ? 'checked' : ''} style="margin-right: 8px;" />
          TDS Applicable
        </label>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save changes",
      preConfirm: () => {
        const name = document.getElementById("swal-name")?.value?.trim();
        const rate = Number.parseFloat(document.getElementById("swal-rate")?.value || "");
        const tds = document.getElementById("swal-tds")?.checked || false;

        if (!name) {
          Swal.showValidationMessage("Please enter institute name.");
          return null;
        }
        if (!Number.isFinite(rate) || rate <= 0) {
          Swal.showValidationMessage("Please enter a valid hourly rate.");
          return null;
        }

        return { name, hourlyRate: rate, tds };
      },
    });

    if (!formValues) return;

    await updateInstitute(id, formValues);
    setInstitutes((prev) => prev.map((item) => (item.id === id ? { ...item, ...formValues } : item)));
    Swal.fire({ title: "Updated", text: "Institute updated successfully.", icon: "success", timer: 1000, showConfirmButton: false });
  }

  async function handleDeleteInstitute(id) {
    const result = await Swal.fire({
      title: "Delete institute?",
      text: "This will permanently delete the institute and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    await removeInstitute(id);
    setInstitutes((prev) => prev.filter((item) => item.id !== id));
    setForm((prev) => {
      if (prev.instituteId !== id) return prev;
      const nextInstituteId = institutes.find((item) => item.id !== id)?.id;
      return { ...prev, instituteId: nextInstituteId || "new" };
    });
    Swal.fire({ title: "Deleted", text: "Institute deleted successfully.", icon: "success", timer: 1000, showConfirmButton: false });
  }

  function handleCalculate() {
    if (!form.date || !form.fromTime || !form.toTime || !form.instituteId || form.instituteId === "new") {
      window.alert("Fill all fields");
      return;
    }
    const minutes = calculateMinutes(form.fromTime, form.toTime, form.breakTime);
    if (minutes < 0) {
      window.alert("Invalid time range!");
      return;
    }
    const institute = institutes.find((i) => i.id === form.instituteId);
    if (!institute) return;
    const salary = calculateSalary(minutes, institute.hourlyRate, institute.tds);
    const payload = buildEntryPayload(form.date, minutes, institute);
    setTodayPayload(payload);
    setResult({ hours: (minutes / 60).toFixed(2), salary: salary.toFixed(2), date: form.date });
  }

  async function handleAddRecord() {
    if (!todayPayload) {
      window.alert("Calculate first");
      return;
    }
    const isDuplicate = entries.some(
      (entry) =>
        entry.date === todayPayload.date &&
        entry.minutes === todayPayload.minutes &&
        entry.instituteName === todayPayload.instituteName &&
        entry.hourlyRate === todayPayload.hourlyRate &&
        entry.tds === todayPayload.tds,
    );
    if (isDuplicate) {
      await Swal.fire({
        title: "Already Saved",
        text: "This entry is already saved in your monthly record.",
        icon: "info",
      });
      return;
    }
    const addedEntry = await addEntry(todayPayload);
    setEntries((prev) => [...prev, addedEntry]);
    Swal.fire({
      title: "Saved!",
      text: "Your daily entry has been recorded successfully.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  }

  async function handleDeleteEntry(id) {
    const result = await Swal.fire({
      title: "Delete entry?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    await removeEntry(id);
    setEntries((prev) => prev.filter((item) => item.id !== id));
    Swal.fire({ title: "Deleted", text: "Entry deleted successfully.", icon: "success", timer: 1000, showConfirmButton: false });
  }

  async function handleEditEntry(entry) {
    const { value: formValues } = await Swal.fire({
      title: "Edit Entry",
      html: `
        <input id="swal-date" type="date" class="swal2-input" value="${entry.date || ""}" />
        <input id="swal-hours" type="number" step="0.01" min="0" class="swal2-input" placeholder="Hours" value="${(
          entry.minutes / 60
        ).toFixed(2)}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save changes",
      preConfirm: () => {
        const date = document.getElementById("swal-date")?.value;
        const hours = Number.parseFloat(document.getElementById("swal-hours")?.value || "");
        if (!date || !Number.isFinite(hours) || hours < 0) {
          Swal.showValidationMessage("Please enter a valid date and hours.");
          return null;
        }
        return { date, hours };
      },
    });

    if (!formValues) return;

    const d = new Date(formValues.date);
    const updatedEntry = {
      ...entry,
      date: formValues.date,
      minutes: Math.round(formValues.hours * 60),
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
      year: d.getFullYear(),
    };
    const { id, ...payload } = updatedEntry;
    await updateEntry(entry.id, payload);
    setEntries((prev) => prev.map((item) => (item.id === entry.id ? updatedEntry : item)));
    Swal.fire({
      title: "Updated",
      text: "Entry updated successfully.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  }

  async function downloadCsv() {
    const result = await Swal.fire({
      title: 'Download Report',
      text: 'Choose the type of report to download',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Monthly Report',
      denyButtonText: 'All-Time Report',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      denyButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const csvEntries = entries.filter((e) => e.month === MONTHS[salaryMonth]);
      await downloadDetailedReport(csvEntries, `monthly-${MONTHS[salaryMonth].toLowerCase()}`);
    } else if (result.isDenied) {
      await downloadDetailedReport(entries, 'all-time');
    }
    // If dismissed or cancelled, do nothing
  }

  async function downloadDetailedReport(reportEntries, filename) {
    // Sort entries chronologically
    const sortedEntries = [...reportEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate date range
    const dateRange = sortedEntries.length > 0
      ? `${sortedEntries[0].date} to ${sortedEntries[sortedEntries.length - 1].date}`
      : 'No data available';

    // Calculate overall statistics
    const totalMinutes = sortedEntries.reduce((sum, entry) => sum + entry.minutes, 0);
    const totalHours = totalMinutes / 60;
    const totalSalary = sortedEntries.reduce((sum, entry) => sum + calculateSalary(entry.minutes, entry.hourlyRate, entry.tds), 0);
    const avgHourlyRate = sortedEntries.length > 0 ? sortedEntries.reduce((sum, entry) => sum + entry.hourlyRate, 0) / sortedEntries.length : 0;
    const avgDailyHours = sortedEntries.length > 0 ? totalHours / new Set(sortedEntries.map(e => e.date)).size : 0;

    // Group by institute
    const instituteStats = {};
    sortedEntries.forEach(entry => {
      if (!instituteStats[entry.instituteName]) {
        instituteStats[entry.instituteName] = {
          entries: [],
          totalMinutes: 0,
          totalHours: 0,
          totalSalary: 0,
          hourlyRates: [],
          tdsApplied: false
        };
      }
      instituteStats[entry.instituteName].entries.push(entry);
      instituteStats[entry.instituteName].totalMinutes += entry.minutes;
      instituteStats[entry.instituteName].totalHours += entry.minutes / 60;
      instituteStats[entry.instituteName].totalSalary += calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
      instituteStats[entry.instituteName].hourlyRates.push(entry.hourlyRate);
      if (entry.tds) instituteStats[entry.instituteName].tdsApplied = true;
    });

    // Group by month (for all-time reports)
    const monthlyStats = {};
    sortedEntries.forEach(entry => {
      const monthKey = `${entry.month} ${entry.year}`;
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          entries: [],
          totalMinutes: 0,
          totalHours: 0,
          totalSalary: 0,
          daysWorked: new Set()
        };
      }
      monthlyStats[monthKey].entries.push(entry);
      monthlyStats[monthKey].totalMinutes += entry.minutes;
      monthlyStats[monthKey].totalHours += entry.minutes / 60;
      monthlyStats[monthKey].totalSalary += calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
      monthlyStats[monthKey].daysWorked.add(entry.date);
    });

    let csv = '';

    // ===== REPORT HEADER =====
    csv += 'TEACHING HOURS CALCULATOR - PROFESSIONAL REPORT\n';
    csv += `Report Type: ${filename.includes('monthly') ? 'Monthly Report' : 'All-Time Report'}\n`;
    csv += `Generated On: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}\n`;
    csv += `Date Range: ${dateRange}\n`;
    csv += `Total Entries: ${sortedEntries.length}\n\n`;

    // ===== EXECUTIVE SUMMARY =====
    csv += 'EXECUTIVE SUMMARY\n';
    csv += 'Metric,Value,Unit\n';
    csv += `Total Teaching Hours,${totalHours.toFixed(2)},Hours\n`;
    csv += `Total Salary Earned,${totalSalary.toFixed(2)},INR\n`;
    csv += `Average Hourly Rate,${avgHourlyRate.toFixed(2)},INR/Hour\n`;
    csv += `Average Daily Hours,${avgDailyHours.toFixed(2)},Hours/Day\n`;
    csv += `Total Working Days,${new Set(sortedEntries.map(e => e.date)).size},Days\n`;
    csv += `Institutes Worked At,${Object.keys(instituteStats).length},Institutes\n`;
    csv += `Months Covered,${Object.keys(monthlyStats).length},Months\n\n`;

    // ===== INSTITUTE-WISE PERFORMANCE =====
    csv += 'INSTITUTE-WISE PERFORMANCE ANALYSIS\n';
    csv += 'Institute Name,Total Hours,Total Salary (INR),Avg Hourly Rate (INR),TDS Applied\n';

    Object.entries(instituteStats)
      .sort(([,a], [,b]) => b.totalSalary - a.totalSalary) // Sort by total salary descending
      .forEach(([institute, stats]) => {
        const avgRate = stats.hourlyRates.reduce((a, b) => a + b, 0) / stats.hourlyRates.length;
        csv += `${institute},${stats.totalHours.toFixed(2)},${stats.totalSalary.toFixed(2)},${avgRate.toFixed(2)},${stats.tdsApplied ? 'Yes' : 'No'}\n`;
      });

    csv += '\n';

    // ===== MONTHLY BREAKDOWN ===== (only for all-time reports)
    if (filename.includes('all-time')) {
      csv += 'MONTHLY BREAKDOWN\n';
      csv += 'Month,Total Hours,Total Salary (INR),Working Days,Avg Daily Hours\n';

      Object.entries(monthlyStats)
        .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort chronologically
        .forEach(([month, stats]) => {
          const avgDaily = stats.totalHours / stats.daysWorked.size;
          csv += `${month},${stats.totalHours.toFixed(2)},${stats.totalSalary.toFixed(2)},${stats.daysWorked.size},${avgDaily.toFixed(2)}\n`;
        });

      csv += '\n';
    }

    // ===== DETAILED ENTRIES =====
    csv += 'DETAILED TEACHING SESSIONS (Chronological Order)\n';
    csv += 'Date,Day,Month,Year,Day of Week,Institute,Start Time,End Time,Hours Worked,Hourly Rate (INR),TDS Applied,Salary Earned (INR),Minutes Worked,Session Notes\n';

    sortedEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hours = entry.minutes / 60;
      const salary = calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);

      // Estimate start/end times (assuming 9 AM start for calculation)
      const estimatedStart = '09:00 AM';
      const estimatedEnd = new Date(date.getTime() + entry.minutes * 60000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      csv += `${entry.date},${entry.day},${entry.month},${entry.year},${dayOfWeek},${entry.instituteName},${estimatedStart},${estimatedEnd},${hours.toFixed(2)},${entry.hourlyRate},${entry.tds ? 'Yes' : 'No'},${salary.toFixed(2)},${entry.minutes},\n`;
    });

    csv += '\n';

    // ===== PERFORMANCE INSIGHTS ===== (only for all-time reports)
    if (filename.includes('all-time')) {
      csv += 'PERFORMANCE INSIGHTS\n';
      const topInstitute = Object.entries(instituteStats).sort(([,a], [,b]) => b.totalSalary - a.totalSalary)[0];
      const busiestDay = Object.entries(
        sortedEntries.reduce((acc, entry) => {
          const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
          acc[day] = (acc[day] || 0) + entry.minutes / 60;
          return acc;
        }, {})
      ).sort(([,a], [,b]) => b - a)[0];

      csv += `Top Performing Institute: ${topInstitute ? topInstitute[0] : 'N/A'} (${topInstitute ? topInstitute[1].totalSalary.toFixed(2) : 0} INR)\n`;
      csv += `Busiest Day of Week: ${busiestDay ? busiestDay[0] : 'N/A'} (${busiestDay ? busiestDay[1].toFixed(2) : 0} hours)\n`;
      csv += `Most Productive Month: ${Object.entries(monthlyStats).sort(([,a], [,b]) => b.totalSalary - a.totalSalary)[0]?.[0] || 'N/A'}\n`;
      csv += `Average Session Duration: ${(totalMinutes / sortedEntries.length / 60).toFixed(2)} hours\n`;
      csv += `Consistency Score: ${new Set(sortedEntries.map(e => e.date)).size} days worked out of ${sortedEntries.length} sessions\n\n`;
    }

    // ===== FOOTER =====
    csv += '--- END OF REPORT ---\n';
    csv += 'Generated by Teaching Hours Calculator\n';
    csv += 'For any queries, contact: Fadilrafeek29@gmail.com\n';

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `teaching-professional-report-${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  async function handleApprove(uid) {
    await approveUser(uid);
    setAdminUsers((prev) => prev.map((user) => (user.id === uid ? { ...user, status: "approved" } : user)));
    await Swal.fire({
      title: "User Approved",
      text: "The user has been approved successfully.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
    reloadUsers().catch((e) => window.alert(e.message));
  }

  async function handleReject(uid) {
    await rejectUser(uid);
    setAdminUsers((prev) => prev.map((user) => (user.id === uid ? { ...user, status: "rejected" } : user)));
    await Swal.fire({
      title: "Rejected",
      text: "User has been rejected.",
      icon: "info",
      timer: 1000,
      showConfirmButton: false,
    });
    reloadUsers().catch((e) => window.alert(e.message));
  }

  async function handleDeleteUser(uid, email) {
    const result = await Swal.fire({
      title: "Delete user?",
      text: `Delete ${email} and all of their data permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteUser(uid);
      setAdminUsers((prev) => prev.filter((user) => user.id !== uid));
      await Swal.fire({
        title: "Deleted",
        text: "The user and their data have been removed.",
        icon: "success",
        timer: 800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete error:", err);
      await Swal.fire({
        title: "Delete Failed",
        text: err.message || "Failed to delete user. Please check browser console for details.",
        icon: "error",
      });
    }
  }

  async function handleSignup(email, password, name) {
    try {
      await signup(email, password, name);
      setSignupEmail(email);
    } catch (e) {
      window.alert(e.message);
    }
  }

  async function handleLogin(email, password) {
    try {
      await login(email, password, ADMIN_EMAIL);
      await Swal.fire({
        title: "Login successful",
        text: "Welcome back to Teaching Hours Calculator.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      const code = e?.code || "";
      if (code === "auth/invalid-credential") {
        await Swal.fire({
          title: "Login failed",
          text: `Invalid email or password. If this is admin login, make sure ${ADMIN_EMAIL} exists in Firebase Authentication with the correct password.`,
          icon: "error",
        });
        return;
      }
      if (code === "auth/too-many-requests") {
        await Swal.fire({
          title: "Too many attempts",
          text: "Too many failed login attempts. Please wait and try again.",
          icon: "warning",
        });
        return;
      }
      window.alert(e.message);
    }
  }

  async function handleAdminLogin(password) {
    await handleLogin(ADMIN_EMAIL, password);
  }

  async function handleForgotPassword(email) {
    try {
      await forgotPassword(email);
      window.alert("Reset link sent!");
    } catch (e) {
      window.alert(e.message);
    }
  }

  async function handleEditName() {
    const { value: updatedProfile } = await Swal.fire({
      title: "Update Profile",
      html: `
        <input id="swal-name" type="text" class="swal2-input" placeholder="Full name" value="${user?.profile?.name || ""}" />
        <input id="swal-phone" type="tel" class="swal2-input" placeholder="Phone number" value="${user?.profile?.phone || ""}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const nameValue = document.getElementById("swal-name")?.value || "";
        const phoneValue = document.getElementById("swal-phone")?.value || "";
        if (!nameValue.trim()) {
          Swal.showValidationMessage("Please enter your name.");
          return null;
        }
        return {
          name: nameValue.trim(),
          phone: phoneValue.trim(),
        };
      },
    });

    if (updatedProfile) {
      try {
        await updateUserProfile(user.uid, updatedProfile);
        await Swal.fire({
          title: "Profile updated",
          text: "Your name and phone number were saved.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        window.alert("Failed to update profile: " + err.message);
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  if (signupEmail) {
    return (
      <div className="app-shell justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur">
          <h2 className="mb-2 text-2xl font-semibold text-amber-200">Account Pending Approval</h2>
          <p className="mb-5 text-slate-300">{signupEmail}</p>
          <p className="mb-6 text-slate-400">Your account is created and waiting for admin approval. You can close and login again later.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="btn-secondary w-auto px-4"
              onClick={async () => {
                await logout();
                setSignupEmail(null);
              }}
            >
              Close
            </button>
            <button type="button" className="btn-secondary w-auto px-4" onClick={install}>
              Install App
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-shell justify-center">
        <div className="container max-w-5xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="inline-block rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs uppercase tracking-wider text-blue-200">
                Welcome back
              </p>
              <h1 className="text-left">Teaching Hours Calculator</h1>
              <p className="text-slate-300">
                Login to track your classes, calculate salary, and access monthly reports. If you are new, sign up and wait for
                admin approval.
              </p>
            </div>
            <AuthSection
              onLogin={handleLogin}
              onSignup={handleSignup}
              onAdminLogin={handleAdminLogin}
              onForgotPassword={handleForgotPassword}
              onInstall={install}
            />
          </div>
        </div>
        <div className="footer">
          <p>
            Created by <span>Fadil Rafeek CMA</span>
          </p>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="app-shell justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur">
          <h2 className="mb-2 text-2xl font-semibold text-amber-200">Account Pending Approval</h2>
          <p className="mb-5 text-slate-300">{user.email}</p>
          <p className="mb-6 text-slate-400">Your account is created and waiting for admin approval. You can close and login again later.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className="btn-secondary w-auto px-4" onClick={logout}>
              Logout
            </button>
            <button type="button" className="btn-secondary w-auto px-4" onClick={install}>
              Install App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="container">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="mb-0">Teaching Hours Calculator</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <button
              type="button"
              className="btn-secondary w-auto px-3 py-1.5 text-xs flex items-center gap-2"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={16} />
              Menu
            </button>
          </div>
        </div>
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} isAdmin={isAdmin} />

        {activeTab === "today" && isApproved && (
          <CalculateTab
            form={form}
            setForm={setForm}
            institutes={institutes}
            showNewInstitute={showNewInstitute}
            newInstitute={newInstitute}
            setNewInstitute={setNewInstitute}
            onSaveInstitute={handleSaveInstitute}
            onCalculate={handleCalculate}
            result={result}
            onAddToRecord={handleAddRecord}
            onEditInstitute={handleEditInstitute}
            onDeleteInstitute={handleDeleteInstitute}
          />
        )}

        {activeTab === "monthly" && isApproved && (
          <MonthlyTab
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            totalHours={monthlyHours}
            entries={filteredMonthly}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        )}

        {activeTab === "salary" && isApproved && (
          <ReportsTab
            month={salaryMonth}
            year={salaryYear}
            setMonth={setSalaryMonth}
            setYear={setSalaryYear}
            monthlyRows={monthlyRows}
            monthlyTotal={monthlyTotal}
            allTimeRows={allTimeRows}
            allTimeTotal={allTimeTotal}
            onDownloadCsv={downloadCsv}
          />
        )}

        {activeTab === "insights" && isApproved && (
          <InsightsTab entries={entries} />
        )}
      </div>

      {adminMode && (
        <div className="fixed inset-0 z-40 bg-slate-950 overflow-y-auto">
          <div className="container min-h-full py-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="mb-0">Admin Panel</h1>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <button
                  type="button"
                  className="btn-secondary w-auto px-3 py-1.5 text-xs flex items-center gap-2"
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu size={16} />
                  Menu
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-secondary w-auto px-3 py-1.5 text-xs"
                  onClick={handleExitAdminMode}
                >
                  ← Back to Calculator
                </button>
              </div>
            </div>

            <div className="tabs mb-6">
              <button
                type="button"
                className={`tab ${activeTab === "adminDashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("adminDashboard")}
              >
                Admin Dashboard
              </button>
              <button
                type="button"
                className={`tab ${activeTab === "admin" ? "active" : ""}`}
                onClick={() => setActiveTab("admin")}
              >
                User Management
              </button>
            </div>

            {activeTab === "adminDashboard" && isAdmin && (
              <AdminDashboardTab
                users={adminUsers}
                selectedUserId={adminSelectedUserId}
                onSelectUser={setAdminSelectedUserId}
                selectedUser={selectedAdminUser}
                month={adminMonth}
                year={adminYear}
                setMonth={setAdminMonth}
                setYear={setAdminYear}
                monthlyRows={adminMonthlyRows}
                monthlyHours={adminMonthlyHours}
                monthlySalary={adminMonthlySalary}
                instituteCount={adminInstitutes.length}
              />
            )}

            {activeTab === "admin" && isAdmin && (
              <AdminTab
                users={adminUsers}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={closeMenu}></div>
          <div className="relative ml-auto h-full max-h-full w-full max-w-sm overflow-y-auto bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Menu</p>
                <h3 className="text-xl font-semibold text-slate-100">Account</h3>
              </div>
              <button type="button" className="text-slate-300 hover:text-slate-100" onClick={closeMenu}>
                <X size={20} />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 mb-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Welcome</p>
                  <p className="text-lg font-semibold text-slate-100">{user?.profile?.name || user?.email}</p>
                  <p className="text-xs text-slate-500 break-words">{user?.email}</p>
                  {user?.profile?.phone && (
                    <p className="text-xs text-slate-500 break-words">{user?.profile?.phone}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3">{isAdmin ? "Administrator" : isApproved ? "Approved user" : "Pending approval"}</p>
                <button
                  type="button"
                  className="w-full rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20"
                  onClick={() => {
                    closeMenu();
                    handleEditName();
                  }}
                >
                  Update Profile
                </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                onClick={() => {
                  closeMenu();
                  install();
                }}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={18} />
                  Install App
                </span>
                <span className="text-slate-400">Add to home</span>
              </button>
              {isAdmin && (
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                  onClick={handleAdminRedirect}
                >
                  <span className="flex items-center gap-2">
                    <Shield size={18} />
                    Admin Panel
                  </span>
                  <span className="text-slate-400">Manage users</span>
                </button>
              )}
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                onClick={handleMenuChangePassword}
              >
                <span className="flex items-center gap-2">
                  <Lock size={18} />
                  Change password
                </span>
                <Key size={18} />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                onClick={() => {
                  closeMenu();
                  handleForgotPassword(user?.email || "");
                }}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={18} />
                  Forgot password
                </span>
                <span className="text-slate-400">Send email</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                onClick={handleMenuSupport}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={18} />
                  Support team
                </span>
                <span className="text-slate-400">Contact</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-left text-slate-100 hover:border-blue-400"
                onClick={handleMenuLogout}
              >
                <span className="flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {changePasswordModal && (
        <ChangePassword onClose={() => setChangePasswordModal(false)} />
      )}

      <div className="footer">
        <p>
          Created by <span>Fadil Rafeek CMA</span>
        </p>
      </div>
    </div>
  );
}
