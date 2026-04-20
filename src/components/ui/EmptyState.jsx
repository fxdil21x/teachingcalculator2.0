import { Calendar, FileText, Building2, BarChart3 } from "lucide-react";

const ICONS = {
  calendar: Calendar,
  file: FileText,
  building: Building2,
  chart: BarChart3,
};

export default function EmptyState({
  icon = "calendar",
  title,
  description,
  action,
  onAction,
}) {
  const Icon = ICONS[icon] || Calendar;

  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <Icon className="w-full h-full" strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary mt-4 w-auto px-6"
        >
          {action}
        </button>
      )}
    </div>
  );
}
