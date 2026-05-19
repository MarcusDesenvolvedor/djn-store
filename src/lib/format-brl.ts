/** PT-BR display for BRL totals coming from Decimal strings without currency symbol prefix. */
export function formatBrlPt(amountParseable: string | number): string {
  const n =
    typeof amountParseable === "string"
      ? Number.parseFloat(amountParseable)
      : amountParseable;
  if (!Number.isFinite(n)) return "0,00";
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
