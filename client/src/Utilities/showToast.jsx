import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const iconFor = (type) => {
  if (type === "success") return <CheckCircle size={16} />;
  if (type === "error") return <AlertCircle size={16} />;
  return <Info size={16} />;
};

const classFor = (type) => {
  if (type === "success") return "bg-emerald-500";
  if (type === "error") return "bg-red-500";
  return "bg-indigo-500";
};

const showToast = (message, type = "info") =>
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl pointer-events-auto ${classFor(
          type
        )}`}
      >
        {iconFor(type)}
        {message}
      </div>
    ),
    { duration: 4500, position: "bottom-right" }
  );

export default showToast;
