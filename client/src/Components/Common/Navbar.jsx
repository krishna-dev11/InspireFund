import { PlusCircle, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setShowCreateModal } from "../../Slices/campaignSlice";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchQuery, sidebarCollapsed } = useSelector((state) => state.campaign);
  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <header
      className="fixed top-0 right-0 app-surface flex items-center gap-4 px-6 py-3.5 z-20 transition-all backdrop-blur"
      style={{ left: sidebarWidth }}
    >
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search campaigns..."
          className="w-full pl-8 pr-4 py-2 input-base text-sm"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => dispatch(setShowCreateModal(true))}
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm"
        >
          <PlusCircle size={15} /> Create
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border border-app bg-surface-2 text-app">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
