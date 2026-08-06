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

  return (
    <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
  );
}
