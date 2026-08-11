import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Blank } from "@/components/case-study/Blank";
import { CaseFigure } from "@/components/case-study/CaseFigure";
import { CaseProse, CaseSection } from "@/components/case-study/CaseSection";
import { MeanDriftDiagram } from "@/components/case-study/MeanDriftDiagram";
import { Footer } from "@/components/layout/Footer";
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

/** Role, working arrangement, and timeline — the one metadata line under the lede. */
const facts: ReactNode[] = [
  "Design & engineering",
  "Solo",
  <Blank key="timeline">timeline</Blank>,
];

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
 * Draft copy. Every fact the page cannot source from the repo — the timeline,
 * the two outbound links, the hours the manual workflow cost, the technician's
 * quote, the schema and RLS model — is wrapped in `Blank` so it renders in the
 * accent and cannot ship as finished prose by mistake.
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
            is, who built it, and that it is real — hence the two links and the
            metadata line rather than a heading and a picture. */}
        <section className="px-gutter pt-[clamp(72px,11vh,132px)] pb-[clamp(32px,5vw,56px)]">
          <div className="mx-auto flex w-full max-w-[1349px] flex-col gap-[clamp(26px,4vw,48px)]">
            {/* The one link on the site that leaves the page it is on, so the
                one that uses `next/link` — everything else is a hash into the
                page it already sits on. */}
            <Reveal>
              <Link
                href="/#work"
                className="font-mono text-[13px] tracking-[0.22em] text-muted-strong uppercase pointer-coarse:py-2"
              >
                ← Selected Work
              </Link>
            </Reveal>

            <Reveal delayMs={reveal.stepMs}>
              <p className="font-mono text-[13px] tracking-[0.22em] text-accent uppercase">
                Case Study
              </p>
              {/* No weight utility — the wordmark family is loaded at 400 only. */}
              <h1 className="mt-[0.3em] font-wordmark text-[clamp(46px,9vw,150px)] leading-[0.88] tracking-[-0.01em]">
                {project.name}
              </h1>
            </Reveal>

            <div className="flex flex-col gap-[clamp(22px,3vw,34px)]">
              <Reveal delayMs={reveal.stepMs * 2}>
                <p className="max-w-[62ch] text-[clamp(18px,1.5vw,24px)] leading-[1.45] text-pretty">
                  QC Pulse is a quality control monitoring system for a Vaccine
                  Preventable Disease Referral Laboratory. Every control run is
                  plotted on a Levey-Jennings chart and evaluated against the
                  Westgard multi-rules as it is entered, so a violation surfaces
                  at the bench rather than at review. Reports export on the
                  institution’s own letterhead, which is what lets them be filed
                  against the batch they certify. It replaced a workflow of a
                  spreadsheet and fifteen printed charts.
                </p>
              </Reveal>

              <Reveal delayMs={reveal.stepMs * 3}>
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

              <Reveal
                delayMs={reveal.stepMs * 4}
                className="flex flex-wrap items-center gap-x-8 gap-y-5"
              >
                <ArrowButton
                  href="#"
                  label="Live demo"
                  size="sm"
                  tone="onLight"
                />
                <a
                  href="#"
                  className="text-[19px] font-medium tracking-[-0.02em] pointer-coarse:py-2"
                >
                  Source on GitHub.
                </a>
                <span className="font-mono text-[12px] tracking-[0.14em] text-muted-strong uppercase">
                  <Blank>both links still to point somewhere</Blank>
                </span>
              </Reveal>

              {/* Hairline bars rather than accent dots: this is a different
                  kind of list from the stack above it, and the About section
                  already spends the bars on exactly this — facts about a
                  thing, rather than the thing’s parts. */}
              <Reveal delayMs={reveal.stepMs * 5}>
                <ul className="flex flex-wrap items-center gap-x-[0.9em] gap-y-2 font-mono text-[12px] tracking-[0.14em] text-muted-strong uppercase">
                  {facts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-[0.9em] whitespace-nowrap"
                    >
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-[1.1em] w-px flex-none bg-hairline"
                        />
                      )}
                      {fact}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delayMs={reveal.stepMs * 6}>
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
          <CaseFigure
            placeholder="The manual chart — a printed Levey-Jennings sheet, plotted by hand"
            caption="The workflow this replaced. The screenshot argues better than a paragraph can."
            sizes="(max-width: 900px) 100vw, 60vw"
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
            <p>
              The cost was not really the plotting; it was when the rules got
              applied. <Blank>Hours per week spent transcribing</Blank> is the
              number worth putting here, but the larger cost is that a 2-2s or a
              10-x is a pattern across runs, and nobody sees a pattern while
              writing down a single dot. Violations were caught at review, days
              later, reading back over a chart — if at all. By then the plate was
              long gone and the run could not be repeated, only invalidated.
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
          <div className="grid gap-[clamp(14px,1.6vw,22px)] min-[700px]:grid-cols-2">
            <CaseFigure
              placeholder="Chart toolbar — assay, stream, date range"
              sizes="(max-width: 700px) 100vw, 30vw"
              ratio="4 / 3"
            />
            <CaseFigure
              placeholder="Settings — establishing a lot’s mean and SD"
              sizes="(max-width: 700px) 100vw, 30vw"
              ratio="4 / 3"
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
          <CaseFigure
            placeholder="Export modal and the rendered report — redacted"
            caption="Redact before publishing: patient-adjacent identifiers, personnel names, and the institution’s mark if they have not cleared it."
            sizes="(max-width: 900px) 100vw, 60vw"
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
          <blockquote className="max-w-[54ch] border-l-2 border-accent pl-[clamp(16px,2vw,26px)] text-[clamp(19px,1.7vw,26px)] leading-[1.4] text-pretty">
            <Blank>
              A sentence from a technician who used it. One real quote is worth
              the whole section; without one, cut the quote and keep the
              paragraph.
            </Blank>
          </blockquote>
          <CaseProse>
            <p>
              It was prototyped with lab staff rather than shown to them at the
              end.{" "}
              <Blank>
                Replace this with the single change that came out of that — the
                specific one, named. “Their feedback shaped the UI” says
                nothing; “the entry form lost a field because nobody at the bench
                could answer it mid-run” says everything.
              </Blank>
            </p>
          </CaseProse>
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
