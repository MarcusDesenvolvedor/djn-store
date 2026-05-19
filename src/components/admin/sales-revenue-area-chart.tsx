"use client";

/** Accent roxo gamer (gráfico de faturamento) — diferente do token `primary` Stitch (cinza). */
const CHART_PURPLE_STROKE = "#c084fc";
const CHART_PURPLE_FILL_STOP = "#a855f7";

export type SalesRevenueAreaChartPoint = {
  /** BRT YYYY-MM-DD */
  dayYmd: string;
  revenue: number;
};

type Props = {
  readonly points: SalesRevenueAreaChartPoint[];
  readonly className?: string;
};

function buildPathD(values: readonly number[]): { fillD: string; lineD: string } {
  if (values.length === 0) {
    return { fillD: "", lineD: "" };
  }

  const w = 100;
  const h = 100;
  const padX = 2;
  const padY = 4;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  let maxVal = Math.max(...values);
  let minVal = 0;
  if (maxVal <= 0) {
    maxVal = 1;
    minVal = 0;
  }

  const n = values.length;
  const xAt = (i: number): number =>
    padX + (innerW * i) / Math.max(n - 1, 1);
  const yAt = (v: number): number => {
    const t = maxVal <= minVal ? 0 : (v - minVal) / (maxVal - minVal);
    return padY + innerH - t * innerH;
  };

  const linePts = values.map((v, i) => `${xAt(i).toFixed(2)},${yAt(v).toFixed(2)}`);
  const baselineY = padY + innerH;

  const lineD =
    linePts.length > 0 ? `M${linePts.join(" L")}` : "";
  const fillD =
    linePts.length === 0
      ? ""
      : `M${xAt(0)},${baselineY.toFixed(2)} L${linePts.join(" L")} L${xAt(n - 1)},${baselineY.toFixed(2)} Z`;

  return { fillD, lineD };
}

export function SalesRevenueAreaChart({ points, className }: Props) {
  const values = points.map((p) => p.revenue);
  const { fillD, lineD } = buildPathD(values);

  const hasPath = fillD !== "" && lineD !== "";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-h3 text-h3 text-on-surface">Faturamento (30 dias)</h2>
        <p className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
          Pagamentos confirmados · BRT
        </p>
      </div>
      <svg
        className="mt-6 h-[220px] w-full text-purple-400"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label="Área mostrando faturamento nos últimos 30 dias em reais (valores apenas visuais, sem eixo numérico fixo)."
      >
        <title>Faturamento — últimos 30 dias</title>
        <defs>
          <linearGradient id="sales-revenue-fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={CHART_PURPLE_FILL_STOP} stopOpacity={0.45} />
            <stop offset="100%" stopColor={CHART_PURPLE_FILL_STOP} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={2}
          y1={96}
          x2={98}
          y2={96}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={0.35}
          vectorEffect="non-scaling-stroke"
        />

        {hasPath ? (
          <>
            <path d={fillD} fill="url(#sales-revenue-fill-gradient)" />
            <path
              d={lineD}
              fill="none"
              stroke={CHART_PURPLE_STROKE}
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : (
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#c4c7c7" style={{ fontSize: "6px" }}>
            Sem dados no período
          </text>
        )}
      </svg>

      <div className="mt-4 flex justify-between gap-2 overflow-x-auto font-meta-mono text-[10px] uppercase tracking-wide text-on-surface-variant">
        {points.length > 1 ? (
          <>
            <span className="shrink-0 whitespace-nowrap" title={points[0]?.dayYmd}>
              {formatAxisLabel(points[0]?.dayYmd)}
            </span>
            <span className="shrink-0 whitespace-nowrap" title={points[points.length - 1]?.dayYmd}>
              {formatAxisLabel(points[points.length - 1]?.dayYmd)}
            </span>
          </>
        ) : (
          <span>Hoje</span>
        )}
      </div>
    </div>
  );
}

function formatAxisLabel(dayYmd: string | undefined): string {
  if (!dayYmd) return "—";
  const [year, month, day] = dayYmd.split("-").map(Number);
  if (
    typeof year !== "number" ||
    typeof month !== "number" ||
    typeof day !== "number"
  ) {
    return dayYmd;
  }
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const parsed = new Date(`${iso}T12:00:00.000Z`);
  return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(/\.$/, "");
}
