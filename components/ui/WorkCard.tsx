"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useScrollScale } from "@/hooks/useScrollScale";
import type { Project } from "@/types";

/** The meta column trails the media in, once the card is properly on screen. */
const META_DELAY_MS = 260;

/**
 * A project: media on the left, metadata on the right, collapsing to one
 * column at 1100px.
 *
 * The name is stamped over the media rather than set above it, in
 * `mix-blend-mode: difference` so it stays legible against whatever the
 * screenshot happens to be — light on dark areas, dark on light ones, without
 * a scrim.
 *
 * The card scales toward 1 and fades in as it approaches the viewport's
 * centre, so the column reads as one card at a time rather than a list.
 */
export function WorkCard({ project }: { project: Project }) {
  const { name, description, stack, year, image, imagePlaceholder } = project;
  const cardRef = useRef<HTMLElement>(null);

  useScrollScale(cardRef);

  return (
    <article
      ref={cardRef}
      data-card
      className="mx-auto grid w-full max-w-[1349px] grid-cols-[minmax(0,1fr)_minmax(260px,340px)] items-start gap-10 will-change-transform max-[1100px]:grid-cols-1"
    >
      <div className="relative mx-auto aspect-[969/642] w-full max-w-[969px] overflow-hidden rounded-card bg-ink">
        <ImageSlot
          src={image}
          alt={name}
          placeholder={imagePlaceholder}
          sizes="(max-width: 1100px) 100vw, 969px"
        />
        <h3 className="pointer-events-none absolute bottom-[22px] left-[26px] font-mono text-[13px] tracking-[0.22em] text-paper uppercase mix-blend-difference">
          {name}
        </h3>
      </div>

      <Reveal delayMs={META_DELAY_MS} className="flex flex-col gap-[26px]">
        {/*
          The design labels this column "Tech stack used" and then renders only
          the description beneath it — the stack and year in the content layer
          are never shown. The label now introduces the list it names.
        */}
        {stack.length > 0 && (
          <div className="flex flex-col gap-[26px]">
            {/* Mono, like the stack section's row labels — this is the same
                pattern, a category label introducing a tech list, and the two
                were set in different families. */}
            <h4 className="font-mono text-lg tracking-[0.02em] text-muted uppercase">
              Tech stack used
            </h4>
            {/* 18px keeps the chips near the stack section's own scale at a
                column of this width, rather than shrinking against the 24px
                label and description that bracket them. */}
            <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-lg text-muted-strong">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-2xl leading-[1.5] text-pretty">{description}</p>

        {year && (
          <p className="font-mono text-sm tracking-[0.22em] text-muted-strong">
            {year}
          </p>
        )}
      </Reveal>
    </article>
  );
}
