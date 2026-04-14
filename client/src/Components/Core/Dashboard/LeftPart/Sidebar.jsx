import { Menu, LogOut, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NAV_ITEMS } from "../../../../data/navItems";
import { setSidebarCollapsed } from "../../../../Slices/campaignSlice";
import { logout } from "../../../../Services/Operations/authAPI";
import SidebarButton from "./SidebarButton";

const ROUTES = {
  dashboard: "/dashboard",
  campaigns: "/dashboard/campaigns",
  "my-campaigns": "/dashboard/my-campaigns",
  contributions: "/dashboard/contributions",
  profile: "/dashboard/profile",
  admin: "/dashboard/admin",
};

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sidebarCollapsed } = useSelector((state) => state.campaign);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-surface-2 border-r border-app flex flex-col z-30 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-app">
        <div className="w-8 h-8 bg-[#F97316]/20 rounded-lg flex items-center justify-center shrink-0">
          <IndianRupee size={16} className="text-[#F97316]" />
        </div>
        {!sidebarCollapsed && <span className="font-black text-app text-lg tracking-tight">Inspirefund</span>}
        <button
          onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
          className={`ml-auto text-muted hover:text-[#F97316] ${sidebarCollapsed ? "mx-auto" : ""}`}
        >
          <Menu size={18} />
        </button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.filter((i) => !i.admin || user?.role === "admin").map(({ id, label, icon: Icon, admin }) => (
          <SidebarButton
            key={id}
            to={ROUTES[id]}
            label={label}
            icon={Icon}
            admin={admin}
            collapsed={sidebarCollapsed}
            end={id === "dashboard" || id === "campaigns"}
          />
        ))}
      </nav>
      <div className="border-t border-app p-4">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-app text-xs font-bold border border-app">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-app text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-muted text-xs truncate">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="text-muted hover:text-red-400 mx-auto block">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

