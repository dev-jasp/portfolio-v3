import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Collaborate } from "@/components/sections/Collaborate";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";

/**
 * The home page: every section of the site proper, with the menu links as
 * anchors into it. Case studies are the only routes beside it, which is why
 * those anchors are written root-relative in `lib/constants.ts` — see the note
 * there.
 *
 * Order carries meaning beyond sequence — Collaborate has to be the last thing
 * inside `<main>` because it is what covers the footer until you scroll to it.
 * `<main>` is unpositioned on purpose, so the z-indexes inside it and the
 * footer's resolve against the same root stacking context.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <Collaborate />
      </main>
      <Footer />
    </>
  );
}
