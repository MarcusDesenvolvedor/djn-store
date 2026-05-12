"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { describeUnknownError } from "@/lib/error-message";
import { refreshClientRouter } from "@/lib/safe-router-refresh";

export type CategoryDeleteButtonProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
  childCount: number;
};

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  productCount,
  childCount,
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
        className="rounded border border-outline-variant px-3 py-1.5 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant"
      >
        {pending ? "…" : "Excluir"}
      </button>
      {error ? <p className="max-w-[200px] text-right font-body-sm text-body-sm text-error">{error}</p> : null}
    </div>
  );
}
