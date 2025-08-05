import Link from "next/link";

import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubLink } from "@/components/github-link";
import { LinkedInLink } from "@/components/linkedin-link";
import { Icons } from "@/components/icons";
import { ModeSwitcher } from "@/components/mode-switcher";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
          >
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <LinkedInLink />
            <Separator orientation="vertical" />
            <GitHubLink />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
