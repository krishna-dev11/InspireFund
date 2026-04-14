import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-xl flex items-center justify-center border border-app bg-black/5 dark:bg-white/5 hover:bg-[#F97316]/15 transition-all ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;
