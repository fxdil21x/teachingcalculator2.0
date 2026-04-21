import { Calculator, Calendar, FileText, BarChart3, BookOpen } from "lucide-react";

const TAB_CONFIG = [
  { id: "today", label: "Calculate", icon: Calculator },
  { id: "monthly", label: "Hours", icon: Calendar },
  { id: "batch-report", label: "Batch Report", icon: BookOpen },
  { id: "salary", label: "Salary", icon: FileText },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

export default function Tabs({ activeTab, onTabChange, isAdmin }) {
  return (
    <div className="tabs">
      {TAB_CONFIG.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={16} className="mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
