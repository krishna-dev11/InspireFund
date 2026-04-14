import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandCoins, IndianRupee, Rocket, Star } from "lucide-react";
import StatCard from "../../../Common/StatCard";
import formatCurrency from "../../../../Utilities/formatCurrency";
import { getProfileStats } from "../../../../Services/Operations/profileAPI";

function ProfilePanel() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileStats } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfileStats());
  }, [dispatch]);

  const roleLabel = user?.role === "admin" ? "Admin" : user?.role === "creator" ? "Creator" : "Supporter";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="app-card p-8 text-center mb-6">
        <div className="w-20 h-20 bg-[#F97316]/15 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-3 text-[#F97316] border border-app">
          {user?.name?.[0]}
        </div>
        <h1 className="text-2xl font-black text-app">{user?.name}</h1>
        <p className="text-muted text-sm">{user?.email}</p>
        <span className="mt-2 inline-block bg-[#F97316]/15 text-[#F97316] text-xs px-3 py-1 rounded-full font-semibold">
          {roleLabel}
        </span>
      </div>
      {profileStats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={Rocket} label="Campaigns Created" value={profileStats.campaigns} color="indigo" />
          <StatCard icon={IndianRupee} label="Total Raised" value={formatCurrency(profileStats.raised)} color="amber" />
          <StatCard icon={HandCoins} label="Total Contributed" value={formatCurrency(profileStats.contributed)} color="violet" />
          <StatCard icon={Star} label="Campaigns Backed" value={profileStats.backed} color="emerald" />
        </div>
      )}
      <div className="app-card p-6 space-y-3">
        <h2 className="font-bold text-app mb-4">Account Info</h2>
        {[
          { label: "Full Name", value: user?.name },
          { label: "Email", value: user?.email },
          { label: "Role", value: user?.role },
          { label: "User ID", value: user?.id },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-app last:border-0">
            <span className="text-sm text-muted">{label}</span>
            <span className="text-sm font-semibold text-app font-mono text-xs">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePanel;
