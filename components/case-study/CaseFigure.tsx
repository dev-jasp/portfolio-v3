import Image from "next/image";

type Props = {
  /** Path under `public/`. Omit and the well names what belongs in it. */
  src?: string;
  alt?: string;
  /** Shown inside an empty well. Name the shot, not the fact that it is missing. */
  placeholder: string;
  caption?: string;
  sizes: string;
  /** The well's aspect, as a CSS `aspect-ratio`. Screenshots are mostly 16:10. */
  ratio?: string;
  priority?: boolean;
};

/**
 * A screenshot and its caption.
 *
 * The well is `surface` grey rather than the work cards' ink: on the paper
 * background of a case study an empty ink panel reads as a deliberate black
 * block, where the grey reads as a slot with nothing in it yet — which is what
 * it is until the screenshots land.
 *
 * The caption is Space Mono, like every other label on the site that describes
 * something rather than says it.
 */
export function CaseFigure({
  src,
  alt = "",
  placeholder,
  caption,
  sizes,
  ratio = "16 / 10",
  priority,
}: Props) {
  return (
    <figure className="flex flex-col gap-[14px]">
      <div
        className="relative w-full overflow-hidden rounded-card bg-surface"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          /* 90 rather than the default 75, and allowlisted in `next.config.ts`:
             these are screenshots of dense UI, and 75 smears small label text
             and thin chart rules. */
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={90}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <p className="absolute inset-0 grid place-items-center px-6 text-center font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-muted-strong">
            {placeholder}
          </p>
        )}
      </div>

      {caption && (
        <figcaption className="max-w-[62ch] font-mono text-[13px] leading-[1.55] tracking-[0.02em] text-muted-strong">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
