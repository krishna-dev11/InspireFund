import { useEffect, useState } from "react";
import {
  LayoutDashboard, Rocket, PlusCircle, FolderHeart, HandCoins, ShieldCheck,
  User, Bell, Search, Menu, X, TrendingUp, Users, IndianRupee, Target,
  ChevronRight, Clock, CheckCircle, AlertCircle, LogOut, Eye, Edit,
  Trash2, Download, Upload, Image as ImageIcon, Tag, Calendar, BarChart3,
  Star, Award, Zap, ArrowUpRight, Filter, Grid, List, ChevronDown,
  Copy, Settings, Play, Pause, RefreshCw, Heart, Share2, ExternalLink,
  FileText, MessageSquare, Wallet, Globe, Activity, Lock, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { authApi, campaignApi, paymentApi, userApi, adminApi, setAuthToken } from "./services/api";
import useDebounce from "./utils/useDebounce";
import { fmt, fmtCur, progress, daysLeft } from "./utils/format";

const CATEGORIES = ["Technology", "Social Impact", "Education", "Health", "Arts", "Environment", "Food", "Sports"];

const isUrl = (value) => typeof value === "string" && value.startsWith("http");
const isMongoId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const softScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: "easeIn" } }
};

const normalizeCampaign = (c) => ({
  id: c._id || c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  targetAmount: Number(c.targetAmount) || 0,
  raisedAmount: Number(c.raisedAmount) || 0,
  contributors: Array.isArray(c.contributors) ? c.contributors.length : Number(c.contributors || 0),
  deadline: c.deadline,
  image: c.image || "",
  status: c.status || "active",
  creator: c.creator?.name || c.creator || "Unknown",
  creatorEmail: c.creator?.email || c.creatorEmail || "",
  tags: Array.isArray(c.tags) ? c.tags : [],
  createdAt: c.createdAt || new Date().toISOString()
});

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-xl pointer-events-auto backdrop-blur-xl border border-white/20
            ${t.type === "success" ? "bg-emerald-500/90" : t.type === "error" ? "bg-red-500/90" : "bg-indigo-500/90"}`}
          >
            {t.type === "success" ? <CheckCircle size={16} /> : t.type === "error" ? <AlertCircle size={16} /> : <Info size={16} />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ProgressBar({ value, size = "md" }) {
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div className={`w-full bg-white/60 border border-zinc-200/50 rounded-full ${h} overflow-hidden shadow-inner`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-700 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] animate-pulse">
      <div className="aspect-[16/9] rounded-2xl bg-zinc-200/70 mb-4" />
      <div className="h-3 w-20 bg-zinc-200/70 rounded-full mb-3" />
      <div className="h-5 w-3/4 bg-zinc-200/70 rounded-full mb-2" />
      <div className="h-4 w-2/3 bg-zinc-200/70 rounded-full mb-4" />
      <div className="h-2 w-full bg-zinc-200/70 rounded-full" />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, growth, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)] hover:shadow-[0_30px_80px_-30px_rgba(99,102,241,0.45)] transition-all hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {growth && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <ArrowUpRight size={12} /> {growth}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <svg className="mt-3 h-8 w-full" viewBox="0 0 120 32" fill="none">
        <path d="M2 22C16 18 26 8 40 10C54 12 60 28 74 26C88 24 96 8 118 6" stroke="url(#grad)" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function CampaignCard({ campaign, onView, compact = false }) {
  const pct = progress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  const statusColor = campaign.status === "completed" ? "bg-emerald-100 text-emerald-700" : campaign.status === "active" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600";
  const badge = campaign.status === "completed"
    ? { label: "Funded", icon: <CheckCircle size={12} /> }
    : days <= 3
      ? { label: "Ending Soon", icon: <Clock size={12} /> }
      : pct >= 70
        ? { label: "Trending", icon: <Zap size={12} /> }
        : null;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl overflow-hidden shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] hover:shadow-[0_35px_90px_-45px_rgba(99,102,241,0.6)] transition-all cursor-pointer group"
      onClick={() => onView(campaign)}
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 overflow-hidden">
        {isUrl(campaign.image) ? (
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">{campaign.image || "🎯"}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xl ${statusColor}`}>
          {campaign.status === "completed" ? "Funded" : days === 0 ? "Ended" : "Active"}
        </span>
        {badge && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 text-zinc-800 flex items-center gap-1 border border-white/60 shadow-sm">
            {badge.icon} {badge.label}
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{campaign.category}</span>
        <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">{campaign.title}</h3>
        {!compact && <p className="text-gray-500 text-xs line-clamp-2 mb-3">{campaign.description}</p>}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-800">{fmtCur(campaign.raisedAmount)}</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar value={pct} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Goal: {fmtCur(campaign.targetAmount)}</span>
            <span>{campaign.contributors} backers</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} /> {days > 0 ? `${days} days left` : "Ended"}
          </span>
          <button
            className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all"
            onClick={(e) => { e.stopPropagation(); onView(campaign); }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FundModal({ campaign, user, onSuccess, onClose }) {
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const presets = [500, 1000, 2500, 5000];

  const handlePay = async () => {
    if (!isMongoId(campaign.id)) {
      setError("Campaign is still syncing. Please refresh and try again.");
      return;
    }
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    setError("");
    try {
      const { data } = await paymentApi.createOrder({ campaignId: campaign.id, amount: Number(amount) });
      const { order, keyId } = data;
      await loadRazorpay();

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "FundIndia",
        description: campaign.title,
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email },
        handler: async (response) => {
          try {
            const verifyRes = await paymentApi.verify(response);
            onSuccess(Number(amount), verifyRes.data.contribution);
            onClose();
          } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Unable to create payment order");
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        variants={softScale}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-lg p-1.5"><IndianRupee size={16} /></div>
              <span className="font-bold text-lg">FundIndia Pay</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
          </div>
          <p className="text-white/80 text-sm flex items-center gap-2"><ShieldCheck size={14} /> Powered by Razorpay · Secure & Encrypted</p>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{campaign.title}</h3>
          <p className="text-sm text-gray-500 mb-5">by {campaign.creator}</p>
          <p className="text-sm font-semibold text-gray-700 mb-2">Quick amounts</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => { setSelectedPreset(p); setAmount(String(p)); }}
                className={`py-2 text-sm font-semibold rounded-xl border-2 transition-all ${selectedPreset === p ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}
              >
                ₹{fmt(p)}
              </button>
            ))}
          </div>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700 flex gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            Platform fee of 5% helps us maintain the service. Your actual contribution: {amount ? fmtCur(Math.round(Number(amount) * 0.95)) : "—"}
          </div>
          {error && <div className="text-xs text-red-600 mb-3">{error}</div>}
          <button
            onClick={handlePay}
            disabled={!amount || Number(amount) <= 0 || processing}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_12px_30px_-16px_rgba(99,102,241,0.8)] active:scale-[0.98]"
          >
            {processing ? "Securing Transaction…" : `Pay ${amount ? fmtCur(Number(amount)) : ""}`}
          </button>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <Lock size={11} /> 256-bit SSL Encrypted · UPI · Cards · NetBanking
          </div>
        </div>
      </motion.div>
    </div>
  );
}
function CreateCampaignModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    durationDays: "30",
    category: "Technology",
    tags: "",
    image: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.targetAmount) return;
    setSubmitting(true);
    setError("");
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <p className="text-white/70 text-sm mt-0.5">Launch your idea and start raising funds</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={22} /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex gap-2 text-sm text-indigo-700">
            <Info size={16} className="shrink-0 mt-0.5" />
            Platform fee: 5% on funds raised. Ensure your details are accurate.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Title *</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Give your campaign a compelling title" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Tell your story — what problem are you solving?" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Target Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">₹</span>
                <input type="number" value={form.targetAmount} onChange={(e) => update("targetAmount", e.target.value)} placeholder="500000" className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Duration (days)</label>
              <select value={form.durationDays} onChange={(e) => update("durationDays", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                {[15, 30, 45, 60, 90].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="e.g. startup, tech, green" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Image URL</label>
              <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.description || !form.targetAmount || submitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-all mt-2"
          >
            {submitting ? "Submitting…" : "Launch Campaign →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "All Campaigns", icon: Rocket },
  { id: "my-campaigns", label: "My Campaigns", icon: FolderHeart },
  { id: "contributions", label: "My Contributions", icon: HandCoins },
  { id: "profile", label: "Profile", icon: User },
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, admin: true },
];

function Sidebar({ page, setPage, user, onLogout, collapsed, setCollapsed }) {
  return (
    <aside className={`fixed left-4 top-4 bottom-4 bg-gradient-to-b from-indigo-950/90 to-indigo-900/90 backdrop-blur-2xl border border-white/10 flex flex-col z-30 transition-all duration-300 rounded-3xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <IndianRupee size={16} className="text-indigo-900" />
        </div>
        {!collapsed && <span className="font-black text-white text-lg tracking-tight">FundIndia</span>}
        <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-indigo-400 hover:text-white ${collapsed ? "mx-auto" : ""}`}>
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.filter((i) => !i.admin || user?.role === "admin").map(({ id, label, icon: Icon, admin }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
              ${page === id ? "text-white" : "text-indigo-300 hover:bg-white/5 hover:text-white"}
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? label : ""}
          >
            {page === id && <span className="absolute left-2 h-8 w-1.5 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.8)]" />}
            <Icon size={18} className={admin ? "text-amber-400" : ""} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-indigo-800 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-indigo-400 text-xs truncate">{user?.email}</p>
            </div>
            <button onClick={onLogout} className="text-indigo-400 hover:text-red-400 transition-colors"><LogOut size={15} /></button>
          </div>
        ) : (
          <button onClick={onLogout} className="text-indigo-400 hover:text-red-400 mx-auto block"><LogOut size={18} /></button>
        )}
      </div>
    </aside>
  );
}

function Navbar({ search, setSearch, user, onCreateCampaign, sidebarWidth }) {
  const [showNotif, setShowNotif] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifs = [];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 right-0 flex items-center gap-4 px-6 py-3.5 z-20 transition-all ${scrolled ? "bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm" : "bg-transparent"}`}
      style={{ left: sidebarWidth }}
    >
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns…"
          className="w-full pl-9 pr-14 py-2.5 bg-white/70 border border-zinc-200/60 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-all shadow-inner"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 border border-zinc-200/70 rounded-md px-1.5 py-0.5 bg-white/70">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onCreateCampaign}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-indigo-200"
        >
          <PlusCircle size={15} /> Create
        </button>
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all">
            <Bell size={17} />
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute right-0 top-12 w-80 bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-zinc-200/60 flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">Notifications</p>
                </div>
                <div className="px-4 py-6 text-xs text-gray-400">No notifications yet</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </header>
  );
}

function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = tab === "register"
        ? await authApi.register(form)
        : await authApi.login({ email: form.email, password: form.password });
      onAuth(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <IndianRupee size={28} className="text-indigo-900" />
          </div>
          <h1 className="text-3xl font-black text-white">FundIndia</h1>
          <p className="text-indigo-300 mt-1 text-sm">India's Premier Crowdfunding Platform</p>
        </div>

        <div className="bg-white/85 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-4 text-sm font-bold capitalize transition-all ${tab === t ? "text-indigo-700 border-b-2 border-indigo-600" : "text-gray-400"}`}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Aryan Mehta" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <button onClick={submit} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-300 disabled:opacity-40">
              {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ campaigns, onCreateCampaign, setPage, setSelectedCampaign }) {
  const totalRaised = campaigns.reduce((a, c) => a + c.raisedAmount, 0);
  const active = campaigns.filter((c) => c.status === "active").length;
  const totalContribs = campaigns.reduce((a, c) => a + c.contributors, 0);

  return (
    <div>
      <div className="relative bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 rounded-3xl p-8 mb-8 overflow-hidden shadow-[0_30px_80px_-40px_rgba(79,70,229,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute right-10 -bottom-12 w-56 h-56 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-xl">
            <Zap size={11} className="text-amber-300" /> Crowdfunding Platform
          </span>
          <h1 className="text-3xl font-black text-white mb-2">Fund Ideas That Matter 🇮🇳</h1>
          <p className="text-indigo-200 text-sm mb-6 max-w-md">From villages to startups — power the projects that will shape tomorrow's India.</p>
          <div className="flex gap-3">
            <button onClick={onCreateCampaign} className="relative flex items-center gap-2 bg-amber-400 text-indigo-900 px-5 py-2.5 rounded-2xl font-bold hover:bg-amber-300 transition-all shadow-lg overflow-hidden">
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] translate-x-[-120%] hover:translate-x-[120%] transition-transform duration-700" />
              <PlusCircle size={16} /> Create Campaign
            </button>
            <button onClick={() => setPage("campaigns")} className="flex items-center gap-2 bg-white/15 text-white px-5 py-2.5 rounded-2xl font-semibold hover:bg-white/25 transition-all border border-white/20 backdrop-blur-xl">
              Explore <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div className="md:col-span-2"><StatCard icon={Rocket} label="Total Campaigns" value={campaigns.length} color="indigo" growth="+12%" /></div>
        <div className="md:col-span-2"><StatCard icon={IndianRupee} label="Total Raised" value={fmtCur(totalRaised)} color="amber" growth="+18%" /></div>
        <div className="md:col-span-1"><StatCard icon={Activity} label="Active" value={active} color="emerald" /></div>
        <div className="md:col-span-1"><StatCard icon={Users} label="Backers" value={fmt(totalContribs)} color="violet" /></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Featured Campaigns</h2>
        <button onClick={() => setPage("campaigns")} className="text-sm text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View all <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.filter((c) => c.status === "active").slice(0, 3).map((c) => (
          <CampaignCard key={c.id} campaign={c} onView={(cam) => { setSelectedCampaign(cam); setPage("campaign-detail"); }} />
        ))}
      </div>
    </div>
  );
}

function CampaignsPage({ campaigns, meta, loading, error, filters, setFilters, setPage, setSelectedCampaign }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Campaigns</h1>
          <p className="text-gray-500 text-sm mt-0.5">Discover and support amazing projects across India</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilters((p) => ({ ...p, view: "grid" }))} className={`p-2 rounded-lg transition-all ${filters.view === "grid" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}><Grid size={16} /></button>
          <button onClick={() => setFilters((p) => ({ ...p, view: "list" }))} className={`p-2 rounded-lg transition-all ${filters.view === "list" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}><List size={16} /></button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-4 mb-6 flex flex-wrap gap-4 items-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))} placeholder="Search campaigns…" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...CATEGORIES.slice(0, 5)].map((c) => (
            <button key={c} onClick={() => setFilters((p) => ({ ...p, category: c, page: 1 }))} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${filters.category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"}`}>{c}</button>
          ))}
        </div>
        <select value={filters.sort} onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))} className="text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
          <option value="newest">Newest first</option>
          <option value="most-funded">Most funded</option>
          <option value="ending-soon">Ending soon</option>
        </select>
        <span className="text-xs text-gray-400">{meta.total} results</span>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {error && <div className="text-center text-sm text-red-500 py-10">{error}</div>}

      {!loading && !error && (
        filters.view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} onView={(cam) => { setSelectedCampaign(cam); setPage("campaign-detail"); }} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => {
              const pct = progress(c.raisedAmount, c.targetAmount);
              return (
                <div key={c.id} onClick={() => { setSelectedCampaign(c); setPage("campaign-detail"); }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                    {isUrl(c.image) ? <img src={c.image} alt={c.title} className="w-full h-full object-cover" /> : <span>{c.image || "🎯"}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{c.category}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{c.title}</h3>
                    <ProgressBar value={pct} size="sm" />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{fmtCur(c.raisedAmount)}</p>
                    <p className="text-xs text-gray-400">{pct}% of {fmtCur(c.targetAmount)}</p>
                    <p className="text-xs text-gray-500 mt-1">{c.contributors} backers</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Rocket size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No campaigns found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}

      {!loading && !error && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
            disabled={meta.page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">Page {meta.page} of {meta.totalPages}</span>
          <button
            onClick={() => setFilters((p) => ({ ...p, page: Math.min(meta.totalPages, p.page + 1) }))}
            disabled={meta.page >= meta.totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
function CampaignDetailPage({ campaignId, user, onBack, onContribution }) {
  const [showPayment, setShowPayment] = useState(false);
  const [tab, setTab] = useState("overview");
  const [campaign, setCampaign] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setError("");
      try {
        const [campaignRes, contribRes] = await Promise.all([
          campaignApi.get(campaignId),
          campaignApi.contributions(campaignId)
        ]);
        setCampaign(normalizeCampaign(campaignRes.data.campaign));
        setContributors(contribRes.data.contributions || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId]);

  const handleSuccess = (amount, contribution) => {
    setCampaign((prev) => ({
      ...prev,
      raisedAmount: prev.raisedAmount + amount,
      contributors: prev.contributors + 1
    }));
    setContributors((prev) => [
      { ...contribution, userId: { name: user?.name || "You" } },
      ...prev
    ]);
    onContribution(amount, campaignId);
  };

  if (loading) return <div className="text-center text-sm text-gray-400 py-10">Loading campaign…</div>;
  if (error) return <div className="text-center text-sm text-red-500 py-10">{error}</div>;
  if (!campaign) return null;

  const pct = progress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);

  return (
    <>
      {showPayment && <FundModal campaign={campaign} user={user} onSuccess={handleSuccess} onClose={() => setShowPayment(false)} />}
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
          <ChevronRight size={16} className="rotate-180" /> Back to Campaigns
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden">
              {isUrl(campaign.image) ? (
                <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">{campaign.image || "🎯"}</span>
              )}
              <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full ${campaign.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {campaign.status === "completed" ? "✓ Fully Funded" : days > 0 ? "● Active" : "Ended"}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{campaign.category}</span>
              <h1 className="text-2xl font-black text-gray-900 mt-3 mb-2">{campaign.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">{(campaign.creator || 'U')[0]}</div>
                <span>by <strong className="text-gray-700">{campaign.creator}</strong></span>
                <span>·</span>
                <span>Created {Math.floor((Date.now() - new Date(campaign.createdAt)) / 86400000)} days ago</span>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex gap-0">
                {["overview", "contributors", "updates"].map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
                ))}
              </div>
            </div>

            {tab === "overview" && (
              <div className="space-y-5">
                <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="font-semibold text-gray-800 text-sm">{new Date(campaign.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Deadline</p>
                    <p className="font-semibold text-gray-800 text-sm">{new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-gray-800 text-sm">{campaign.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.tags.map((t) => <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "contributors" && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Recent Contributors</h3>
                {contributors.length === 0 ? (
                  <div className="text-sm text-gray-400">No contributions yet.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex -space-x-2">
                        {contributors.slice(0, 5).map((c) => (
                          <div key={c._id} className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                            {(c.userId?.name || "U")[0]}
                          </div>
                        ))}
                      </div>
                      {contributors.length > 5 && (
                        <span className="text-xs text-zinc-500">+{contributors.length - 5} more</span>
                      )}
                    </div>
                    {contributors.map((c) => (
                      <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(c.userId?.name || "U")[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{c.userId?.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <span className="font-bold text-gray-800">{fmtCur(c.amount)}</span>
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
                <p className="text-xs">The campaign creator hasn't posted any updates.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-5 shadow-[0_30px_80px_-50px_rgba(99,102,241,0.45)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified & Secure
                </span>
                {days <= 3 && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                    <Clock size={12} /> {days} days left
                  </span>
                )}
              </div>
              <div className="text-center mb-5">
                <p className="text-3xl font-black text-gray-900">{fmtCur(campaign.raisedAmount)}</p>
                <p className="text-sm text-gray-500">raised of <span className="font-semibold text-gray-700">{fmtCur(campaign.targetAmount)}</span> goal</p>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{pct}% funded</span></div>
                <ProgressBar value={pct} size="lg" />
              </div>
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="text-center bg-indigo-50 rounded-xl p-3">
                  <p className="text-xl font-black text-indigo-700">{campaign.contributors}</p>
                  <p className="text-xs text-indigo-500">Backers</p>
                </div>
                <div className="text-center bg-amber-50 rounded-xl p-3">
                  <p className="text-xl font-black text-amber-700">{days}</p>
                  <p className="text-xs text-amber-500">Days left</p>
                </div>
              </div>

              {campaign.status !== "completed" && days > 0 && (
                <button onClick={() => setShowPayment(true)} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md shadow-indigo-200 mb-3">
                  Fund this Campaign 🙏
                </button>
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
                <Lock size={11} className="inline mr-1" /> Secured by Razorpay · All transactions encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MyCampaignsPage({ campaigns, setPage, setSelectedCampaign, onWithdraw }) {
  const totalRaised = campaigns.reduce((a, c) => a + c.raisedAmount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Campaigns</h1>
          <p className="text-gray-500 text-sm mt-0.5">Campaigns you've created and are managing</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Rocket} label="Total Campaigns" value={campaigns.length} color="indigo" />
        <StatCard icon={IndianRupee} label="Total Raised" value={fmtCur(totalRaised)} color="amber" />
        <StatCard icon={Activity} label="Active" value={campaigns.filter((c) => c.status === "active").length} color="emerald" />
        <StatCard icon={CheckCircle} label="Completed" value={campaigns.filter((c) => c.status === "completed").length} color="violet" />
      </div>

      <div className="space-y-4">
        {campaigns.map((c) => {
          const pct = progress(c.raisedAmount, c.targetAmount);
          const days = daysLeft(c.deadline);
          const canWithdraw = days === 0 || c.status === "completed";
          return (
            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                  {isUrl(c.image) ? <img src={c.image} alt={c.title} className="w-full h-full object-cover" /> : <span>{c.image || "🎯"}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">{c.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-gray-800">{fmtCur(c.raisedAmount)} <span className="text-gray-400 font-normal">/ {fmtCur(c.targetAmount)}</span></span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600">{c.contributors} backers</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600">{days > 0 ? `${days} days left` : "Ended"}</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={pct} /></div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => { setSelectedCampaign(c); setPage("campaign-detail"); }} className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition-all"><Eye size={13} /> View</button>
                  {canWithdraw ? (
                    <button onClick={() => onWithdraw(c)} className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-all"><Download size={13} /> Withdraw</button>
                  ) : (
                    <button className="flex items-center gap-1.5 text-xs bg-red-50 text-red-400 px-3 py-1.5 rounded-lg font-semibold cursor-not-allowed opacity-50"><Trash2 size={13} /> Delete</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContributionsPage({ campaigns, contributions }) {
  const total = contributions.reduce((a, c) => a + c.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Contributions</h1>
      <p className="text-gray-500 text-sm mb-6">Projects you've backed and supported</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard icon={HandCoins} label="Total Contributed" value={fmtCur(total)} color="amber" />
        <StatCard icon={Rocket} label="Campaigns Backed" value={contributions.length} color="indigo" />
      </div>

      {contributions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HandCoins size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No contributions yet</p>
          <p className="text-sm">Start backing campaigns to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((contrib) => {
            const camp = typeof contrib.campaignId === 'object' && contrib.campaignId ? contrib.campaignId : campaigns.find((c) => c.id === contrib.campaignId);
            return (
              <div key={contrib._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {isUrl(camp?.image) ? <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" /> : <span>{camp?.image || "🎯"}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{camp?.title || "Campaign"}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(contrib.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-gray-900">{fmtCur(contrib.amount)}</p>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Confirmed</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ user }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white text-center mb-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-3">{user?.name?.[0]}</div>
        <h1 className="text-2xl font-black">{user?.name}</h1>
        <p className="text-indigo-200 text-sm">{user?.email}</p>
        <span className="mt-2 inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">{user?.role === "admin" ? "Administrator" : "Supporter"}</span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Account Settings</h2>
        {[
          { label: "Full Name", value: user?.name },
          { label: "Email", value: user?.email },
          { label: "Role", value: user?.role }
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPanel({ stats, onWithdraw }) {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paused, setPaused] = useState(false);

  const totalRaised = stats?.totalRevenue || 0;
  const platformEarnings = stats?.platformEarnings || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-0.5">Full control over platform, campaigns & earnings</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${paused ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
          <div className={`w-2 h-2 rounded-full ${paused ? "bg-red-500" : "bg-emerald-500"}`} />
          Platform {paused ? "Paused" : "Active"}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={fmt(stats?.totalUsers || 0)} color="indigo" />
        <StatCard icon={Rocket} label="Total Campaigns" value={fmt(stats?.totalCampaigns || 0)} color="violet" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={fmtCur(totalRaised)} color="amber" />
        <StatCard icon={Award} label="Platform Earnings (5%)" value={fmtCur(platformEarnings)} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Wallet size={18} /></div>
            <div>
              <h2 className="font-bold text-gray-900">Fee Management</h2>
              <p className="text-xs text-gray-400">Withdraw accumulated platform earnings</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-amber-600">Available to withdraw</p>
            <p className="text-2xl font-black text-amber-700">{fmtCur(platformEarnings)}</p>
          </div>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">₹</span>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter withdraw amount" className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-400 outline-none" />
          </div>
          <button onClick={() => onWithdraw(Number(withdrawAmount))} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition-all">
            Withdraw Fees →
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Settings size={18} /></div>
            <div>
              <h2 className="font-bold text-gray-900">Platform Controls</h2>
              <p className="text-xs text-gray-400">Manage system-wide settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={() => setPaused(!paused)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${paused ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
              <span className="flex items-center gap-2">{paused ? <Play size={16} /> : <Pause size={16} />} {paused ? "Resume Platform" : "Pause Platform"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignMeta, setCampaignMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState("");
  const [contributions, setContributions] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [filters, setFilters] = useState({ search: "", category: "All", sort: "newest", page: 1, limit: 9, view: "grid" });
  const debouncedSearch = useDebounce(filters.search, 450);

  const sidebarWidth = collapsed ? 80 : 272;

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("fi_token");
      if (!token) {
        setAuthLoading(false);
        return;
      }
      setAuthToken(token);
      try {
        const { data } = await authApi.me();
        setUser(data.user);
      } catch (_err) {
        localStorage.removeItem("fi_token");
        setAuthToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setCampaignsLoading(true);
      setCampaignsError("");
      try {
        const { data } = await campaignApi.list({
          page: filters.page,
          limit: filters.limit,
          search: debouncedSearch,
          category: filters.category,
          sort: filters.sort
        });
        setCampaigns(data.campaigns.map(normalizeCampaign));
        setCampaignMeta({ page: data.page, totalPages: data.totalPages, total: data.total });
      } catch (err) {
        setCampaignsError(err.response?.data?.message || "Failed to load campaigns");
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchCampaigns();
  }, [filters.page, filters.limit, filters.category, filters.sort, debouncedSearch]);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const [contribRes, myCampRes] = await Promise.all([
          userApi.contributions(),
          userApi.campaigns()
        ]);
        setContributions(contribRes.data.contributions || []);
        setMyCampaigns((myCampRes.data.campaigns || []).map(normalizeCampaign));
      } catch (_err) {
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchStats = async () => {
      try {
        const { data } = await adminApi.stats();
        setAdminStats(data);
      } catch (_err) {
      }
    };
    fetchStats();
  }, [user]);

  const handleAuth = (userData, token) => {
    localStorage.setItem("fi_token", token);
    setAuthToken(token);
    setUser(userData);
    addToast(`Welcome, ${userData.name}!`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("fi_token");
    setAuthToken(null);
    setUser(null);
  };

  const handleContribution = async (amount, campaignId) => {
    setCampaigns((prev) => prev.map((c) => c.id === campaignId ? { ...c, raisedAmount: c.raisedAmount + amount, contributors: c.contributors + 1 } : c));
    setMyCampaigns((prev) => prev.map((c) => c.id === campaignId ? { ...c, raisedAmount: c.raisedAmount + amount, contributors: c.contributors + 1 } : c));
    try {
      const { data } = await userApi.contributions();
      setContributions(data.contributions || []);
    } catch (_err) {
    }
    addToast(`Successfully funded ${fmtCur(amount)}! Thank you 🙏`, "success");
  };

  const handleCreateCampaign = async (form) => {
    const optimisticId = `temp_${Date.now()}`;
    const optimisticCampaign = normalizeCampaign({
      id: optimisticId,
      title: form.title,
      description: form.description,
      category: form.category,
      targetAmount: Number(form.targetAmount),
      raisedAmount: 0,
      contributors: 0,
      deadline: new Date(Date.now() + Number(form.durationDays) * 86400000).toISOString(),
      image: form.image,
      status: "pending",
      creator: user?.name || "You",
      creatorEmail: user?.email || "",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    });

    setCampaigns((prev) => [optimisticCampaign, ...prev]);
    setMyCampaigns((prev) => [optimisticCampaign, ...prev]);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        targetAmount: Number(form.targetAmount),
        durationDays: Number(form.durationDays),
        image: form.image,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      };
      const { data } = await campaignApi.create(payload);
      const created = normalizeCampaign(data.campaign);
      setCampaigns((prev) => prev.map((c) => (c.id === optimisticId ? created : c)));
      setMyCampaigns((prev) => prev.map((c) => (c.id === optimisticId ? created : c)));
      addToast("Campaign submitted for review!", "success");
    } catch (err) {
      setCampaigns((prev) => prev.filter((c) => c.id !== optimisticId));
      setMyCampaigns((prev) => prev.filter((c) => c.id !== optimisticId));
      throw new Error(err.response?.data?.message || "Failed to create campaign");
    }
  };

  const handleWithdraw = async (amount) => {
    if (!amount || Number(amount) <= 0) return;
    try {
      const { data } = await adminApi.withdraw({ amount });
      addToast(`₹${fmt(data.withdrawn)} withdrawn successfully`, "success");
      const statsRes = await adminApi.stats();
      setAdminStats(statsRes.data);
    } catch (err) {
      addToast(err.response?.data?.message || "Withdrawal failed", "error");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (!user) return <AuthPage onAuth={handleAuth} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage campaigns={campaigns} setPage={setPage} setSelectedCampaign={setSelectedCampaign} onCreateCampaign={() => setShowCreate(true)} />;
      case "campaigns":
        return <CampaignsPage campaigns={campaigns} meta={campaignMeta} loading={campaignsLoading} error={campaignsError} filters={filters} setFilters={setFilters} setPage={setPage} setSelectedCampaign={setSelectedCampaign} />;
      case "campaign-detail":
        return selectedCampaign ? <CampaignDetailPage campaignId={selectedCampaign.id} user={user} onBack={() => setPage("campaigns")} onContribution={handleContribution} /> : null;
      case "my-campaigns":
        return <MyCampaignsPage campaigns={myCampaigns} setPage={setPage} setSelectedCampaign={setSelectedCampaign} onWithdraw={(c) => handleWithdraw(Math.round(c.raisedAmount * 0.95))} />;
      case "contributions":
        return <ContributionsPage campaigns={campaigns} contributions={contributions} />;
      case "profile":
        return <ProfilePage user={user} />;
      case "admin":
        return user.role === "admin" ? <AdminPanel stats={adminStats} onWithdraw={handleWithdraw} /> : <div className="text-center py-20 text-gray-400"><Lock size={40} className="mx-auto mb-3" /><p className="font-semibold">Admin access only</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
      </div>
      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onCreate={handleCreateCampaign} />}
      <Toast toasts={toasts} />
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar search={filters.search} setSearch={(v) => setFilters((p) => ({ ...p, search: v, page: 1 }))} user={user} onCreateCampaign={() => setShowCreate(true)} sidebarWidth={sidebarWidth} />
      <main className="transition-all duration-300 pt-20 min-h-screen" style={{ marginLeft: sidebarWidth }}>
        <div className="p-6 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div key={page} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: 10 }} className="min-h-[60vh]">
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
