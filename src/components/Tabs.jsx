const TAB_LABELS = {
  today: "Calculate",
  monthly: "Monthly Hours",
  salary: "Reports",
  insights: "Insights",
  adminDashboard: "Admin Dashboard",
  admin: "Admin",
};

export default function Tabs({ activeTab, onTabChange, isAdmin, adminOnly = false }) {
  const tabs = adminOnly ? ["adminDashboard", "admin"] : ["today", "monthly", "salary", "insights", ...(isAdmin ? ["adminDashboard", "admin"] : [])];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
