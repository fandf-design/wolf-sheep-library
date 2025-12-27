import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 text-ui text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-accent/30 bg-card/50"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <>
          <Moon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
};
