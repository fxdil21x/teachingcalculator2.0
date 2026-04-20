import { Plus } from "lucide-react";

export default function FAB({ onClick, icon: Icon = Plus, label = "Add" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fab"
      aria-label={label}
    >
      <Icon size={24} strokeWidth={2.5} />
    </button>
  );
}
