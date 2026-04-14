import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Common/Navbar";
import Sidebar from "../Components/Core/Dashboard/LeftPart/Sidebar";
import CreateCampaignModal from "../Components/Core/Campaign/CreateCampaignModal";
import { setShowCreateModal } from "../Slices/campaignSlice";
import { getUserCampaigns } from "../Services/Operations/profileAPI";

function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { showCreateModal, sidebarCollapsed } = useSelector((state) => state.campaign);
  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  const handleClose = () => dispatch(setShowCreateModal(false));

  const handleCreated = () => {
    if (location.pathname.includes("my-campaigns")) {
      dispatch(getUserCampaigns());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showCreateModal && <CreateCampaignModal onClose={handleClose} onCreated={handleCreated} />}
      <Sidebar />
      <Navbar />
      <main className="transition-all duration-300 pt-16 min-h-screen" style={{ marginLeft: sidebarWidth }}>
        <div className="p-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
