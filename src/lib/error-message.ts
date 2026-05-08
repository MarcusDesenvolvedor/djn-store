/** Best-effort string for displaying or logging failures from unknown throws/rejections */
export function describeUnknownError(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message;
  }
  if (typeof reason === "string") {
    return reason;
  }
  if (reason instanceof ErrorEvent && reason.message) {
    return reason.message;
  }
  if (typeof reason === "object" && reason !== null && "type" in reason) {
    const t = (reason as { type: unknown }).type;
    if (typeof t === "string") {
      return `Evento de interface (${t})`;
    }
  }
  return "Erro desconhecido";
}
