"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { useMetaColor } from "@/hooks/use-meta-color";
import { Button } from "@/components/ui/button";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor, metaColor } = useMetaColor();

  React.useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group/toggle extend-touch-target size-8"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      <Sun className="size-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
