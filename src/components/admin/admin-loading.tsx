import type { ReactElement } from "react";

type AdminInlineSpinnerProps = Readonly<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export function AdminInlineSpinner({ className = "", ...rest }: AdminInlineSpinnerProps): ReactElement {
  return (
    <span
      {...rest}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`}
    />
  );
}

type AdminFormBusyOverlayProps = Readonly<{
  message: string;
  /** Screen reader announcement (distinct from visible message when needed). */
  label?: string;
}>;

export function AdminFormBusyOverlay({ message, label }: AdminFormBusyOverlayProps): ReactElement {
  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-background/80 backdrop-blur-[2px]"
      role="status"
      aria-busy="true"
      aria-label={label ?? message}
      aria-live="polite"
    >
      <AdminInlineSpinner className="h-9 w-9 border-[3px]" aria-hidden />
      <p className="max-w-[20rem] px-4 text-center font-body-sm text-body-sm text-on-surface">{message}</p>
    </div>
  );
}
