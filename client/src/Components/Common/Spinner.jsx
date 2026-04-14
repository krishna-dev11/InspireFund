import { Loader2 } from "lucide-react";

function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-indigo-500" />;
}

export default Spinner;
