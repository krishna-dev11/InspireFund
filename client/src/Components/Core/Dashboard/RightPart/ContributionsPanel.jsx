import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandCoins, Rocket } from "lucide-react";
import StatCard from "../../../Common/StatCard";
import Spinner from "../../../Common/Spinner";
import formatCurrency from "../../../../Utilities/formatCurrency";
import { getUserContributions } from "../../../../Services/Operations/profileAPI";

function ContributionsPanel() {
  const dispatch = useDispatch();
  const { userContributions, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserContributions());
  }, [dispatch]);

  const total = userContributions.reduce((a, c) => a + c.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Contributions</h1>
      <p className="text-gray-500 text-sm mb-6">Projects you've backed with real Razorpay payments</p>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard icon={HandCoins} label="Total Contributed" value={formatCurrency(total)} color="amber" />
        <StatCard icon={Rocket} label="Campaigns Backed" value={userContributions.length} color="indigo" />
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : userContributions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HandCoins size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No contributions yet</p>
          <p className="text-sm">Back a campaign to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userContributions.map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {c.campaignId?.image ? (
                  <img src={c.campaignId.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Rocket size={18} className="text-indigo-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{c.campaignId?.title || "Campaign"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                {c.paymentId && <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {c.paymentId}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-gray-900">{formatCurrency(c.amount)}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    c.status === "paid" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContributionsPanel;
