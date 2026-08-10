import Image from "next/image";

type Props = {
  /** Path under `public/`. Omit to render the empty slot. */
  src?: string;
  alt: string;
  placeholder?: string;
  sizes: string;
};

/**
 * The media well of a work card, filled or waiting.
 *
 * Replaces the design's `<image-slot>` web component, which was drag-and-drop
 * scaffolding for the design tool. Here the empty state is just what a project
 * without an `image` renders — the copy names what belongs there, so a gap in
 * the content layer reads as a gap rather than as a broken card.
 */
export function ImageSlot({ src, alt, placeholder, sizes }: Props) {
  if (!src) {
    return (
      <p className="absolute inset-0 grid place-items-center px-8 text-center font-mono text-sm tracking-[0.02em] text-[rgba(255,255,255,0.62)]">
        {placeholder}
      </p>
    );
  }

  /*
    These are screenshots of dense UI, not photographs. The default WebP
    quality of 75 is tuned for photos and visibly smears small label text and
    thin chart rules; 90 holds them. Allowlisted in `next.config.ts`.
  */
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={90}
      className="object-cover"
    />
  );
}
