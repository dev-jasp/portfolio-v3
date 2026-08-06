import Image from "next/image";
import { StackRow } from "@/components/ui/StackRow";
import { stack, stackIntroLines } from "@/lib/data";

/**
 * Tech stack — a centred intro over a two-column grid: portrait left, stack
 * rows right.
 *
 * The grid collapses to one column at 900px. The rows below size themselves in
 * container-query units against their own column, so that collapse is the only
 * breakpoint this section needs.
 *
 * TODO(stack): the intro's staggered line reveal, and the image wipe that
 * counter-slides the photo from 1.3 scale.
 *
 * The four rows share one height via `minmax(min-content, 1fr)`, which is why
 * the dividers stay evenly spaced whether or not a row's chips wrap.
 */
export function TechStack() {
  return (
    <section
      id="stack"
      className="flex min-h-screen flex-col gap-[clamp(28px,4vh,56px)] px-gutter pt-[clamp(40px,7vh,80px)] pb-[clamp(40px,6vh,70px)]"
    >
      {/*
        One paragraph, not three. The breaks are a visual composition — the
        design source splits it into separate <p>s so each line can animate,
        which reads as three unrelated sentences. Block spans animate just as
        well and keep it a single sentence to anything listening.
      */}
      <p className="mx-auto max-w-[60ch] text-center font-mono text-[clamp(15px,2.15vw,40px)] leading-[1.22] tracking-[-0.02em] text-ink uppercase">
        {stackIntroLines.map((line) => (
          <span key={line} className="relative block">
            {line}{" "}
          </span>
        ))}
      </p>

      <div className="grid flex-1 grid-cols-2 items-stretch gap-x-9 gap-y-10 max-[900px]:grid-cols-1">
        <div className="relative min-h-[clamp(320px,52vh,680px)] overflow-hidden rounded-frame bg-surface">
          <Image
            src="/images/jaspher-gargar.png"
            alt="Jaspher Gargar"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-[50%_40%] grayscale"
          />
        </div>

        <div className="grid [container-type:inline-size] [grid-template-rows:repeat(4,minmax(min-content,1fr))] content-center">
          {stack.map((category) => (
            <StackRow key={category.label} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
