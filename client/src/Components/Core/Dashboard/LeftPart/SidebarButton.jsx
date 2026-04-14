import { useMatch, useNavigate } from "react-router-dom";

function SidebarButton({ to, label, icon: Icon, admin, collapsed, end }) {
  const navigate = useNavigate();
  const match = useMatch({ path: to, end });
  const isActive = !!match;

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-white/10 text-white border-r-2 border-amber-400"
          : "text-indigo-300 hover:bg-white/5 hover:text-white"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : ""}
      type="button"
    >
      <Icon size={18} className={admin ? "text-amber-400" : ""} />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

export default SidebarButton;
