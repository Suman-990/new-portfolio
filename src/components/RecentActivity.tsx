import { useState, useCallback } from "react";
import {
  GitCommitHorizontal,
  Flame,
  Zap,
  Calendar,
  Trophy,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import "./RecentActivity.css";

interface MonthActivity {
  month: string;
  fullMonth: string;
  year: number;
  count: number;
  color: string;
  displayValue?: string | number;
}

// Verified GitHub contributions for Suman-990 (Total: 275 in past year)
const GITHUB_12_MONTHS: MonthActivity[] = [
  { month: "NOV", fullMonth: "November 2025", year: 2025, count: 6, color: "#34d399" },
  { month: "DEC", fullMonth: "December 2025", year: 2025, count: 3, color: "#38bdf8" },
  { month: "JAN", fullMonth: "January 2026", year: 2026, count: 7, color: "#60a5fa" },
  { month: "FEB", fullMonth: "February 2026", year: 2026, count: 4, color: "#818cf8" },
  { month: "MAR", fullMonth: "March 2026", year: 2026, count: 6, color: "#a78bfa" },
  { month: "APR", fullMonth: "April 2026", year: 2026, count: 19, color: "#c084fc" },
  { month: "MAY", fullMonth: "May 2026", year: 2026, count: 0, color: "#64748b" },
  { month: "JUN", fullMonth: "June 2026", year: 2026, count: 20, color: "#f472b6" },
  { month: "JUL", fullMonth: "July 2026", year: 2026, count: 30, color: "#fb7185" },
  { month: "AUG", fullMonth: "August 2026", year: 2026, count: 78, color: "#f3904d" },
  { month: "SEP", fullMonth: "September 2026", year: 2026, count: 83, color: "#f4d94e" },
  { month: "OCT", fullMonth: "October 2026", year: 2026, count: 18, color: "#34d399" },
];

// Verified LeetCode submission activity (From profile heatmap: 886 submissions, 305 active days, 74 max streak)
const LEETCODE_12_MONTHS: MonthActivity[] = [
  { month: "NOV", fullMonth: "November 2025", year: 2025, count: 110, color: "#10b981" },
  { month: "DEC", fullMonth: "December 2025", year: 2025, count: 115, color: "#10b981" },
  { month: "JAN", fullMonth: "January 2026", year: 2026, count: 120, color: "#34d399" },
  { month: "FEB", fullMonth: "February 2026", year: 2026, count: 96, color: "#10b981" },
  { month: "MAR", fullMonth: "March 2026", year: 2026, count: 102, color: "#34d399" },
  { month: "APR", fullMonth: "April 2026", year: 2026, count: 86, color: "#059669" },
  { month: "MAY", fullMonth: "May 2026", year: 2026, count: 80, color: "#059669" },
  { month: "JUN", fullMonth: "June 2026", year: 2026, count: 66, color: "#0d9488" },
  { month: "JUL", fullMonth: "July 2026", year: 2026, count: 36, color: "#0284c7" },
  { month: "AUG", fullMonth: "August 2026", year: 2026, count: 21, color: "#f59e0b" },
  { month: "SEP", fullMonth: "September 2026", year: 2026, count: 24, color: "#f59e0b" },
  { month: "OCT", fullMonth: "October 2026", year: 2026, count: 30, color: "#10b981" },
];

const MAX_ROWS = 12;

// Beveled arcade cell patterns for 4-wide block rows
const ROW_PATTERNS = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 0],
  [1, 1, 1, 1],
  [0, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 1, 1],
];

function patternFor(rowIndex: number, columnIndex: number) {
  const patternIndex = (rowIndex + columnIndex * 3) % ROW_PATTERNS.length;
  return ROW_PATTERNS[patternIndex];
}

// Compute block stack height scaled to heatmap density
function calculateStackHeight(count: number, maxCount: number): number {
  if (count <= 0) return 0;
  // Power scaling (0.72) gives visibility to small months while crowning peak months at 12
  const ratio = Math.pow(count / maxCount, 0.72);
  return Math.min(MAX_ROWS, Math.max(1, Math.round(ratio * MAX_ROWS)));
}

export default function RecentActivity() {
  const [platform, setPlatform] = useState<"github" | "leetcode">("github");
  const [viewRange, setViewRange] = useState<"12M" | "6M">("12M");
  const [renderKey, setRenderKey] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const rawData = platform === "github" ? GITHUB_12_MONTHS : LEETCODE_12_MONTHS;
  const filteredData = viewRange === "6M" ? rawData.slice(-6) : rawData;
  const maxCount = Math.max(...filteredData.map((d) => d.count), 1);

  const chartData = filteredData.map((item) => ({
    ...item,
    stackHeight: calculateStackHeight(item.count, maxCount),
    displayValue: item.count,
  }));

  // Replay initial falling cascade animation
  const handleReplay = useCallback(() => {
    setRenderKey((k) => k + 1);
  }, []);

  return (
    <section
      id="activity"
      className="relative w-screen overflow-hidden bg-onyx py-14 sm:py-16 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] -mb-16 pb-20 text-paper font-mono"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 100%, rgba(69, 217, 232, 0.08), transparent 45%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <main className="blocklog" key={renderKey}>
          {/* Header */}
          <header className="chart-heading pb-4">
            <p className="chart-kicker">ENGINEERING TELEMETRY / ACTIVITY LOG</p>

            <div className="min-w-0">
              <h2 className="chart-title">ACTIVITY.</h2>
              <p className="chart-subtitle mt-2">
                Monthly activity heatmap rendered in retro arcade block stacks. Each pile corresponds to one month of production commits and algorithmic problem solving.
              </p>
            </div>

            {/* Controls: Platform & View Range */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 sm:pt-0">
              {/* Platform Switcher */}
              <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setPlatform("github");
                    handleReplay();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    platform === "github"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(69,217,232,0.3)]"
                      : "text-dim hover:text-paper"
                  }`}
                >
                  <img
                    src="/github_transparent.png"
                    alt="GitHub Logo"
                    className="w-4 h-4 object-contain rounded-full shrink-0"
                  />
                  <span>GITHUB</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlatform("leetcode");
                    handleReplay();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    platform === "leetcode"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 shadow-[0_0_12px_rgba(244,217,78,0.3)]"
                      : "text-dim hover:text-paper"
                  }`}
                >
                  <img
                    src="/leetcode.webp"
                    alt="LeetCode Logo"
                    className="w-4 h-4 object-contain shrink-0 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  />
                  <span>LEETCODE</span>
                </button>
              </div>

              {/* View Range Toggle */}
              <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setViewRange("12M");
                    handleReplay();
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    viewRange === "12M"
                      ? "bg-white/15 text-paper font-bold"
                      : "text-dim hover:text-paper"
                  }`}
                >
                  12 MONTHS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewRange("6M");
                    handleReplay();
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    viewRange === "6M"
                      ? "bg-white/15 text-paper font-bold"
                      : "text-dim hover:text-paper"
                  }`}
                >
                  RECENT 6M
                </button>
              </div>
            </div>
          </header>

          {/* Key Metrics / Profile Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-white/10 text-xs text-dim">
            <div className="flex flex-wrap items-center gap-2.5">
              {platform === "github" ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                    <GitCommitHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>275 Contributions (Last 12 Months)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 font-bold">
                    <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span>Peak: 83 in September 2026</span>
                  </span>
                  <span className="text-[11px] text-muted hidden md:inline">
                    GitHub @Suman-990
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 font-bold">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span>886 Submissions (Past 1 Year)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                    <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>74-Day Max Streak</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>305 Active Days</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                    <Trophy className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>837 Solved (Beats 99.8%)</span>
                  </span>
                  <span className="text-[11px] text-muted hidden lg:inline">
                    Easy: 176 • Med: 556 • Hard: 105
                  </span>
                </>
              )}
            </div>

            {/* Active Hover readout */}
            <div className="h-6 flex items-center">
              {activeTooltip ? (
                <span className="text-cyan-300 font-bold text-xs tracking-wide animate-pulse">
                  {activeTooltip}
                </span>
              ) : (
                <span className="text-[11px] text-muted italic">
                  Hover over any monthly pile for details
                </span>
              )}
            </div>
          </div>

          {/* Chart Section with horizontal scroll wrapper for mobile */}
          <div className="overflow-x-auto overflow-y-hidden pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <section
              className="block-chart"
              style={{
                minWidth: chartData.length > 6 ? "720px" : "auto",
              }}
              aria-label={`${platform === "github" ? "GitHub" : "LeetCode"} monthly activity block chart`}
            >
              <div className="grid-lines" aria-hidden="true" />

              <div
                className="bars"
                style={
                  {
                    "--col-count": chartData.length,
                    "--cell":
                      chartData.length > 8
                        ? "clamp(7px, 1.35vw, 16px)"
                        : "clamp(10px, 2vw, 22px)",
                  } as React.CSSProperties
                }
              >
                {chartData.map((item, colIdx) => {
                  const delayBase = colIdx * 50;

                  return (
                    <article
                      key={`${item.month}-${item.year}`}
                      className="bar-column group cursor-default"
                      style={{ "--bar-color": item.color } as React.CSSProperties}
                      onMouseEnter={() =>
                        setActiveTooltip(
                          `${item.fullMonth}: ${item.count} ${
                            platform === "github" ? "contributions" : "submissions"
                          }`
                        )
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <div
                        className="stack-wrapper"
                        aria-label={`${item.fullMonth}: ${item.count} ${
                          platform === "github" ? "contributions" : "submissions"
                        }`}
                      >
                        <span className="stack">
                          {item.stackHeight === 0 ? (
                            <span className="zero-marker">00</span>
                          ) : (
                            Array.from({ length: item.stackHeight }).map((_, rowIdx) => {
                              const pattern = patternFor(rowIdx, colIdx);
                              const delayMs = delayBase + rowIdx * 45;

                              return (
                                <span
                                  key={rowIdx}
                                  className="block-row"
                                  style={{ "--delay": `${delayMs}ms` } as React.CSSProperties}
                                >
                                  {pattern.map((filled, cellIdx) => (
                                    <span
                                      key={cellIdx}
                                      className={filled ? "block-cell" : "block-cell empty"}
                                    />
                                  ))}
                                </span>
                              );
                            })
                          )}
                        </span>
                      </div>

                      <div className="bar-meta">
                        <strong className="bar-value">
                          {String(item.displayValue).padStart(2, "0")}
                        </strong>
                        <span className="bar-label">{item.month}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Footer Controls */}
          <footer className="chart-footer mt-2">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                {platform === "github"
                  ? "ONE PILE = ONE MONTH • SCALED TO HEATMAP DENSITY"
                  : "ONE PILE = ONE MONTH • 886 SUBMISSIONS • 305 ACTIVE DAYS"}
              </span>
              <a
                href={
                  platform === "github"
                    ? "https://github.com/Suman-990"
                    : "https://leetcode.com/u/Suman_990/"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
              >
                <span>View Live Profile</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <button
              type="button"
              onClick={handleReplay}
              title="Re-run the initial falling block cascade animation"
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-current shrink-0" />
              <span>REPLAY CASCADE</span>
            </button>
          </footer>
        </main>
      </div>
    </section>
  );
}
