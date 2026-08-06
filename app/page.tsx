import { Footer } from "@/components/layout/Footer";
import { Collaborate } from "@/components/sections/Collaborate";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechStack } from "@/components/sections/TechStack";

/**
 * The whole site is this one page; the menu links are anchors into it.
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
        <TechStack />
        <SelectedWork />
        <Collaborate />
      </main>
      <Footer />
    </>
  );
}
