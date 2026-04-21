import { Calculator, Calendar, FileText, BarChart3, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { id: "today", label: "Calculate", icon: Calculator },
  { id: "monthly", label: "Hours", icon: Calendar },
  { id: "batch-report", label: "Batches", icon: BookOpen },
  { id: "salary", label: "Salary", icon: FileText },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
