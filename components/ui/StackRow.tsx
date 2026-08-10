import { AccentRule } from "@/components/ui/AccentRule";
import type { StackCategory } from "@/types";

type Props = StackCategory & {
  /** Every row but the first is divided from the one above it. */
  divided?: boolean;
};

/**
 * One category of the tech stack: a mono label beside its chips, divided from
 * the row above by the accent rule.
 *
 * **The chips never wrap.** The list is one line at every width, which the
 * layout guarantees structurally rather than hoping the content is short
 * enough: the flex row is `nowrap`, and every horizontal measure in it — type
 * size, the gaps either side of a separator — is a fraction of the column's own
 * width, so the longest row keeps the same slack in a 270px column as in a
 * 1100px one. The `cqw` coefficients are set from that longest row (Backend, 41
 * characters plus four separators), which fills 90–94% of its column at every
 * width — so adding an item means re-checking them, and the row shrinks its
 * type to fit rather than breaking.
 *
 * Under a 480px column an inline label leaves too little width beside it for
 * the chips to stay legible — around 9px — so the label moves above them and
 * hands the chips the full column. That is the row's only breakpoint, and it is
 * a container query: what matters is the column's width, not the viewport's,
 * and the two stop agreeing when the section's grid collapses at 900px.
 *
 * Row heights are equalised by the parent's
 * `grid-template-rows: repeat(4, minmax(min-content, 1fr))`, so the rules stay
 * evenly spaced even where the stacked label makes a row taller.
 */
export function StackRow({ label, items, divided = false }: Props) {
  // `content-center` matters once the label stacks: the parent equalises row
  // heights, and without it the label and its chips are stretched to the two
  // ends of a row that is taller than either.
  return (
    <div className="relative grid grid-cols-[max-content_minmax(0,1fr)] content-center items-center gap-x-[min(24px,3cqw)] py-[clamp(18px,2.6cqw,34px)] @max-[480px]:grid-cols-1 @max-[480px]:gap-y-2">
      {/* Centred on the row's top edge, where the hairline border used to sit —
          so the dots overhang into the row above rather than pushing this one
          down. Out of flow, or it would count as a third grid cell. */}
      {divided && (
        <AccentRule className="absolute inset-x-0 top-0 -translate-y-1/2" />
      )}

      <div className="font-mono text-[min(20px,2.3cqw)] font-bold tracking-[0.02em] whitespace-nowrap uppercase @max-[480px]:text-[min(12px,3.4cqw)]">
        {label}
      </div>

      {/* The gaps around each separator are in `em`, so they scale with the type
          rather than crowding it as the row narrows. */}
      <div className="flex items-center gap-x-[0.5em] font-mono text-[min(24px,2.7cqw)] tracking-[0.01em] whitespace-nowrap text-muted-strong @max-[480px]:text-[min(13px,3.15cqw)]">
        {items.map((item, index) =>
          index === 0 ? (
            <span key={item}>{item}</span>
          ) : (
            <span key={item} className="inline-flex items-center gap-[0.5em]">
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
