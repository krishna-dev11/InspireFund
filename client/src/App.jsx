import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Rocket, PlusCircle, FolderHeart, HandCoins, ShieldCheck,
  User, Bell, Search, Menu, X, Users, IndianRupee, ChevronRight, Clock,
  CheckCircle, AlertCircle, LogOut, Eye, Edit, Trash2, Download,
  Image as ImageIcon, BarChart3, Star, Award, Zap, ArrowUpRight,
  Grid, List, Settings, Play, Pause, RefreshCw, Heart, Share2,
  MessageSquare, Wallet, Globe, Activity, Lock, Info, Upload,
  ChevronLeft, Tag, Loader2, CheckSquare, XCircle, FileText
} from "lucide-react";
import { authApi, campaignApi, paymentApi, userApi, adminApi, setAuthToken } from "./services/api";
import useDebounce from "./utils/useDebounce";

// ─── Utils (inline so nothing breaks if path differs) ─────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);
const fmtCur = (n) => `₹${fmt(n)}`;
const calcProgress = (raised, target) => {
  if (!target) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(target)) * 100));
};
const daysLeft = (deadline) => {
  const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
};
const getStatusColor = (status) => {
  const map = {
    active: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-600",
    ended: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

// ─── Load Razorpay script once ────────────────────────────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const CATEGORIES = ["Technology", "Social Impact", "Education", "Health", "Arts", "Environment", "Food", "Sports"];

// ─── Reusable UI components ───────────────────────────────────────────────────

function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-indigo-500" />;
}

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl pointer-events-auto
            ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-indigo-500"}`}
        >
          {t.type === "success" ? <CheckCircle size={16} /> : t.type === "error" ? <AlertCircle size={16} /> : <Info size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, size = "md" }) {
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div className={`w-full bg-gray-100 rounded-full ${h} overflow-hidden`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, growth, color = "indigo", loading = false }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {growth && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><ArrowUpRight size={12} />{growth}</span>}
      </div>
      {loading ? <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" /> : <p className="text-2xl font-bold text-gray-900">{value}</p>}
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function CampaignCard({ campaign, onView }) {
  const pct = calcProgress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
      onClick={() => onView(campaign)}
    >
      <div className="h-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <Rocket size={40} className="text-indigo-300" />
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status === "completed" ? "Funded" : campaign.status === "pending" ? "Pending" : days === 0 ? "Ended" : "Active"}
        </span>
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{campaign.category}</span>
        <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">{campaign.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{campaign.description}</p>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-800">{fmtCur(campaign.raisedAmount)}</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar value={pct} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Goal: {fmtCur(campaign.targetAmount)}</span>
            <span>{campaign.contributors?.length ?? 0} backers</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />{days > 0 ? `${days}d left` : "Ended"}
          </span>
          <button
            className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all"
            onClick={(e) => { e.stopPropagation(); onView(campaign); }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, addToast }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", adminSecret: "" });
  const [loading, setLoading] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      let res;
      if (tab === "login") {
        res = await authApi.login({ email: form.email, password: form.password });
      } else {
        const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
        if (form.role === "admin") payload.adminSecret = form.adminSecret;
        res = await authApi.register(payload);
      }
      const { user, token } = res.data;
      localStorage.setItem("fi_token", token);
      localStorage.setItem("fi_user", JSON.stringify(user));
      setAuthToken(token);
      onAuth(user);
      addToast(`Welcome${tab === "login" ? " back" : ""}, ${user.name}!`, "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Authentication failed", "error");
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
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-4 text-sm font-bold transition-all ${tab === t ? "text-indigo-700 border-b-2 border-indigo-600" : "text-gray-400"}`}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab === "register" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={(e) => u("name", e.target.value)} placeholder="Aryan Mehta" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role</label>
                  <select value={form.role} onChange={(e) => { u("role", e.target.value); setShowAdminSecret(e.target.value === "admin"); }} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                    <option value="user">User / Backer</option>
                    <option value="creator">Campaign Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {showAdminSecret && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Admin Secret Key</label>
                    <input type="password" value={form.adminSecret} onChange={(e) => u("adminSecret", e.target.value)} placeholder="Enter admin secret" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                )}
              </>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address *</label>
              <input value={form.email} onChange={(e) => u("email", e.target.value)} placeholder="you@example.com" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password *</label>
              <input type="password" value={form.password} onChange={(e) => u("password", e.target.value)} placeholder="••••••••" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-indigo-300 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size={18} /> : null}
              {tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
            <div className="text-center text-xs text-gray-400">— or —</div>
            <button className="w-full border-2 border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all opacity-60 cursor-not-allowed" title="Configure GOOGLE_CLIENT_ID in .env to enable">
              <Globe size={15} /> Continue with Google (configure in .env)
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-indigo-400 mt-4">Backend: <span className="text-amber-400 font-mono">{import.meta.env.VITE_API_URL || "http://localhost:5000"}</span></p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
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
    <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 flex flex-col z-30 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-indigo-800">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0"><IndianRupee size={16} className="text-indigo-900" /></div>
        {!collapsed && <span className="font-black text-white text-lg tracking-tight">FundIndia</span>}
        <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-indigo-400 hover:text-white ${collapsed ? "mx-auto" : ""}`}><Menu size={18} /></button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.filter((i) => !i.admin || user?.role === "admin").map(({ id, label, icon: Icon, admin }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
              ${page === id ? "bg-white/10 text-white border-r-2 border-amber-400" : "text-indigo-300 hover:bg-white/5 hover:text-white"}
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? label : ""}
          >
            <Icon size={18} className={admin ? "text-amber-400" : ""} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
      <div className="border-t border-indigo-800 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0] || "U"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-indigo-400 text-xs truncate">{user?.role}</p>
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ search, setSearch, onCreateCampaign, sidebarWidth, user }) {
  const [showNotif, setShowNotif] = useState(false);
  return (
    <header className="fixed top-0 right-0 bg-white border-b border-gray-100 flex items-center gap-4 px-6 py-3.5 z-20 transition-all" style={{ left: sidebarWidth }}>
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns…" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={onCreateCampaign} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-indigo-200">
          <PlusCircle size={15} /> Create
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </header>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ setPage, setSelectedCampaign, onCreateCampaign, addToast }) {
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [camRes] = await Promise.all([
          campaignApi.list({ limit: 3, sort: "newest" })
        ]);
        const campaigns = camRes.data.campaigns || [];
        setFeatured(campaigns);
        const total = campaigns.reduce((a, c) => a + c.raisedAmount, 0);
        setStats({
          totalCampaigns: camRes.data.total || campaigns.length,
          totalRaised: total,
          active: campaigns.filter((c) => c.status === "active").length,
          backers: campaigns.reduce((a, c) => a + (c.contributors?.length || 0), 0),
        });
      } catch (e) {
        addToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-8 mb-8 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Zap size={11} className="text-amber-300" /> India's #1 Crowdfunding Platform
          </span>
          <h1 className="text-3xl font-black text-white mb-2">Fund Ideas That Matter 🇮🇳</h1>
          <p className="text-indigo-200 text-sm mb-6 max-w-md">From villages to startups — power the projects that shape tomorrow's India.</p>
          <div className="flex gap-3">
            <button onClick={onCreateCampaign} className="flex items-center gap-2 bg-amber-400 text-indigo-900 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-300 transition-all shadow-lg">
              <PlusCircle size={16} /> Create Campaign
            </button>
            <button onClick={() => setPage("campaigns")} className="flex items-center gap-2 bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/25 transition-all border border-white/20">
              Explore <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Rocket} label="Total Campaigns" value={stats?.totalCampaigns ?? "—"} color="indigo" loading={loading} />
        <StatCard icon={IndianRupee} label="Total Raised" value={stats ? fmtCur(stats.totalRaised) : "—"} color="amber" loading={loading} />
        <StatCard icon={Activity} label="Active Campaigns" value={stats?.active ?? "—"} color="emerald" loading={loading} />
        <StatCard icon={Users} label="Total Backers" value={stats ? fmt(stats.backers) : "—"} color="violet" loading={loading} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Featured Campaigns</h2>
        <button onClick={() => setPage("campaigns")} className="text-sm text-indigo-600 font-semibold flex items-center gap-1">View all <ChevronRight size={15} /></button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : featured.length === 0 ? (
        <div className="text-center py-12 text-gray-400"><Rocket size={36} className="mx-auto mb-2 opacity-30" /><p>No active campaigns yet</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featured.map((c) => (
            <CampaignCard key={c._id} campaign={c} onView={(cam) => { setSelectedCampaign(cam); setPage("campaign-detail"); }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ALL CAMPAIGNS ────────────────────────────────────────────────────────────
function CampaignsPage({ setPage, setSelectedCampaign, globalSearch }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [localSearch, setLocalSearch] = useState(globalSearch || "");
  const [page, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const dSearch = useDebounce(localSearch, 400);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort };
      if (dSearch) params.search = dSearch;
      if (category !== "All") params.category = category;
      const { data } = await campaignApi.list(params);
      setCampaigns(data.campaigns || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      // silently fail — user sees empty state
    } finally {
      setLoading(false);
    }
  }, [page, dSearch, category, sort]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  useEffect(() => { setPageNum(1); }, [dSearch, category, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Campaigns</h1>
          <p className="text-gray-500 text-sm mt-0.5">Discover and support amazing projects · {total} campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}><Grid size={16} /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}><List size={16} /></button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search campaigns…" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...CATEGORIES.slice(0, 5)].map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"}`}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
          <option value="newest">Newest first</option>
          <option value="most-funded">Most funded</option>
          <option value="ending-soon">Ending soon</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={36} /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><Rocket size={40} className="mx-auto mb-3 opacity-30" /><p className="font-semibold">No campaigns found</p></div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c._id} campaign={c} onView={(cam) => { setSelectedCampaign(cam); setPage("campaign-detail"); }} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const pct = calcProgress(c.raisedAmount, c.targetAmount);
            return (
              <div key={c._id} onClick={() => { setSelectedCampaign(c); setPage("campaign-detail"); }} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={22} className="text-indigo-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{c.category}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(c.status)}`}>{c.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{c.title}</h3>
                  <ProgressBar value={pct} size="sm" />
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{fmtCur(c.raisedAmount)}</p>
                  <p className="text-xs text-gray-400">{pct}% of {fmtCur(c.targetAmount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPageNum((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"><ChevronLeft size={16} /></button>
          <span className="text-sm text-gray-600 font-medium">Page {page} of {totalPages}</span>
          <button onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
}

// ─── CAMPAIGN DETAIL + REAL RAZORPAY ─────────────────────────────────────────
function CampaignDetailPage({ campaign: initialCampaign, user, onBack, addToast }) {
  const [campaign, setCampaign] = useState(initialCampaign);
  const [contributors, setContributors] = useState([]);
  const [tab, setTab] = useState("overview");
  const [amount, setAmount] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const presets = [500, 1000, 2500, 5000];

  const pct = calcProgress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  const canFund = campaign.status === "active" && days > 0;

  useEffect(() => {
    loadRazorpay();
    if (tab === "contributors") {
      campaignApi.contributions(campaign._id).then(({ data }) => setContributors(data.contributions || [])).catch(() => {});
    }
  }, [tab, campaign._id]);

  const handleFund = async () => {
    if (!amount || Number(amount) <= 0) { addToast("Enter a valid amount", "error"); return; }
    setPayLoading(true);
    try {
      const { data } = await paymentApi.createOrder({ campaignId: campaign._id, amount: Number(amount) });
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
          try {
            await paymentApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setCampaign((prev) => ({
              ...prev,
              raisedAmount: prev.raisedAmount + Number(amount),
              contributors: [...(prev.contributors || []), user?.id],
            }));
            addToast(`Payment of ${fmtCur(Number(amount))} successful! 🙏`, "success");
            setAmount("");
            setSelectedPreset(null);
          } catch {
            addToast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: { ondismiss: () => { setPayLoading(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { addToast("Payment failed. Please try again.", "error"); setPayLoading(false); });
      rzp.open();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to initiate payment", "error");
      setPayLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Campaigns
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl h-64 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50">
            {campaign.image ? <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" /> : <Rocket size={56} className="text-indigo-200" />}
            <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status === "completed" ? "✓ Fully Funded" : campaign.status === "pending" ? "⏳ Pending Approval" : days > 0 ? "● Active" : "Ended"}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{campaign.category}</span>
            <h1 className="text-2xl font-black text-gray-900 mt-3 mb-2">{campaign.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">{campaign.creator?.name?.[0] || "C"}</div>
              <span>by <strong className="text-gray-700">{campaign.creator?.name || "Creator"}</strong></span>
              <span>·</span>
              <span>Created {Math.floor((Date.now() - new Date(campaign.createdAt)) / 86400000)} days ago</span>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <div className="flex">
              {["overview", "contributors", "updates"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
              ))}
            </div>
          </div>
          {tab === "overview" && (
            <div className="space-y-5">
              <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Deadline", value: new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
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
                      {campaign.tags.map((t) => <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>)}
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
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{c.userId?.name?.[0] || "U"}</div>
                      <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{c.userId?.name || "Anonymous"}</p><p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p></div>
                      <span className="font-bold text-gray-800">{fmtCur(c.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "updates" && (
            <div className="text-center py-10 text-gray-400"><MessageSquare size={32} className="mx-auto mb-2 opacity-30" /><p className="font-semibold text-sm">No updates yet</p></div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-indigo-50">
            <div className="text-center mb-5">
              <p className="text-3xl font-black text-gray-900">{fmtCur(campaign.raisedAmount)}</p>
              <p className="text-sm text-gray-500">raised of <span className="font-semibold text-gray-700">{fmtCur(campaign.targetAmount)}</span> goal</p>
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
                    <button key={p} onClick={() => { setSelectedPreset(p); setAmount(String(p)); }} className={`py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${selectedPreset === p ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}>₹{fmt(p)}</button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">₹</span>
                  <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }} placeholder="Custom amount" className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                </div>
                {amount && Number(amount) > 0 && (
                  <p className="text-xs text-amber-600">Actual contribution after 5% fee: {fmtCur(Math.round(Number(amount) * 0.95))}</p>
                )}
                <button
                  onClick={handleFund}
                  disabled={payLoading || !amount || Number(amount) <= 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {payLoading ? <Spinner size={16} /> : null}
                  {payLoading ? "Opening Razorpay…" : `Fund ${amount ? fmtCur(Number(amount)) : "this Campaign"} 🙏`}
                </button>
              </div>
            )}
            {!canFund && campaign.status !== "active" && (
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500 text-center mb-3">
                {campaign.status === "pending" ? "⏳ Awaiting admin approval" : campaign.status === "completed" ? "✓ Campaign fully funded" : "Campaign is not accepting funds"}
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"><Heart size={14} /> Save</button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"><Share2 size={14} /> Share</button>
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

// ─── CREATE CAMPAIGN ──────────────────────────────────────────────────────────
function CreateCampaignModal({ onClose, onCreated, addToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", description: "", targetAmount: "", category: "Technology", tags: "", durationDays: "30", additionalInfo: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { addToast("Please select an image file", "error"); return; }
    if (file.size > 10 * 1024 * 1024) { addToast("Image must be under 10MB", "error"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.targetAmount) { addToast("Please fill all required fields", "error"); return; }
    if (Number(form.targetAmount) <= 0) { addToast("Target amount must be greater than 0", "error"); return; }

    setLoading(true);
    setStep(2);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("targetAmount", form.targetAmount);
      fd.append("category", form.category);
      fd.append("durationDays", form.durationDays);
      if (form.tags) {
        form.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append("tags[]", t));
      }
      if (imageFile) fd.append("image", imageFile);

      await campaignApi.create(fd);
      setStep(3);
      addToast("Campaign submitted for admin review!", "success");
      setTimeout(() => { onCreated(); onClose(); }, 2500);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create campaign", "error");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <p className="text-white/70 text-sm mt-0.5">Launch your idea and start raising funds</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={22} /></button>
          </div>
          <div className="flex gap-2 mt-5">
            {[1, 2, 3].map((s) => <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-white" : "bg-white/30"}`} />)}
          </div>
        </div>

        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex gap-2 text-sm text-indigo-700">
              <Info size={16} className="shrink-0 mt-0.5" />
              Campaigns need admin approval before going live. Platform fee: 5% on raised amount.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Title *</label>
                <input value={form.title} onChange={(e) => u("title", e.target.value)} placeholder="Give your campaign a compelling title" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => u("description", e.target.value)} rows={3} placeholder="Tell your story — what problem are you solving?" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Target Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.targetAmount} onChange={(e) => u("targetAmount", e.target.value)} placeholder="500000" className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Duration (days)</label>
                <select value={form.durationDays} onChange={(e) => u("durationDays", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                  {[15, 30, 45, 60, 90].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
                <select value={form.category} onChange={(e) => u("category", e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => u("tags", e.target.value)} placeholder="startup, tech, green" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Image (uploads to Cloudinary)</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-all cursor-pointer
                  ${dragOver ? "border-indigo-500 bg-indigo-50" : imagePreview ? "border-emerald-400 bg-emerald-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
              >
                {imagePreview ? (
                  <><img src={imagePreview} alt="preview" className="h-20 w-auto rounded-lg object-cover" /><p className="text-sm text-emerald-700 font-medium">Image ready · {imageFile?.name}</p></>
                ) : (
                  <><ImageIcon size={28} className="text-gray-400" /><p className="text-sm text-gray-500">Drag & drop or <span className="text-indigo-600 font-semibold">click to upload</span></p><p className="text-xs text-gray-400">PNG, JPG up to 10MB</p></>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
            <button onClick={handleSubmit} disabled={!form.title || !form.description || !form.targetAmount} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
              Launch Campaign →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-16 flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Rocket size={24} className="text-indigo-600" /></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Submitting Campaign</h3>
            <div className="space-y-2 w-full max-w-xs">
              {["Uploading image to Cloudinary…", "Saving campaign to MongoDB…", "Notifying admin for review…"].map((msg, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-emerald-500" />{msg}</div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle size={40} className="text-emerald-500" /></div>
            <h3 className="text-xl font-bold text-gray-900">Campaign Submitted!</h3>
            <p className="text-gray-500 text-sm text-center">Your campaign is pending admin review. You'll see it in "My Campaigns" once approved.</p>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">⏳ Pending Review · Est. 24 hrs</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MY CAMPAIGNS ─────────────────────────────────────────────────────────────
function MyCampaignsPage({ user, setPage, setSelectedCampaign, addToast }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userApi.campaigns();
      setCampaigns(data.campaigns || []);
    } catch { addToast("Failed to load your campaigns", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await campaignApi.delete(id);
      setCampaigns((p) => p.filter((c) => c._id !== id));
      addToast("Campaign deleted", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Cannot delete campaign", "error");
    }
  };

  const totalRaised = campaigns.reduce((a, c) => a + c.raisedAmount, 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Campaigns</h1>
      <p className="text-gray-500 text-sm mb-6">Campaigns you've created</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Rocket} label="Total Created" value={campaigns.length} color="indigo" />
        <StatCard icon={IndianRupee} label="Total Raised" value={fmtCur(totalRaised)} color="amber" />
        <StatCard icon={Activity} label="Active" value={campaigns.filter((c) => c.status === "active").length} color="emerald" />
        <StatCard icon={CheckCircle} label="Completed" value={campaigns.filter((c) => c.status === "completed").length} color="violet" />
      </div>
      {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div> : campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><FolderHeart size={40} className="mx-auto mb-3 opacity-30" /><p className="font-semibold">No campaigns yet</p><p className="text-sm">Create your first campaign!</p></div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const pct = calcProgress(c.raisedAmount, c.targetAmount);
            const days = daysLeft(c.deadline);
            const canWithdraw = days === 0 || c.status === "completed";
            return (
              <div key={c._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={22} className="text-indigo-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900">{c.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-bold text-gray-800">{fmtCur(c.raisedAmount)} <span className="text-gray-400 font-normal">/ {fmtCur(c.targetAmount)}</span></span>
                      <span>·</span><span>{c.contributors?.length ?? 0} backers</span>
                      <span>·</span><span>{days > 0 ? `${days} days left` : "Ended"}</span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => { setSelectedCampaign(c); setPage("campaign-detail"); }} className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition-all"><Eye size={13} /> View</button>
                    {canWithdraw ? (
                      <button onClick={() => addToast(`Withdrawal of ${fmtCur(Math.round(c.raisedAmount * 0.95))} initiated! (Backend payout needed)`, "success")} className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-all"><Download size={13} /> Withdraw</button>
                    ) : (
                      <button onClick={() => handleDelete(c._id)} className="flex items-center gap-1.5 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-all"><Trash2 size={13} /> Delete</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MY CONTRIBUTIONS ─────────────────────────────────────────────────────────
function ContributionsPage({ addToast }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.contributions()
      .then(({ data }) => setContributions(data.contributions || []))
      .catch(() => addToast("Failed to load contributions", "error"))
      .finally(() => setLoading(false));
  }, []);

  const total = contributions.reduce((a, c) => a + c.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Contributions</h1>
      <p className="text-gray-500 text-sm mb-6">Projects you've backed with real Razorpay payments</p>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard icon={HandCoins} label="Total Contributed" value={fmtCur(total)} color="amber" />
        <StatCard icon={Rocket} label="Campaigns Backed" value={contributions.length} color="indigo" />
      </div>
      {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div> : contributions.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><HandCoins size={40} className="mx-auto mb-3 opacity-30" /><p className="font-semibold">No contributions yet</p><p className="text-sm">Back a campaign to see it here</p></div>
      ) : (
        <div className="space-y-4">
          {contributions.map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {c.campaignId?.image ? <img src={c.campaignId.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={18} className="text-indigo-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{c.campaignId?.title || "Campaign"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                {c.paymentId && <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {c.paymentId}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-gray-900">{fmtCur(c.amount)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === "paid" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, addToast }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([userApi.campaigns(), userApi.contributions()]).then(([camps, contribs]) => {
      const cList = camps.data.campaigns || [];
      const conList = contribs.data.contributions || [];
      setStats({
        campaigns: cList.length,
        backed: conList.length,
        raised: cList.reduce((a, c) => a + c.raisedAmount, 0),
        contributed: conList.reduce((a, c) => a + c.amount, 0),
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white text-center mb-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-3">{user?.name?.[0]}</div>
        <h1 className="text-2xl font-black">{user?.name}</h1>
        <p className="text-indigo-200 text-sm">{user?.email}</p>
        <span className="mt-2 inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">{user?.role === "admin" ? "👑 Admin" : user?.role === "creator" ? "🚀 Creator" : "🙏 Supporter"}</span>
      </div>
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={Rocket} label="Campaigns Created" value={stats.campaigns} color="indigo" />
          <StatCard icon={IndianRupee} label="Total Raised" value={fmtCur(stats.raised)} color="amber" />
          <StatCard icon={HandCoins} label="Total Contributed" value={fmtCur(stats.contributed)} color="violet" />
          <StatCard icon={Star} label="Campaigns Backed" value={stats.backed} color="emerald" />
        </div>
      )}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="font-bold text-gray-900 mb-4">Account Info</h2>
        {[
          { label: "Full Name", value: user?.name },
          { label: "Email", value: user?.email },
          { label: "Role", value: user?.role },
          { label: "User ID", value: user?.id },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-800 font-mono text-xs">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ addToast }) {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paused, setPaused] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([adminApi.stats(), adminApi.pending()]);
      setStats(sRes.data);
      setPending(pRes.data.campaigns || []);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    try {
      await adminApi.withdraw({ amount: Number(withdrawAmount) });
      addToast(`₹${fmt(Number(withdrawAmount))} platform earnings withdrawn!`, "success");
      setWithdrawAmount("");
      load();
    } catch (err) {
      addToast(err.response?.data?.message || "Withdrawal failed", "error");
    }
  };

  const handleApprove = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    try {
      await adminApi.approve(id);
      setPending((p) => p.filter((c) => c._id !== id));
      addToast("Campaign approved and now live!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to approve", "error");
    } finally {
      setActionLoading((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const handleReject = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: "reject" }));
    try {
      await adminApi.reject(id);
      setPending((p) => p.filter((c) => c._id !== id));
      addToast("Campaign rejected", "info");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to reject", "error");
    } finally {
      setActionLoading((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const platformEarnings = stats ? Math.round(stats.totalRevenue * 0.05) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-0.5">Full platform control · Live data from MongoDB</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${paused ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
          <div className={`w-2 h-2 rounded-full ${paused ? "bg-red-500" : "bg-emerald-500"}`} />
          Platform {paused ? "Paused" : "Active"}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={fmt(stats?.totalUsers ?? 0)} color="indigo" />
            <StatCard icon={Rocket} label="Total Campaigns" value={stats?.totalCampaigns ?? 0} color="violet" />
            <StatCard icon={IndianRupee} label="Total Revenue" value={fmtCur(stats?.totalRevenue ?? 0)} color="amber" />
            <StatCard icon={Award} label="Platform Earnings (5%)" value={fmtCur(stats?.platformEarnings ?? platformEarnings)} color="emerald" />
          </div>

          {/* Pending Campaigns */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><FileText size={18} /></div>
              <div>
                <h2 className="font-bold text-gray-900">Pending Approvals</h2>
                <p className="text-xs text-gray-400">{pending.length} campaign{pending.length !== 1 ? "s" : ""} awaiting review</p>
              </div>
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm"><CheckCircle size={28} className="mx-auto mb-2 opacity-30" /><p>All caught up! No pending campaigns.</p></div>
            ) : (
              <div className="space-y-3">
                {pending.map((c) => (
                  <div key={c._id} className="border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:bg-gray-50 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={18} className="text-indigo-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{c.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">by {c.creator?.name} · {c.category} · Goal: {fmtCur(c.targetAmount)}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 disabled:opacity-50 transition-all"
                      >
                        {actionLoading[c._id] === "approve" ? <Spinner size={12} /> : <CheckSquare size={12} />} Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50 transition-all"
                      >
                        {actionLoading[c._id] === "reject" ? <Spinner size={12} /> : <XCircle size={12} />} Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Fee Management */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Wallet size={18} /></div>
                <div><h2 className="font-bold text-gray-900">Fee Management</h2><p className="text-xs text-gray-400">Withdraw accumulated platform earnings</p></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-amber-600">Available to withdraw (5% commission)</p>
                <p className="text-2xl font-black text-amber-700">{fmtCur(stats?.platformEarnings ?? platformEarnings)}</p>
              </div>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">₹</span>
                <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter withdraw amount" className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-400 outline-none" />
              </div>
              <button onClick={handleWithdraw} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition-all">Withdraw Fees →</button>
            </div>

            {/* Platform Controls */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Settings size={18} /></div>
                <div><h2 className="font-bold text-gray-900">Platform Controls</h2><p className="text-xs text-gray-400">System-wide management</p></div>
              </div>
              <div className="space-y-3">
                <button onClick={() => { setPaused(!paused); addToast(`Platform ${!paused ? "paused" : "resumed"}`, paused ? "success" : "info"); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${paused ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
                  <span className="flex items-center gap-2">{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? "Resume Platform" : "Pause Platform"}</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => addToast("Emergency action logged", "error")} className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  <span className="flex items-center gap-2"><AlertCircle size={16} /> Emergency Withdraw</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={load} className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all">
                  <span className="flex items-center gap-2"><RefreshCw size={16} /> Refresh Stats</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-6 text-white">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Activity size={16} /> System Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Backend", value: "Node.js + Express" },
                { label: "Database", value: "MongoDB Atlas" },
                { label: "Payments", value: "Razorpay (INR)" },
                { label: "Storage", value: "Cloudinary" },
                { label: "Auth", value: "JWT + bcrypt" },
                { label: "Platform Fee", value: "5% per transaction" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-indigo-300 text-xs">{label}</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
                  <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /><span className="text-emerald-400 text-xs">online</span></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 240;

  // Restore auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("fi_token");
    const saved = localStorage.getItem("fi_user");
    if (token && saved) {
      try {
        setAuthToken(token);
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("fi_token");
        localStorage.removeItem("fi_user");
      }
    }
    setAuthChecked(true);
    loadRazorpay(); // preload Razorpay script
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fi_token");
    localStorage.removeItem("fi_user");
    setAuthToken(null);
    setUser(null);
    setPage("dashboard");
  };

  const handleSetPage = (p) => {
    setPage(p);
    if (p !== "campaign-detail") setSelectedCampaign(null);
  };

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center"><IndianRupee size={24} className="text-indigo-900" /></div>
        <Spinner size={28} />
      </div>
    </div>
  );

  if (!user) return <AuthPage onAuth={setUser} addToast={addToast} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage setPage={handleSetPage} setSelectedCampaign={setSelectedCampaign} onCreateCampaign={() => setShowCreate(true)} addToast={addToast} />;
      case "campaigns":
        return <CampaignsPage setPage={handleSetPage} setSelectedCampaign={setSelectedCampaign} globalSearch={search} />;
      case "campaign-detail":
        return selectedCampaign
          ? <CampaignDetailPage campaign={selectedCampaign} user={user} onBack={() => handleSetPage("campaigns")} addToast={addToast} />
          : <div className="text-center py-20 text-gray-400"><p>No campaign selected</p></div>;
      case "my-campaigns":
        return <MyCampaignsPage user={user} setPage={handleSetPage} setSelectedCampaign={setSelectedCampaign} addToast={addToast} />;
      case "contributions":
        return <ContributionsPage addToast={addToast} />;
      case "profile":
        return <ProfilePage user={user} addToast={addToast} />;
      case "admin":
        return user.role === "admin"
          ? <AdminPanel addToast={addToast} />
          : <div className="text-center py-20 text-gray-400"><Lock size={40} className="mx-auto mb-3 opacity-30" /><p className="font-semibold">Admin access only</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showCreate && (
        <CreateCampaignModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { if (page === "my-campaigns") handleSetPage("my-campaigns"); }}
          addToast={addToast}
        />
      )}
      <Toast toasts={toasts} />
      <Sidebar page={page} setPage={handleSetPage} user={user} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar search={search} setSearch={setSearch} user={user} onCreateCampaign={() => setShowCreate(true)} sidebarWidth={sidebarWidth} />
      <main className="transition-all duration-300 pt-16 min-h-screen" style={{ marginLeft: sidebarWidth }}>
        <div className="p-6 max-w-7xl">{renderPage()}</div>
      </main>
    </div>
  );
}