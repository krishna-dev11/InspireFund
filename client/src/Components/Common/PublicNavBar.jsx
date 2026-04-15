import React, { useState } from "react";
import { Link, matchPath, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiDashboard2Line } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { NavbarLinks } from "../../data/navbar-links";
import { logout } from "../../Services/Operations/authAPI";
import ThemeToggle from "./ThemeToggle";

const SERVICE_ITEMS = [
  { label: "Start Campaign", path: "/dashboard/create" },
  { label: "Explore Campaigns", path: "/dashboard/campaigns" },
  { label: "Success Stories", path: "/#testimonials" },
  { label: "Funding Guide", path: "/#features" },
];

const PublicNavBar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);

  function mathroute(route) {
    if (!route) return false;
    return matchPath({ path: route }, location.pathname);
  }

  const avatarInitial = user?.name?.[0] || "U";
  const avatarSrc = user?.imageUrl || user?.avatar || user?.photoURL || "";

  return (
    <div className="w-full h-[72px] fixed z-[1000] transition-all duration-300 border-app">
      <div className="flex justify-between items-center w-11/12 mx-auto h-full px-4 md:px-10">
        {/* LOGO */}
        <Link onClick={() => setIsMenuOpen(false)} to={"/"}>
          <div className="flex items-center -translate-x-6 gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#F97316]/10 flex items-center justify-center border border-[#F97316]/30 shadow-[0_0_20px_rgba(249,115,22,0.2)] shrink-0 transition-all duration-500 group-hover:border-[#F97316]/60 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              <span className="text-[#F97316] font-black text-2xl drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                F
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-black dark:text-white">
                  Inspire<span className="text-[#F97316]">fund</span>
                </span>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400 mt-1 group-hover:text-[#FFD700] transition-colors duration-500">
                Crowdfunding
              </span>
            </div>
          </div>
        </Link>

        {/* MIDDLE LINKS (Desktop) */}
        <ul className="hidden lg:flex gap-x-8 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl px-12 py-2.5 rounded-2xl">
          {NavbarLinks.map((link, index) => (
            <li key={index} className="relative group">
              {link?.title === "Services" ? (
                <div className="flex gap-x-1 items-center cursor-pointer text-black dark:text-white hover:text-[#F97316] transition-all">
                  <p className="text-sm font-medium">{link.title}</p>
                  <MdKeyboardArrowDown />
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-56 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 shadow-2xl z-50">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#0a0a0a] border-t border-l border-black/10 dark:border-white/10 rotate-45" />
                    {SERVICE_ITEMS.map((item, i) => (
                      <Link
                        key={i}
                        to={item.path}
                        className="block p-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-[#F97316] hover:bg-black/5 dark:bg-white/5 rounded-xl transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={link?.path}
                  className={`text-sm font-medium transition-all ${
                    mathroute(link?.path)
                      ? "text-[#F97316]"
                      : "text-black dark:text-white hover:text-[#F97316]"
                  }`}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-x-3 md:gap-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-x-4">
            {token === null ? (
              <>
                <Link
                  to="/login"
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black/10 dark:bg-white/10 transition-all flex items-center gap-2"
                >
                  <CiLogin size={18} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#F97316] text-black px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    className="h-9 w-9 rounded-full border border-[#F97316] cursor-pointer object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full border border-[#F97316] cursor-pointer flex items-center justify-center text-xs font-bold text-black dark:text-white bg-black/5 dark:bg-white/5">
                    {avatarInitial}
                  </div>
                )}
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 shadow-2xl z-50">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-400 hover:text-black dark:text-white hover:bg-black/5 dark:bg-white/5 rounded-xl transition-all"
                  >
                    <RiDashboard2Line size={18} /> Dashboard
                  </button>
                  <button
                    onClick={() => dispatch(logout(navigate))}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold uppercase text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all"
                  >
                    <IoLogOutOutline size={18} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-black dark:text-white p-2 hover:bg-black/10 dark:bg-white/10 rounded-lg transition-all"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-md z-[999] lg:hidden transition-all duration-500 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-[#050505] border-l border-black/10 dark:border-white/10 p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {token && (
            <div className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 mb-6">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  className="h-10 w-10 rounded-full border border-[#F97316] object-cover"
                  alt="User"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border border-[#F97316] flex items-center justify-center text-xs font-bold text-black dark:text-white bg-black/5 dark:bg-white/5">
                  {avatarInitial}
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-bold text-black dark:text-white truncate w-32">
                  {user?.name || "User"}
                </p>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[10px] text-[#F97316] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  <RiDashboard2Line size={12} /> Dashboard Entry
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-y-2 flex-1 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4b5563] mb-4">
              Navigation Node
            </p>
            {NavbarLinks.map((link, i) => (
              <div key={i} className="flex flex-col border-b border-black/10 dark:border-white/10 pb-2">
                {link.title === "Services" ? (
                  <>
                    <button
                      onClick={() => setIsMobileCatalogOpen(!isMobileCatalogOpen)}
                      className="flex items-center justify-between text-xl font-bold tracking-tighter text-black dark:text-white w-full py-2 transition-colors hover:text-[#F97316]"
                    >
                      {link.title}
                      <FiChevronDown
                        className={`transition-transform duration-300 ${
                          isMobileCatalogOpen ? "rotate-180 text-[#F97316]" : "text-gray-500"
                        }`}
                      />
                    </button>
                    {isMobileCatalogOpen && (
                      <div className="pl-4 flex flex-col gap-4 mt-3 mb-3 border-l border-black/10 dark:border-white/10 animate-fadeDown">
                        {SERVICE_ITEMS.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 text-[0.7rem] hover:text-[#F97316]"
                          >
                            * {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-xl font-bold tracking-tighter py-3 transition-colors ${
                      mathroute(link.path)
                        ? "text-[#F97316]"
                        : "text-black dark:text-white hover:text-[#F97316]"
                    }`}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
            {token && (
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`text-xl font-bold tracking-tighter flex items-center gap-3 ${
                  mathroute("/dashboard") ? "text-[#F97316]" : "text-black dark:text-white"
                }`}
              >
                <RiDashboard2Line className="text-[#F97316]" size={22} /> Dashboard
              </Link>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-black/10 dark:border-white/10">
            {token === null ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 text-center bg-black/5 dark:bg-white/5 rounded-2xl text-black dark:text-white font-bold uppercase tracking-widest text-xs border border-black/10 dark:border-white/10"
                >
                  Login Node
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 text-center bg-[#F97316] rounded-2xl text-black font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                >
                  Initialize Access
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  dispatch(logout(navigate));
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 bg-[#ef4444]/10 text-[#ef4444] rounded-2xl font-bold uppercase tracking-widest text-xs border border-red-500/20 flex items-center justify-center gap-2"
              >
                <IoLogOutOutline /> Logout Terminal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavBar;





