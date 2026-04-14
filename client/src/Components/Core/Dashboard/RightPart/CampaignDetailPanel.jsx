import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Heart,
  Lock,
  MessageSquare,
  Rocket,
  Share2,
} from "lucide-react";
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
        name: "FundIndia",
        description: campaign.title,
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#4f46e5" },
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
            showToast(`Payment of ${formatCurrency(Number(amount))} successful! ??`, "success");
            setAmount("");
            setSelectedPreset(null);
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
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Campaigns
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl h-64 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50">
            {campaign.image ? (
              <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
            ) : (
              <Rocket size={56} className="text-indigo-200" />
            )}
            <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status === "completed"
                ? "? Fully Funded"
                : campaign.status === "pending"
                ? "? Pending Approval"
                : days > 0
                ? "? Active"
                : "Ended"}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{campaign.category}</span>
            <h1 className="text-2xl font-black text-gray-900 mt-3 mb-2">{campaign.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">
                {campaign.creator?.name?.[0] || "C"}
              </div>
              <span>
                by <strong className="text-gray-700">{campaign.creator?.name || "Creator"}</strong>
              </span>
              <span>·</span>
              <span>Created {Math.floor((Date.now() - new Date(campaign.createdAt)) / 86400000)} days ago</span>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <div className="flex">
              {["overview", "contributors", "updates"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {tab === "overview" && (
            <div className="space-y-5">
              <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
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
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-semibold text-gray-800 text-sm capitalize">{value}</p>
                  </div>
                ))}
                {campaign.tags?.length > 0 && (
                  <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.tags.map((t) => (
                        <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
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
              <h3 className="font-bold text-gray-900 mb-4">Recent Contributors</h3>
              {contributors.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No contributions yet</div>
              ) : (
                <div className="space-y-3">
                  {contributors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {c.userId?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{c.userId?.name || "Anonymous"}</p>
                        <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className="font-bold text-gray-800">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "updates" && (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No updates yet</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-indigo-50">
            <div className="text-center mb-5">
              <p className="text-3xl font-black text-gray-900">{formatCurrency(campaign.raisedAmount)}</p>
              <p className="text-sm text-gray-500">
                raised of <span className="font-semibold text-gray-700">{formatCurrency(campaign.targetAmount)}</span> goal
              </p>
            </div>
            <ProgressBar value={pct} size="lg" />
            <p className="text-xs text-gray-400 text-right mt-1">{pct}% funded</p>
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="text-center bg-indigo-50 rounded-xl p-3">
                <p className="text-xl font-black text-indigo-700">{campaign.contributors?.length ?? 0}</p>
                <p className="text-xs text-indigo-500">Backers</p>
              </div>
              <div className="text-center bg-amber-50 rounded-xl p-3">
                <p className="text-xl font-black text-amber-700">{days}</p>
                <p className="text-xs text-amber-500">Days left</p>
              </div>
            </div>
            {canFund && (
              <div className="space-y-3 mb-3">
                <p className="text-sm font-semibold text-gray-700">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPreset(p);
                        setAmount(String(p));
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                        selectedPreset === p ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      ?{formatNumber(p)}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">?</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPreset(null);
                    }}
                    placeholder="Custom amount"
                    className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                {amount && Number(amount) > 0 && (
                  <p className="text-xs text-amber-600">
                    Actual contribution after 5% fee: {formatCurrency(Math.round(Number(amount) * 0.95))}
                  </p>
                )}
                <button
                  onClick={handleFund}
                  disabled={payLoading || !amount || Number(amount) <= 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {payLoading ? <Spinner size={16} /> : null}
                  {payLoading ? "Opening Razorpay…" : `Fund ${amount ? formatCurrency(Number(amount)) : "this Campaign"} ??`}
                </button>
              </div>
            )}
            {!canFund && campaign.status !== "active" && (
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500 text-center mb-3">
                {campaign.status === "pending"
                  ? "? Awaiting admin approval"
                  : campaign.status === "completed"
                  ? "? Campaign fully funded"
                  : "Campaign is not accepting funds"}
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                <Heart size={14} /> Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                <Share2 size={14} /> Share
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
              <Lock size={11} className="inline mr-1" /> Secured by Razorpay · 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetailPanel;
