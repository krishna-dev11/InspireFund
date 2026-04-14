import { useSelector } from "react-redux";
import { Lock } from "lucide-react";
import AdminPanel from "../Components/Core/Dashboard/RightPart/AdminPanel";

function Admin() {
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-20 text-gray-400">
        <Lock size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Admin access only</p>
      </div>
    );
  }

  return <AdminPanel />;
}

export default Admin;
