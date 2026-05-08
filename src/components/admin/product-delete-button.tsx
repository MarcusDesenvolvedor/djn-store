"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ProductDeleteButtonProps = {
  productId: number;
  productName: string;
  orderItemCount: number;
};

export function ProductDeleteButton({ productId, productName, orderItemCount }: ProductDeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blocked = orderItemCount > 0;

  async function handleDelete(): Promise<void> {
    if (blocked || pending) {
      return;
    }
    const ok = window.confirm(`Excluir o produto "${productName}"? Esta ação não pode ser desfeita.`);
    if (!ok) {
      return;
    }
    setPending(true);
    setError(null);
    const res = await fetch(`/api/admin/products/${encodeURIComponent(String(productId))}`, { method: "DELETE" });
    const body = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(body.error ?? "Não foi possível excluir");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          void handleDelete();
        }}
        disabled={blocked || pending}
        title={
          blocked
            ? "Produtos vinculados a pedidos não podem ser excluídos."
            : "Excluir produto"
        }
        className="rounded border border-outline-variant px-3 py-1.5 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant"
      >
        {pending ? "…" : "Excluir"}
      </button>
      {error ? <p className="max-w-[200px] text-right font-body-sm text-body-sm text-error">{error}</p> : null}
    </div>
  );
}
