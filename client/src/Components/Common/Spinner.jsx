import { Loader2 } from "lucide-react";

function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-[#F97316]" />;
}

export default Spinner;
