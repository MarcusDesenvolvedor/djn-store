"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { describeUnknownError } from "@/lib/error-message";
import { refreshClientRouter } from "@/lib/safe-router-refresh";

const actionIconClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:bg-surface-container hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant";

export type CategoryDeleteButtonProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
  childCount: number;
  /** `icon` = apenas ícone (padrão na árvore); `text` = rótulo “Excluir”. */
  variant?: "icon" | "text";
};

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  productCount,
  childCount,
  variant = "icon",
}: CategoryDeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockedByProducts = productCount > 0;
  const blockedByChildren = childCount > 0;
  const blocked = blockedByProducts || blockedByChildren || pending;

  async function handleDelete(): Promise<void> {
    if (blocked || pending) {
      return;
    }
    const ok = window.confirm(`Excluir a categoria "${categoryName}"? Esta ação não pode ser desfeita.`);
    if (!ok) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}`, { method: "DELETE" });
      let body: { error?: string } = {};
      try {
        body = (await res.json()) as { error?: string };
      } catch {
        body = {};
      }
      setPending(false);
      if (!res.ok) {
        setError(body.error ?? "Não foi possível excluir");
        return;
      }
      refreshClientRouter(router);
    } catch (err: unknown) {
      setPending(false);
      setError(describeUnknownError(err));
    }
  }

  let blockTitle =
    blockedByProducts || blockedByChildren
      ? "Remova vínculos antes de excluir."
      : "Excluir categoria";

  if (blockedByProducts) {
    blockTitle = "Remova ou mova os produtos desta categoria antes de excluir.";
  } else if (blockedByChildren) {
    blockTitle =
      "Exclua primeiro as subcategorias ou mova-os para outra categoria pai.";
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          void handleDelete().catch((reason: unknown) => {
            setPending(false);
            setError(describeUnknownError(reason));
          });
        }}
        disabled={blocked}
        title={blockTitle}
        aria-label={blockTitle}
        className={
          variant === "icon"
            ? actionIconClass
            : "rounded border border-outline-variant px-3 py-1.5 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant"
        }
      >
        {variant === "icon" ? (
          <>
            <span className="sr-only">Excluir categoria</span>
            <span
              className={`material-symbols-outlined text-[20px] ${pending ? "animate-pulse opacity-70" : ""}`}
              aria-hidden
            >
              {pending ? "progress_activity" : "delete_outline"}
            </span>
          </>
        ) : pending ? (
          "…"
        ) : (
          "Excluir"
        )}
      </button>
      {error ? <p className="max-w-[200px] text-right font-body-sm text-body-sm text-error">{error}</p> : null}
    </div>
  );
}
