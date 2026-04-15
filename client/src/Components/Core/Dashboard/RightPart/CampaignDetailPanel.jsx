import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, Lock, MessageSquare, Rocket, Share2 } from "lucide-react";
import ProgressBar from "../../../Common/ProgressBar";
import Spinner from "../../../Common/Spinner";
import formatCurrency, { formatNumber } from "../../../../Utilities/formatCurrency";
import { calcProgress, daysLeft, getStatusColor } from "../../../../Utilities/campaignHelpers";
import loadRazorpay from "../../../../Utilities/loadRazorpay";
import showToast from "../../../../Utilities/showToast";
import { getCampaignById, getCampaignContributions } from "../../../../Services/Operations/campaignAPI";
import { initiatePayment, verifyPayment } from "../../../../Services/Operations/paymentAPI";
import { setContributors, setSelectedCampaign } from "../../../../Slices/campaignSlice";

function CampaignDetailPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { selectedCampaign, contributors } = useSelector((state) => state.campaign);

  const [campaign, setCampaign] = useState(selectedCampaign);
  const [tab, setTab] = useState("overview");
  const [amount, setAmount] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const presets = useMemo(() => [500, 1000, 2500, 5000], []);

  useEffect(() => {
    loadRazorpay();
  }, []);

  useEffect(() => {
    if (!campaign || campaign._id !== id) {
      dispatch(getCampaignById(id)).then((data) => {
        if (data) {
          setCampaign(data);
          dispatch(setSelectedCampaign(data));
        }
      });
    }
  }, [dispatch, id, campaign, selectedCampaign]);

  useEffect(() => {
    if (campaign?._id) {
      dispatch(setContributors([]));
    }
  }, [dispatch, campaign?._id]);

  useEffect(() => {
    if (tab === "contributors" && campaign?._id) {
      dispatch(getCampaignContributions(campaign._id));
    }
  }, [dispatch, tab, campaign]);

  if (!campaign) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={36} />
      </div>
    );
  }

  const pct = calcProgress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  const canFund = campaign.status === "active" && days > 0;

  const handleFund = async () => {
    if (!amount || Number(amount) <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    setPayLoading(true);
    try {
      const data = await dispatch(
        initiatePayment({ campaignId: campaign._id, amount: Number(amount) })
      );
      if (!data) {
        setPayLoading(false);
        return;
      }
      const { order, keyId } = data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: "INR",
        name: "Inspirefund",
        description: campaign.title,
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#F97316" },
        handler: async (response) => {
          const verified = await dispatch(
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          );
          if (verified) {
            setCampaign((prev) => ({
              ...prev,
              raisedAmount: prev.raisedAmount + Number(amount),
              contributors: [...(prev.contributors || []), user?.id],
            }));
            showToast(`Payment of ${formatCurrency(Number(amount))} successful!`, "success");
            setAmount("");
            setSelectedPreset(null);
            setPayLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPayLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        showToast("Payment failed. Please try again.", "error");
        setPayLoading(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to initiate payment", "error");
      setPayLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/campaigns")}
        className="flex items-center gap-2 text-muted hover:text-app text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Campaigns
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Card */}
          <div className="rounded-2xl h-80 flex items-center justify-center relative overflow-hidden bg-surface-2 border border-app shadow-sm">
            {campaign.image ? (
              <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
            ) : (
              <Rocket size={56} className="text-[#F97316]" />
            )}
            <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full shadow-lg ${getStatusColor(campaign.status)}`}>
              {campaign.status === "completed"
                ? "Fully Funded"
                : campaign.status === "pending"
                ? "Pending Approval"
                : days > 0
                ? "Active"
                : "Ended"}
            </span>
          </div>

          {/* Title and Metadata */}
          <div>
            <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded-full uppercase tracking-wider">{campaign.category}</span>
            <h1 className="text-3xl font-black text-app mt-4 mb-3 leading-tight">{campaign.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F97316]/15 rounded-full flex items-center justify-center font-bold text-[#F97316] border border-[#F97316]/20">
                  {campaign.creator?.name?.[0] || "C"}
                </div>
                <span>by <strong className="text-app">{campaign.creator?.name || "Creator"}</strong></span>
              </div>
              <span className="hidden md:inline text-neutral-700">•</span>
              <span>Created {Math.floor((Date.now() - new Date(campaign.createdAt)) / 86400000)} days ago</span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-app">
            <div className="flex gap-2">
              {["overview", "contributors", "updates"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${
                    tab === t ? "border-[#F97316] text-[#F97316]" : "border-transparent text-muted hover:text-app"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-2">
            {tab === "overview" && (
              <div className="space-y-8">
                {/* --- CORRECTED DESCRIPTION SECTION --- */}
                <div className="bg-surface-1 rounded-2xl p-6 border border-app shadow-inner">
                   <h3 className="text-lg font-bold text-app mb-4">About the Campaign</h3>
                   {/* This handles both HTML content and plain text line breaks */}
                   <div 
                    className="text-app leading-relaxed whitespace-pre-line break-words text-base opacity-90"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                   />
                </div>

                {/* Campaign Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Deadline", value: new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })},
                    { label: "Category", value: campaign.category },
                    { label: "Status", value: campaign.status },
                    { label: "Created On", value: new Date(campaign.createdAt).toLocaleDateString("en-IN") },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-2 rounded-xl p-4 border border-app hover:border-[#F97316]/30 transition-colors">
                      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">{label}</p>
                      <p className="font-bold text-app text-sm capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Tags Section */}
                {campaign.tags?.length > 0 && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-app">
                    <p className="text-xs font-bold text-muted mb-3 uppercase tracking-tighter">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.tags.map((t) => (
                        <span key={t} className="text-[11px] font-bold bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-lg border border-[#F97316]/20">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "contributors" && (
              <div className="space-y-4">
                <h3 className="font-bold text-app mb-2">Backer Community</h3>
                {contributors.length === 0 ? (
                  <div className="text-center py-12 bg-surface-2 rounded-2xl border border-dashed border-app text-muted">No contributions yet. Be the first!</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {contributors.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl border border-app hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-black">
                          {c.userId?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-app text-sm">{c.userId?.name || "Anonymous Backer"}</p>
                          <p className="text-[11px] text-muted uppercase tracking-tighter">{new Date(c.createdAt).toLocaleDateString("en-IN", {month: 'long', day: 'numeric'})}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-[#F97316] text-lg">{formatCurrency(c.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "updates" && (
              <div className="text-center py-20 bg-surface-2 rounded-2xl border border-app">
                <MessageSquare size={40} className="mx-auto mb-4 text-[#F97316] opacity-40" />
                <p className="font-bold text-app">No updates posted yet</p>
                <p className="text-sm text-muted mt-1 px-10">The creator hasn't shared any updates for this campaign yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Funding Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 app-card p-6 shadow-xl border-[#F97316]/10">
            <div className="mb-6">
              <p className="text-4xl font-black text-app leading-none mb-2">{formatCurrency(campaign.raisedAmount)}</p>
              <p className="text-sm text-muted">
                raised of <span className="font-bold text-app">{formatCurrency(campaign.targetAmount)}</span> goal
              </p>
            </div>

            <div className="space-y-2 mb-6">
               <ProgressBar value={pct} size="lg" />
               <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#F97316]">{pct}% funded</p>
                  <p className="text-xs text-muted">{campaign.contributors?.length ?? 0} Backers</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-app">
                <p className="text-2xl font-black text-app">{days}</p>
                <p className="text-[10px] uppercase font-bold text-muted">Days Left</p>
              </div>
              <div className="text-center bg-[#F97316]/5 rounded-2xl p-4 border border-[#F97316]/20">
                <p className="text-2xl font-black text-[#F97316]">{campaign.contributors?.length ?? 0}</p>
                <p className="text-[10px] uppercase font-bold text-muted tracking-tighter">Supporters</p>
              </div>
            </div>

            {canFund && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-sm font-bold text-app">Select Amount</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPreset(p);
                        setAmount(String(p));
                      }}
                      className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${
                        selectedPreset === p 
                        ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]" 
                        : "border-app text-muted hover:border-[#F97316]/50"
                      }`}
                    >
                      ₹{formatNumber(p)}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#F97316]">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPreset(null);
                    }}
                    placeholder="Enter Custom Amount"
                    className="w-full pl-10 pr-4 py-3 bg-surface-2 border-2 border-app rounded-xl focus:border-[#F97316] outline-none transition-all font-bold text-app"
                  />
                </div>

                {amount && Number(amount) > 0 && (
                  <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                    <p className="text-[11px] text-muted flex justify-between mb-1">
                      <span>Platform Fee (5%)</span>
                      <span>-{formatCurrency(Math.round(Number(amount) * 0.05))}</span>
                    </p>
                    <p className="text-xs font-bold text-[#F97316] flex justify-between italic">
                      <span>Final Contribution</span>
                      <span>{formatCurrency(Math.round(Number(amount) * 0.95))}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleFund}
                  disabled={payLoading || !amount || Number(amount) <= 0}
                  className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {payLoading ? <Spinner size={20} /> : <Rocket size={20} />}
                  {payLoading ? "Processing..." : `CONTRIBUTE NOW`}
                </button>
              </div>
            )}

            {!canFund && (
              <div className="p-4 bg-surface-2 rounded-2xl text-center border-2 border-dashed border-app mb-6">
                <p className="text-sm font-bold text-muted">
                  {campaign.status === "pending"
                    ? "Awaiting admin approval"
                    : campaign.status === "completed"
                    ? "Goal Achieved! Funded"
                    : "Campaign is currently closed"}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-app rounded-xl text-xs font-black text-app hover:bg-white/5 transition-all uppercase tracking-tighter">
                <Heart size={16} /> Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-app rounded-xl text-xs font-black text-app hover:bg-white/5 transition-all uppercase tracking-tighter">
                <Share2 size={16} /> Share
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-app flex items-center justify-center gap-2">
              <Lock size={12} className="text-green-500" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetailPanel;