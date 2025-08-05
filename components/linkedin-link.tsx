import Link from "next/link";
import { Linkedin } from "lucide-react";

import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function LinkedInLink() {
  return (
    <Button
      aria-label="LinkedIn Link"
      asChild
      size="sm"
      variant="ghost"
      className="h-8 shadow-none"
    >
      <Link href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
        <Linkedin className="h-4 w-4" />
      </Link>
    </Button>
  );
}