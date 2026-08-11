/**
 * The two behaviours, side by side: the same drifting control run judged
 * against a frozen mean and against a rolling one.
 *
 * Both panels plot identical values. Only the band moves — and that is the
 * whole argument, so the numbers are computed here from one array rather than
 * drawn twice by hand, where the two panels could quietly stop agreeing.
 */

/** Fourteen runs: six steady, then a slow drift. Panel y units, so down is worse. */
const RUNS = [78, 82, 76, 84, 79, 83, 80, 86, 92, 97, 103, 108, 114, 119];

/** The established mean and its 2SD half-width, frozen at the establishment period. */
const MEAN = 80;
const HALF = 22;

/**
 * How far the rolling band fans open across the series. A rolling mean is
 * always paired with a rolling SD, and the widening is half of why the drift
 * disappears — leaving it out would make the comparison flattering.
 */
const HALF_GROWTH = 12;

const X0 = 22;
const STEP = 19;
const PLOT_SHIFT = -26;
const PANEL_W = 300;

const x = (index: number) => X0 + index * STEP;

/** Running mean of everything up to and including `index`. */
const rollingMean = (index: number) =>
  RUNS.slice(0, index + 1).reduce((sum, value) => sum + value, 0) / (index + 1);

const rollingHalf = (index: number) =>
  HALF + (index / (RUNS.length - 1)) * HALF_GROWTH;

/** Upper and lower band edges, as an SVG path that closes back along itself. */
function bandPath(edge: (index: number) => [number, number]) {
  const upper = RUNS.map((_, i) => `${x(i)} ${edge(i)[0]}`);
  const lower = RUNS.map((_, i) => `${x(i)} ${edge(i)[1]}`).reverse();
  return `M ${upper.join(" L ")} L ${lower.join(" L ")} Z`;
}

const line = (at: (index: number) => number) =>
  RUNS.map((_, i) => `${x(i)} ${at(i)}`).join(" ");

type PanelProps = {
  title: string;
  caption: string;
  /** Band edges at each run: `[upper, lower]`. */
  edge: (index: number) => [number, number];
  centre: (index: number) => number;
};

/**
 * Each panel is its own `svg`, not two halves of one.
 *
 * A single 640-unit viewBox would scale both panels down to fit a phone, and
 * scaling an SVG scales its type with it — the labels landed around 6px. Two
 * SVGs in a grid stack instead of shrinking, so each one is always as wide as
 * its column and its text is always the size the column can carry.
 */
function Panel({ title, caption, edge, centre }: PanelProps) {
  return (
    <svg
      viewBox={`0 0 ${PANEL_W} 140`}
      aria-hidden="true"
      className="h-auto w-full"
    >
      <text
        x={0}
        y={12}
        className="font-mono"
        fontSize={11}
        letterSpacing={1.6}
        fill="var(--color-ink)"
      >
        {title.toUpperCase()}
      </text>

      <g transform={`translate(0 ${PLOT_SHIFT})`}>
        <path d={bandPath(edge)} fill="var(--color-surface)" />
        <polyline
          points={line((i) => edge(i)[0])}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <polyline
          points={line((i) => edge(i)[1])}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <polyline
          points={line(centre)}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.25}
        />

        {RUNS.map((value, i) => {
          // A run is a violation where it sits outside the band this panel
          // draws — which is the only thing that differs between the two.
          const outside = value > edge(i)[1] || value < edge(i)[0];
          return (
            <circle
              key={i}
              cx={x(i)}
              cy={value}
              r={outside ? 3.6 : 2.4}
              fill={outside ? "var(--color-accent)" : "var(--color-ink)"}
            />
          );
        })}
      </g>

      <text
        x={0}
        y={124}
        className="font-mono"
        fontSize={10}
        fill="var(--color-muted-strong)"
      >
        {caption}
      </text>
    </svg>
  );
}

export function MeanDriftDiagram() {
  return (
    /* The description belongs to the pair, not to either panel — the comparison
       is the content, so the two SVGs are hidden and this carries the label. */
    <div
      role="img"
      aria-label="Two charts of the same drifting control runs. Against a frozen mean the last four runs fall outside the 2SD band and are flagged; against a rolling mean the band drifts and widens with them, and nothing is flagged."
      className="grid max-w-[760px] gap-x-10 gap-y-8 min-[560px]:grid-cols-2"
    >
      <Panel
        title="Frozen"
        caption="the drift walks out of the band"
        edge={() => [MEAN - HALF, MEAN + HALF]}
        centre={() => MEAN}
      />
      <Panel
        title="Rolling"
        caption="the band follows the drift"
        edge={(i) => [
          rollingMean(i) - rollingHalf(i),
          rollingMean(i) + rollingHalf(i),
        ]}
        centre={rollingMean}
      />
    </div>
  );
}
