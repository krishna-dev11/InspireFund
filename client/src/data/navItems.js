import { LayoutDashboard, Rocket, FolderHeart, HandCoins, ShieldCheck, User } from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "All Campaigns", icon: Rocket },
  { id: "my-campaigns", label: "My Campaigns", icon: FolderHeart },
  { id: "contributions", label: "My Contributions", icon: HandCoins },
  { id: "profile", label: "Profile", icon: User },
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, admin: true },
];
