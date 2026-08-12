import type { Metadata } from "next";
import { Blank } from "@/components/case-study/Blank";
import { CaseFigure } from "@/components/case-study/CaseFigure";
import { CaseProse, CaseSection } from "@/components/case-study/CaseSection";
import { MeanDriftDiagram } from "@/components/case-study/MeanDriftDiagram";
import { Footer } from "@/components/layout/Footer";
import { InlineNav } from "@/components/layout/InlineNav";
import { Collaborate } from "@/components/sections/Collaborate";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/constants";
import { projects } from "@/lib/data";
import { reveal } from "@/lib/design/motion";

/**
 * The card this page belongs to, so the name, stack and description cannot
 * drift from the one on the home page. A missing id is a mistake in the data,
 * caught when the page is prerendered rather than rendered as a blank — hence
 * the throw rather than a fallback.
 */
function requireProject(id: string) {
  const found = projects.find((entry) => entry.id === id);
  if (!found) throw new Error(`No project with id '${id}' in lib/data.ts`);
  return found;
}

const project = requireProject("qc-pulse");

/**
 * The page's h1 — what the thing is, in one sentence, rather than the project's
 * name set large. The name is above it as a wordmark, so the heading is free to
 * spend its size on the only line a first-time reader actually needs.
 *
 * Deliberately not `project.description`: that one is written to sell a card in
 * a list of three, and repeating it here would set a marketing paragraph at
 * 52px.
 */
const headline =
  "A quality control monitoring system that replaced a manual workflow";

/** The closing strip. Eight shots, thumbnail size: proof, not reading material. */
const screens = [
  "Login",
  "Dashboard",
  "Levey-Jennings chart",
  "New QC entry",
  "Reports",
  "Batches & lots",
  "Personnel & history",
  "Mobile entry",
];

export const metadata: Metadata = {
  title: `QC Pulse — Case Study | ${site.name}`,
  description: project.description,
  openGraph: {
    title: "QC Pulse — Case Study",
    description: project.description,
    type: "article",
    images: project.image ? [project.image] : undefined,
  },
};

/**
 * QC Pulse case study.
 *
 * Draft copy. Every fact the page cannot source from the repo — the hours the
 * manual workflow cost, the technician's quote, the schema and RLS model — is
 * wrapped in `Blank` so it renders in the accent and cannot ship as finished
 * prose by mistake.
 *
 * The page ends with `Collaborate` and `Footer` for the same reason the home
 * page does: the footer is fixed and clipped by its wrapper, and Collaborate is
 * the opaque lid that covers it until the scroll reaches the end.
 */
export default function QcPulseCaseStudy() {
  return (
    <>
      <main>
        {/* Hero. Someone who reads only this should still know what the thing
            is and that it is real — hence the sentence set large and the two
            links, rather than the project's name set large and a picture.

            The top padding is the home hero's, not a page header's: the nav
            below sits on the same line the hero's does, so arriving here from
            the work card doesn't move it. */}
        <section className="px-gutter pt-[clamp(26px,4vh,44px)] pb-[clamp(32px,5vw,56px)]">
          <div className="mx-auto w-full max-w-[1349px]">
            {/* Right-aligned, and the only way back to the work list now that
                the "← Selected Work" link is gone. Below 900px it hides itself
                and the fixed menu pill is the way back — same bargain the home
                hero makes. */}
            <Reveal className="flex justify-end">
              <InlineNav />
            </Reveal>

            {/* Carries the space between the nav and the title on its own, so
                the gap survives the nav hiding below 900px — where the section
                closes up to a plain page top rather than leaving a hole. */}
            <div className="mt-[clamp(44px,8vh,104px)] flex flex-col gap-[clamp(22px,2.8vw,34px)]">
              <Reveal delayMs={reveal.stepMs}>
                {/* Wordmark and label on one baseline: the name is the page's
                    identity and "Case Study" is what kind of page it is, which
                    is one line of information rather than two. `items-baseline`
                    rather than `items-center` — a serif and a mono at different
                    sizes only line up on the baseline they share. No weight
                    utility on the wordmark; the family is loaded at 400 only. */}
                <div className="flex flex-wrap items-baseline gap-x-[clamp(14px,1.8vw,26px)] gap-y-[6px]">
                  <p className="font-wordmark text-[clamp(23px,2vw,32px)] leading-none tracking-[-0.01em] uppercase">
                    {project.name}
                  </p>
                  <p className="font-mono text-[13px] tracking-[0.22em] text-muted-strong uppercase">
                    Case Study
                  </p>
                </div>

                {/* Space Mono, like the home hero's opening statement — the two
                    first screens should sound like the same voice, and the
                    wordmark serif is spent on the name directly above it.

                    The measure is `36ch`, which in a monospaced family is an
                    exact character count rather than an estimate: it puts the
                    break after "system" at every width wide enough to hold the
                    line, so the two-line shape is a property of the type rather
                    than of one viewport. `text-balance` is deliberately absent —
                    it would even the two lines out and lose that break. */}
                <h1 className="mt-[clamp(14px,1.5vw,22px)] max-w-[36ch] font-mono text-[clamp(26px,3.6vw,52px)] leading-[1.16] tracking-[-0.02em]">
                  {headline}
                </h1>
              </Reveal>

              <Reveal delayMs={reveal.stepMs * 2}>
                {/* Accent dots divide the stack, as they do on the work card —
                    the same list should not change its punctuation between the
                    card and the page the card links to. */}
                <ul className="flex flex-wrap items-center gap-x-[0.6em] gap-y-2 font-mono text-[clamp(13px,1.1vw,17px)] text-muted-strong">
                  {project.stack.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-center gap-[0.6em] whitespace-nowrap"
                    >
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="size-[0.35em] flex-none rounded-full bg-accent"
                        />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Both leave the site, so both open in a new tab on the same
                  terms the social icons do. Each renders only if `lib/data.ts`
                  has somewhere to send it — the same call `WorkCard` makes
                  about its own button. */}
              <Reveal
                delayMs={reveal.stepMs * 3}
                className="flex flex-wrap items-center gap-x-8 gap-y-5"
              >
                {project.demoUrl && (
                  <ArrowButton
                    href={project.demoUrl}
                    label="Live demo"
                    size="sm"
                    tone="onLight"
                    external
                  />
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[19px] font-medium tracking-[-0.02em] pointer-coarse:py-2"
                  >
                    View GitHub.
                  </a>
                )}
              </Reveal>
            </div>

            <Reveal
              delayMs={reveal.stepMs * 4}
              className="mt-[clamp(30px,4vw,52px)]"
            >
              <CaseFigure
                src={project.image}
                alt="QC Pulse running on a laptop, showing the Measles in-house control chart"
                placeholder="Hero mockup"
                sizes="(max-width: 1349px) 100vw, 1349px"
                ratio="969 / 642"
                priority
              />
            </Reveal>
          </div>
        </section>

        <CaseSection index="01" title="The before">
          {/* The source is 1536×1024 and `CaseFigure` covers its well, so the
              ratio is the file's own — a 16/10 well would crop a document that
              has nothing spare at its edges. Fetched wider than the column it
              lands in: it is three dense forms, and under-fetching this one
              costs legibility rather than a little softness.

              No `bordered`: the shot carries its own mid-grey surface to the
              edge, so there is nothing to stop bleeding into the paper. */}
          <CaseFigure
            src="/images/case-study/manual_workflow.png"
            alt="The three documents QC Pulse replaced: a QC worksheet carrying the run’s sum, mean, SD and CV, a Levey-Jennings chart drawn in a spreadsheet, and a running log of lots and experiment dates"
            placeholder="The manual chart — a printed Levey-Jennings sheet, plotted by hand"
            caption="The workflow this replaced: the worksheet, the chart drawn in a spreadsheet, and the running log — one set per assay, per control stream, per lot. It argues better than a paragraph can."
            sizes="(max-width: 900px) 100vw, 70vw"
            ratio="3 / 2"
          />
          <CaseProse>
            <p>
              Control values were plotted by hand. A technician read the day’s
              optical density off the plate reader, wrote it into a spreadsheet,
              and marked it on a printed Levey-Jennings chart — one chart per
              assay, per control stream, per lot. Five assays with three streams
              each is fifteen charts live at any time, each with its own
              established mean and standard deviation, kept in a binder.
            </p>
            
          </CaseProse>
        </CaseSection>

        <CaseSection index="02" title="Constraints">
          <CaseProse>
            <p>
              The rules were not mine to choose. The lab’s SOP names the Westgard
              set — 1-3s, 2-2s, R-4s, 4-1s, 10-x — and the app had to evaluate
              the same rules, in the same order, and call them by the same names
              a supervisor would use out loud.
            </p>
            <p>
              Five assays, three control streams each, every stream on its own
              lot with its own established mean and SD. Fifteen independent
              charts, not one chart with a filter on it.
            </p>
            <p>
              Exports had to match the report the institution already files:
              their letterhead, their signatory blocks, their column order. A PDF
              that looked like a web app was not a deliverable.
            </p>
            <p>
              Entry happens at the bench, mid-run, in gloves, on a shared
              workstation. Anything that needed a second pass to get right would
              have been done on paper instead — which is the failure mode, not a
              usability complaint.
            </p>
          </CaseProse>
        </CaseSection>

        <CaseSection index="03" title="Three surfaces">
          {/* Both sources are 1536×1024, so the wells are 3/2 rather than the
              4/3 they held while empty — at 4/3 `object-cover` would eat a
              strip off each side of a screen whose controls run to the edge. */}
          <div className="grid gap-[clamp(14px,1.6vw,22px)] min-[700px]:grid-cols-2">
            <CaseFigure
              src="/images/case-study/chart_toolbar.png"
              alt="The Measles in-house control screen: a run statistics strip carrying the established mean, SD, sum and CV, the Levey-Jennings chart below it, and the new QC entry form docked to its right"
              placeholder="The chart surface — batch, stream and date range above the chart"
              caption="The chart surface. The batch selector, the stream toggle and the date range change what you are looking at; entry is the one write on this screen, and it keeps its own panel."
              sizes="(max-width: 700px) 100vw, 30vw"
              ratio="3 / 2"
            />
            <CaseFigure
              src="/images/case-study/settings.png"
              alt="The Settings screen: lab configuration, holding the number of days before a reagent lot’s expiry it is flagged, and the personnel pre-filled as performer and validator on the entry form"
              placeholder="Settings — the lab-level defaults, set once"
              caption="Settings. Lab-level defaults that outlive any one run — the expiry warning, and who the entry form pre-fills. Lots and batches are managed on their own page, linked from here."
              sizes="(max-width: 700px) 100vw, 30vw"
              ratio="3 / 2"
            />
          </div>
          <CaseProse>
            <p>
              The first build put every control in one panel above the chart:
              assay, stream, lot, date range, the established mean and SD, the
              export options. It was one screen and it was legible, and it was
              still wrong. A technician entering a run and a supervisor
              establishing a new lot were reaching into the same set of fields,
              and neither could tell which of them were theirs to touch.
            </p>
            <p>
              So the controls split by who changes them and how often. Settings
              holds what is established once per lot and signed for. The chart
              toolbar holds what changes per view and alters no record. The
              export modal holds what changes per report. Same controls, three
              surfaces — and the question “is this mine to change right now” is
              answered by where you are standing rather than by reading the
              labels carefully.
            </p>
          </CaseProse>
        </CaseSection>

        <CaseSection index="04" title="The export">
          {/* 1448×1086 is exactly 4/3. */}
          <CaseFigure
            src="/images/case-study/qc_export.png"
            alt="The print and export dialog open over the Rubella in-house control chart, previewing the lab’s own report: its letterhead, the assay title block carrying the established mean, SD and CV, the chart beneath, and Download PDF and Print"
            placeholder="Export modal and the rendered report"
            caption="The print preview. Not a view of the app — the lab’s own form, rendered: letterhead, title block, established figures, and the chart, in the order their records officer already receives them."
            sizes="(max-width: 900px) 100vw, 60vw"
            ratio="4 / 3"
          />
          <CaseProse>
            <p>
              This is the part that matters most and looks least like software. A
              QC report has a life outside the app: it is printed, signed, and
              filed against the batch it certifies, and most of the people who
              read it will never open the app. So the output is not a view of the
              app — it is the lab’s own form, rendered. Their letterhead, their
              column order, their signatory blocks, the run table paginated the
              way their records officer expects to receive it.
            </p>
            <p>
              The test was whether a filed report would sit in the binder without
              anyone noticing it came from somewhere new. Anything that made it
              read as a screenshot of a web page failed that test, which ruled
              out most of what a web app does by default.
            </p>
          </CaseProse>
        </CaseSection>

        <CaseSection index="05" title="Frozen, not rolling">
          <MeanDriftDiagram />
          <CaseProse>
            <p>
              A mean that recalculates on every entry drifts along with the
              problem it is supposed to detect. If a reagent is slowly degrading,
              each new run pulls the mean down with it and widens the SD; the
              band re-centres under the drift, and values that should be walking
              out of ±2SD stay comfortably inside it. The chart stays green while
              the assay goes wrong.
            </p>
            <p>
              So the mean and SD are frozen. They are established over the lot’s
              first twenty runs, and every run after that is judged against those
              two numbers and nothing else. Re-establishing is a deliberate act
              tied to a real event — a new lot, a new instrument, a
              recalibration — recorded with who did it and when.
            </p>
            <p>
              It is the decision in this project I would defend hardest, and the
              one that is easiest to get wrong without knowing you have: a
              rolling mean is the more sophisticated-looking choice, and it
              quietly removes the only thing the chart is for.
            </p>
          </CaseProse>
        </CaseSection>

        <CaseSection index="06" title="Working with the lab">
          {/* Invented, and marked as invented: the quote sits in `Blank` so it
              renders as an open question rather than as testimony. Replace it
              with what a technician actually said, or cut the section — a
              made-up quote under a real name, beside screenshots of the real
              lab, is read as a real one. The attribution stays outside `Blank`:
              it is the sentence that is unverified, and striking the name too
              would leave the quote looking anonymous rather than provisional.

              The quote is now the whole section. There is no prose left to
              carry it if it goes. */}
          <blockquote className="max-w-[54ch] border-l-2 border-accent pl-[clamp(16px,2vw,26px)] text-[clamp(19px,1.7vw,26px)] leading-[1.4] text-pretty">
            <p>
              <Blank>
                “We used to spend more time drawing the chart than reading it.
                Now it’s the other way around.”
              </Blank>
            </p>
            <footer className="mt-[0.7em] font-mono text-[13px] leading-[1.55] tracking-[0.02em] text-muted-strong">
              — <cite className="not-italic">Aliana</cite>
            </footer>
          </blockquote>
        </CaseSection>

        <CaseSection index="07" title="Where it stands">
          <CaseProse>
            <p>
              The frontend is built and has been prototyped with lab staff
              against real control data. The persistence layer is the current
              phase: Postgres on Supabase, with{" "}
              <Blank>
                the schema — the tables and how a run, a lot and a violation
                relate
              </Blank>{" "}
              and row-level security keyed to{" "}
              <Blank>
                the role model: who may enter a run, who may validate one, who
                may establish a lot
              </Blank>
              .
            </p>
            <p>
              Naming this as the next phase rather than a gap is the accurate
              framing — the data model is being designed against a workflow that
              is already understood, which is the right order to do it in.
            </p>
          </CaseProse>
        </CaseSection>

        <CaseSection index="08" title="What I’d do differently">
          <CaseProse>
            <p>
              Model the rules as data before writing the evaluator. The first
              pass expressed the Westgard set as a chain of conditionals, which
              made adding a lab-specific rule an edit to the evaluator rather
              than a row in a table.
            </p>
            <p>
              Build the export first. It was the last thing I built and the
              thing that most constrained the data model — the report needs
              fields the chart never had to ask for.
            </p>
            <p>
              Prototype the entry form on the bench’s own hardware sooner. It
              reads differently on a shared workstation at arm’s length than it
              does on my monitor.
            </p>
          </CaseProse>
        </CaseSection>

        {/* Proof the app is finished, at a size that asks nobody to read it. */}
        <section className="px-gutter pb-[clamp(64px,10vw,120px)]">
          <div className="mx-auto w-full max-w-[1349px]">
            <Reveal>
              <p className="font-mono text-[13px] tracking-[0.22em] text-muted-strong uppercase">
                Screens
              </p>
            </Reveal>
            {/* Eight across once there is room: at four they are screenshots
                you are invited to read, and the point of the strip is the
                opposite — coverage at a glance. */}
            <ul className="mt-[clamp(16px,2vw,26px)] grid grid-cols-2 gap-[clamp(10px,1.2vw,16px)] min-[560px]:grid-cols-4 min-[1100px]:grid-cols-8">
              {screens.map((label) => (
                <li
                  key={label}
                  className="grid aspect-[16/10] place-items-center rounded-[12px] bg-surface px-3 text-center font-mono text-[11px] leading-[1.5] tracking-[0.02em] text-muted-strong"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Collaborate />
      </main>
      <Footer />
    </>
  );
}
