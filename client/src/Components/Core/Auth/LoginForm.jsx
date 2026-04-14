import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Globe, IndianRupee } from "lucide-react";
import Spinner from "../../Common/Spinner";
import { login, signup } from "../../../Services/Operations/authAPI";

function LoginForm({ defaultTab = "login" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(defaultTab);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  const { watch, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      adminSecret: "",
    },
  });

  const form = watch();
  const u = (k, v) => setValue(k, v, { shouldDirty: true });

  const submit = () => {
    if (tab === "login") {
      dispatch(login(form.email, form.password, navigate));
      return;
    }
    const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
    if (form.role === "admin") payload.adminSecret = form.adminSecret;
    dispatch(signup(payload, navigate));
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
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-bold transition-all ${tab === t ? "text-indigo-700 border-b-2 border-indigo-600" : "text-gray-400"}`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab === "register" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => u("name", e.target.value)}
                    placeholder="Aryan Mehta"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => {
                      u("role", e.target.value);
                      setShowAdminSecret(e.target.value === "admin");
                    }}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="user">User / Backer</option>
                    <option value="creator">Campaign Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {showAdminSecret && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Admin Secret Key</label>
                    <input
                      type="password"
                      value={form.adminSecret}
                      onChange={(e) => u("adminSecret", e.target.value)}
                      placeholder="Enter admin secret"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address *</label>
              <input
                value={form.email}
                onChange={(e) => u("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => u("password", e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-indigo-300 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size={18} /> : null}
              {tab === "login" ? "Sign In ?" : "Create Account ?"}
            </button>
            <div className="text-center text-xs text-gray-400">— or —</div>
            <button
              className="w-full border-2 border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all opacity-60 cursor-not-allowed"
              title="Configure GOOGLE_CLIENT_ID in .env to enable"
            >
              <Globe size={15} /> Continue with Google (configure in .env)
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-indigo-400 mt-4">
          Backend: <span className="text-amber-400 font-mono">{import.meta.env.VITE_API_URL || "http://localhost:5000"}</span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
