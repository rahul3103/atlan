import Link from "next/link";
import { Github } from "lucide-react";

import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function GitHubLink() {
  return (
    <Button
      aria-label="GitHub Link"
      asChild
      size="sm"
      variant="ghost"
      className="h-8 shadow-none"
    >
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Github className="size-4" />
      </Link>
    </Button>
  );
}
