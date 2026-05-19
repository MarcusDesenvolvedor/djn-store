/**
 * Fiscal/calendar semantics for BRT (America/Sao_Paulo, fixed UTC−3 — no DST).
 * Used by admin sales aggregates that must match Brazilian “dia corrente”.
 */

export function formatBrazilDateYmd(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

/** Interpret YYYY-MM-DD as midnight BRT. */
export function brazilMidnightUtc(ymd: string): Date {
  return new Date(`${ymd}T00:00:00-03:00`);
}

/** Inclusive BRT calendar day `[startUtc, nextDayStartUtc)` for the given BRT YMD. */
export function brazilDayRangeUtc(ymd: string): { startUtc: Date; endUtcExclusive: Date } {
  const startUtc = brazilMidnightUtc(ymd);
  const endUtcExclusive = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  return { startUtc, endUtcExclusive };
}

/** Last N BRT calendar days ending at today (Brazil), chronological (oldest → newest); length N. */
export function listLastBrazilYmdOldestFirst(clock: Date, count: number): string[] {
  const todayYmd = formatBrazilDateYmd(clock);
  let cursor = brazilMidnightUtc(todayYmd);
  const newestFirstStack: string[] = [];
  for (let i = 0; i < count; i++) {
    newestFirstStack.push(formatBrazilDateYmd(cursor));
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }
  return newestFirstStack.reverse();
}
