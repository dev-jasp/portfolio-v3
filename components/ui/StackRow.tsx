import type { StackCategory } from "@/types";

/**
 * One category of the tech stack: a mono label beside its chips.
 *
 * Type sizes are in `cqw`, not `vw` — the row reads against the width of its
 * own column, so the layout collapsing to one column at 900px resizes the text
 * without a second set of breakpoints.
 *
 * TODO(stack): the horizontal divider, equal row heights, and hiding a
 * separator when a wrap puts it at the start of a line.
 */
export function StackRow({ label, items }: StackCategory) {
  return (
    <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-[clamp(16px,2.4cqw,40px)] py-[clamp(18px,2.6cqw,34px)]">
      <div className="font-mono text-[max(12px,min(20px,4.2cqw))] font-bold tracking-[0.02em] whitespace-nowrap uppercase">
        {label}
      </div>

      <div className="flex flex-wrap items-center gap-x-[11px] gap-y-2.5 font-mono text-[max(13px,min(24px,5cqw))] tracking-[0.01em] text-muted-strong">
        {items.map((item, index) =>
          index === 0 ? (
            <span key={item} className="whitespace-nowrap">
              {item}
            </span>
          ) : (
            <span
              key={item}
              className="inline-flex items-center gap-3 whitespace-nowrap"
            >
              {/* Separator travels with the chip it precedes, so wrapping
                  never leaves a bar stranded at the end of a line. */}
              <span
                aria-hidden="true"
                className="h-[1.1em] w-px flex-none bg-hairline"
              />
              <span>{item}</span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
