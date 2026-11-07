"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative size-11 rounded-lg border-border bg-background text-foreground hover:bg-muted focus-visible:ring-ring"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Moon className="size-5 text-accent" />
        ) : (
          <Sun className="size-5 text-accent" />
        )
      ) : (
        <span className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
