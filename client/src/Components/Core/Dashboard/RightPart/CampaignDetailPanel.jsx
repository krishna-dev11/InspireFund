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
          <div className="rounded-2xl h-64 flex items-center justify-center relative overflow-hidden bg-surface-2 border border-app">
            {campaign.image ? (
              <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
            ) : (
              <Rocket size={56} className="text-[#F97316]" />
            )}
            <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status === "completed"
                ? "Fully Funded"
                : campaign.status === "pending"
                ? "Pending Approval"
                : days > 0
                ? "Active"
                : "Ended"}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-[#F97316] bg-[#F97316]/10 px-2.5 py-1 rounded-full">{campaign.category}</span>
            <h1 className="text-2xl font-black text-app mt-3 mb-2">{campaign.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted flex-wrap">
              <div className="w-7 h-7 bg-[#F97316]/15 rounded-full flex items-center justify-center font-bold text-[#F97316] text-xs">
                {campaign.creator?.name?.[0] || "C"}
              </div>
              <span>
                by <strong className="text-app">{campaign.creator?.name || "Creator"}</strong>
              </span>
              <span>·</span>
              <span>Created {Math.floor((Date.now() - new Date(campaign.createdAt)) / 86400000)} days ago</span>
            </div>
          </div>
          <div className="border-b border-app">
            <div className="flex">
              {["overview", "contributors", "updates"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    tab === t ? "border-[#F97316] text-[#F97316]" : "border-transparent text-muted hover:text-app"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {tab === "overview" && (
            <div className="space-y-5">
              <p className="text-app leading-relaxed">{campaign.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Deadline",
                    value: new Date(campaign.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                  { label: "Category", value: campaign.category },
                  { label: "Status", value: campaign.status },
                  { label: "Created", value: new Date(campaign.createdAt).toLocaleDateString("en-IN") },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface-2 rounded-xl p-4 border border-app">
                    <p className="text-xs text-muted mb-1">{label}</p>
                    <p className="font-semibold text-app text-sm capitalize">{value}</p>
                  </div>
                ))}
                {campaign.tags?.length > 0 && (
                  <div className="col-span-2 bg-surface-2 rounded-xl p-4 border border-app">
                    <p className="text-xs text-muted mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.tags.map((t) => (
                        <span key={t} className="text-xs bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === "contributors" && (
            <div>
              <h3 className="font-bold text-app mb-4">Recent Contributors</h3>
              {contributors.length === 0 ? (
                <div className="text-center py-8 text-muted text-sm">No contributions yet</div>
              ) : (
                <div className="space-y-3">
                  {contributors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-app">
                      <div className="w-9 h-9 bg-[#F97316]/15 rounded-full flex items-center justify-center text-[#F97316] text-xs font-bold">
                        {c.userId?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-app text-sm">{c.userId?.name || "Anonymous"}</p>
                        <p className="text-xs text-muted">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className="font-bold text-app">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "updates" && (
            <div className="text-center py-10 text-muted">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No updates yet</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 app-card p-5">
            <div className="text-center mb-5">
              <p className="text-3xl font-black text-app">{formatCurrency(campaign.raisedAmount)}</p>
              <p className="text-sm text-muted">
                raised of <span className="font-semibold text-app">{formatCurrency(campaign.targetAmount)}</span> goal
              </p>
            </div>
            <ProgressBar value={pct} size="lg" />
            <p className="text-xs text-muted text-right mt-1">{pct}% funded</p>
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="text-center bg-[#F97316]/10 rounded-xl p-3 border border-app">
                <p className="text-xl font-black text-[#F97316]">{campaign.contributors?.length ?? 0}</p>
                <p className="text-xs text-muted">Backers</p>
              </div>
              <div className="text-center bg-white/5 rounded-xl p-3 border border-app">
                <p className="text-xl font-black text-app">{days}</p>
                <p className="text-xs text-muted">Days left</p>
              </div>
            </div>
            {canFund && (
              <div className="space-y-3 mb-3">
                <p className="text-sm font-semibold text-app">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPreset(p);
                        setAmount(String(p));
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedPreset === p ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]" : "border-app text-muted hover:border-[#F97316]"
                      }`}
                    >
                      Rs {formatNumber(p)}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted text-sm">Rs</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPreset(null);
                    }}
                    placeholder="Custom amount"
                    className="w-full pl-10 pr-4 py-2.5 input-base text-sm"
                  />
                </div>
                {amount && Number(amount) > 0 && (
                  <p className="text-xs text-[#F97316]">
                    Actual contribution after 5% fee: {formatCurrency(Math.round(Number(amount) * 0.95))}
                  </p>
                )}
                <button
                  onClick={handleFund}
                  disabled={payLoading || !amount || Number(amount) <= 0}
                  className="w-full btn-primary py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {payLoading ? <Spinner size={16} /> : null}
                  {payLoading ? "Opening Razorpay..." : `Fund ${amount ? formatCurrency(Number(amount)) : "this Campaign"}`}
                </button>
              </div>
            )}
            {!canFund && campaign.status !== "active" && (
              <div className="bg-surface-2 rounded-xl p-3 text-sm text-muted text-center mb-3 border border-app">
                {campaign.status === "pending"
                  ? "Awaiting admin approval"
                  : campaign.status === "completed"
                  ? "Campaign fully funded"
                  : "Campaign is not accepting funds"}
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-app rounded-xl text-sm font-semibold text-app hover:border-[#F97316] hover:text-[#F97316] transition-all">
                <Heart size={14} /> Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-app rounded-xl text-sm font-semibold text-app hover:border-[#F97316] hover:text-[#F97316] transition-all">
                <Share2 size={14} /> Share
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-app text-xs text-muted text-center">
              <Lock size={11} className="inline mr-1" /> Secured by Razorpay - 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetailPanel;

