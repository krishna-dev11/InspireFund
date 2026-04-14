import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { IndianRupee } from "lucide-react";
import PrivateRoute from "./Components/Core/Auth/PrivateRoute";
import OpenRoute from "./Components/Core/Auth/OpenRoute";
import Spinner from "./Components/Common/Spinner";
import ToastContainer from "./Components/Common/ToastContainer";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import DashboardHomePage from "./Pages/DashboardHome";
import Campaigns from "./Pages/Campaigns";
import CampaignDetail from "./Pages/CampaignDetail";
import MyCampaigns from "./Pages/MyCampaigns";
import Contributions from "./Pages/Contributions";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin";
import CreateCampaign from "./Pages/CreateCampaign";
import AboutPage from "./Pages/AboutPage";
import ContactUsPage from "./Pages/ContactUsPage";
import { initializeAuth } from "./Services/Operations/authAPI";
import loadRazorpay from "./Utilities/loadRazorpay";
import Heropage from "./Pages/Heropage";

function App() {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
    loadRazorpay();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center">
            <IndianRupee size={24} className="text-indigo-900" />
          </div>
          <Spinner size={28} />
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/hero" element={<Heropage />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="my-campaigns" element={<MyCampaigns />} />
          <Route path="contributions" element={<Contributions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
          <Route path="create" element={<CreateCampaign />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
