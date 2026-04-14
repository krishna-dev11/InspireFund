import { PlusCircle, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setShowCreateModal } from "../../Slices/campaignSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchQuery, sidebarCollapsed } = useSelector((state) => state.campaign);
  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <header
      className="fixed top-0 right-0 bg-white border-b border-gray-100 flex items-center gap-4 px-6 py-3.5 z-20 transition-all"
      style={{ left: sidebarWidth }}
    >
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search campaigns…"
          className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => dispatch(setShowCreateModal(true))}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-indigo-200"
        >
          <PlusCircle size={15} /> Create
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
