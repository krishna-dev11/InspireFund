import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { Shield, Sparkles } from "lucide-react";
import Spinner from "../../Common/Spinner";
import { login, signup, googleLogin } from "../../../Services/Operations/authAPI";
import showToast from "../../../Utilities/showToast";

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

  const handleGoogle = (credential) => {
    const payload = { credential };
    if (tab === "register") payload.role = form.role;
    dispatch(googleLogin(payload, navigate));
  };

  const hasGoogle = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#F97316]/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-app">
            <Sparkles size={22} className="text-[#F97316]" />
          </div>
          <h1 className="text-3xl font-black text-app">Inspirefund</h1>
          <p className="text-muted mt-1 text-sm">India's premium crowdfunding platform</p>
        </div>
        <div className="app-card overflow-hidden">
          <div className="flex border-b border-app">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-bold transition-all ${
                  tab === t ? "text-[#F97316] border-b-2 border-[#F97316]" : "text-muted"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab === "register" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-app mb-1.5 block">Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => u("name", e.target.value)}
                    placeholder="Aryan Mehta"
                    className="w-full px-4 py-2.5 input-base text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-app mb-1.5 block">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => {
                      u("role", e.target.value);
                      setShowAdminSecret(e.target.value === "admin");
                    }}
                    className="w-full px-4 py-2.5 input-base text-sm bg-surface-2"
                  >
                    <option value="user">User / Backer</option>
                    <option value="creator">Campaign Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {showAdminSecret && (
                  <div>
                    <label className="text-sm font-semibold text-app mb-1.5 block">Admin Secret Key</label>
                    <input
                      type="password"
                      value={form.adminSecret}
                      onChange={(e) => u("adminSecret", e.target.value)}
                      placeholder="Enter admin secret"
                      className="w-full px-4 py-2.5 input-base text-sm"
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <label className="text-sm font-semibold text-app mb-1.5 block">Email Address *</label>
              <input
                value={form.email}
                onChange={(e) => u("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 input-base text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-app mb-1.5 block">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => u("password", e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2.5 input-base text-sm"
              />
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full btn-primary py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size={18} /> : null}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>

            <div className="text-center text-xs text-muted">or</div>
            {hasGoogle ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse?.credential) handleGoogle(credentialResponse.credential);
                  }}
                  onError={() => showToast("Google sign-in failed", "error")}
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            ) : (
              <button
                className="w-full border border-app rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold text-muted opacity-60 cursor-not-allowed"
                title="Configure VITE_GOOGLE_CLIENT_ID in .env to enable"
              >
                <Shield size={15} /> Continue with Google (configure in .env)
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          Backend: <span className="text-[#F97316] font-mono">{import.meta.env.VITE_API_URL || "http://localhost:5000"}</span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
