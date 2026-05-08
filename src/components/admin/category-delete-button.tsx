"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { describeUnknownError } from "@/lib/error-message";
import { refreshClientRouter } from "@/lib/safe-router-refresh";

export type CategoryDeleteButtonProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
};

export function CategoryDeleteButton({ categoryId, categoryName, productCount }: CategoryDeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blocked = productCount > 0;

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
        disabled={blocked || pending}
        title={
          blocked
            ? "Remova ou mova os produtos desta categoria antes de excluir."
            : "Excluir categoria"
        }
        className="rounded border border-outline-variant px-3 py-1.5 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant"
      >
        {pending ? "…" : "Excluir"}
      </button>
      {error ? <p className="max-w-[200px] text-right font-body-sm text-body-sm text-error">{error}</p> : null}
    </div>
  );
}
