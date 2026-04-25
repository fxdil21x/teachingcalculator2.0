import { BarChart3, BookOpen, Calculator, Calendar, FileText } from "lucide-react";

export default function BottomNav({ activeTab, onTabChange }) {
  const NAV_ITEMS = [
    { id: "today", label: "Calculate", icon: Calculator },
    { id: "monthly", label: "Hours", icon: Calendar },
    { id: "batch-report", label: "Batches", icon: BookOpen },
    { id: "salary", label: "Salary", icon: FileText },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ];

  return (
    <nav
      className="fixed bottom-[10px] left-1/2 z-40 w-[min(420px,calc(100%-20px))] -translate-x-1/2 rounded-full border border-slate-700/50 backdrop-blur-xl shadow-xl"
      style={{
        padding: "10px 12px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center justify-between h-14 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center flex-1 rounded-full px-3 py-2 transition-all duration-300 text-slate-400 hover:text-slate-200"
            >
              <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                isActive ? "bg-blue-400/20" : ""
              }`}>
                <Icon
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`h-4 w-4 transition-all ${
                    isActive ? "text-blue-400 scale-110" : "text-slate-400"
                  }`}
                />
              </div>

              <span className="text-[11px] font-medium uppercase tracking-[0.05em]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

