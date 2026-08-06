import { IconCircle } from "@/components/ui/IconCircle";
import { CopyrightIcon } from "@/components/ui/Icons";
import { IndentLink } from "@/components/ui/IndentLink";
import { footerLinks, site, socials } from "@/lib/constants";

/**
 * Footer — a sticky reveal rather than a block at the end of the document.
 *
 * The footer is `fixed`, and a fixed element ignores an ancestor's `overflow`.
 * Only `clip-path` cuts it off, which is why the wrapper clips instead of
 * hiding: the wrapper reserves the footer's height in the flow, and the
 * Collaborate panel above (`z-2`, opaque) slides over the footer until the
 * scroll reaches this container.
 *
 * Inside, three rows: nav and socials at the top, the copyright under them, and
 * the oversized name pushed to the bottom edge by `mt-auto` — so the free space
 * always collects above the name, whatever the viewport height.
 */
export function Footer() {
  // Evaluated when the page is prerendered, so it follows each deploy rather
  // than needing an edit every January.
  const year = new Date().getFullYear();

  return (
    <div className="relative z-1 h-[min(700px,100svh)] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <footer className="fixed inset-x-0 bottom-0 flex h-[min(700px,100svh)] flex-col bg-paper px-gutter pt-[clamp(32px,6vw,56px)] pb-[30px]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Contact is omitted — the Collaborate panel directly above is it. */}
          <nav className="flex flex-col gap-[3px] text-2xl">
            {footerLinks.map((link) => (
              <IndentLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex gap-3">
            {socials.map((social) => (
              <IconCircle
                key={social.platform}
                {...social}
                size={62}
                iconSize={24}
                lift
              />
            ))}
          </div>
        </div>

        <p className="flex items-center justify-center gap-[7px] text-base text-muted-deep">
          <CopyrightIcon size={16} />
          <span>
            {year} | {site.name} | All Rights Reserved
          </span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-6">
          <span
            aria-hidden="true"
            className="min-w-0 flex-auto font-wordmark text-[clamp(38px,8.5vw,200px)] leading-[0.82] tracking-[-0.01em] uppercase"
          >
            {site.name}
          </span>
          <a
            href={site.archiveUrl}
            className="flex-none text-[22px] font-medium tracking-[-0.02em] whitespace-nowrap pointer-coarse:py-2"
          >
            View Archive.
          </a>
        </div>
      </footer>
    </div>
  );
}
