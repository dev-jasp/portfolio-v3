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
 * the name pushed to the bottom edge by `mt-auto` — so the free space always
 * collects above the name, whatever the viewport height. The name runs the full
 * measure and is sized to it, which is the row: nothing sits beside it.
 */
export function Footer() {
  // Evaluated when the page is prerendered, so it follows each deploy rather
  // than needing an edit every January.
  const year = new Date().getFullYear();

  return (
    <div className="relative z-1 h-[min(700px,100svh)] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <footer className="fixed inset-x-0 bottom-0 flex h-[min(700px,100svh)] flex-col bg-paper px-gutter pt-[clamp(32px,6vw,56px)] pb-[30px]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Collab is omitted — the Collaborate panel directly above is it. */}
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

        {/*
          The name is measured to its container rather than picked: "JASPHER
          GARGAR" renders at exactly 8.4641x its own font size in this face, at
          this tracking, at every size — so dividing the container's width by a
          hair more than that fills the line to ~99% and cannot do anything
          else. `whitespace-nowrap` is the guarantee behind it: one line at
          every width, including the moment before the webfont swaps in.

          `cqw`, not `vw`. The page reserves a scrollbar gutter permanently, so
          `100vw` is wider than anything can actually be — sizing off it would
          overflow by the scrollbar's width at every breakpoint. A container
          query measures the box the name is really in.

          `pl-[0.078em]` is optical alignment: EB Garamond's "J" hooks that far
          left of its own origin, so a name set flush to the gutter paints past
          it — 13px past, at this size — and stops lining up with the nav above.
          The divisor carries it: 8.4641 is the name's own width in font sizes,
          the indent adds 0.078, and 8.62 clears the sum with ~0.8% to spare.
        */}
        <div className="mt-auto [container-type:inline-size]">
          <span
            aria-hidden="true"
            className="block font-wordmark pl-[0.078em] text-[calc(100cqw/8.62)] leading-[0.82] tracking-[-0.01em] whitespace-nowrap uppercase"
          >
            {site.name}
          </span>
        </div>
      </footer>
    </div>
  );
}
