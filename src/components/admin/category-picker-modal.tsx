"use client";

import { useMemo, useState } from "react";
import type { CategoryAdminTreeSerializable } from "@/features/category-admin/category-admin.types";

type CategoryPickerModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tree: CategoryAdminTreeSerializable[];
  selectedCategoryId: string;
  loading?: boolean;
  loadError?: string | null;
  onSelectLeaf: (categoryId: string, displayPath: string) => void;
}>;

function flattenTreeWithPaths(
  nodes: CategoryAdminTreeSerializable[],
  parentPath: string,
): { id: string; displayPath: string; isLeaf: boolean }[] {
  const out: { id: string; displayPath: string; isLeaf: boolean }[] = [];
  for (const node of nodes) {
    const displayPath =
      parentPath.length === 0 ? node.name : `${parentPath} › ${node.name}`;
    const isLeaf = node.children.length === 0;
    out.push({ id: node.id, displayPath, isLeaf });
    if (!isLeaf) {
      out.push(...flattenTreeWithPaths(node.children, displayPath));
    }
  }
  return out;
}

export function CategoryPickerModal({
  open,
  onOpenChange,
  tree,
  selectedCategoryId,
  loading = false,
  loadError = null,
  onSelectLeaf,
}: CategoryPickerModalProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => flattenTreeWithPaths(tree, ""), [tree]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      return rows;
    }
    return rows.filter((r) => r.displayPath.toLowerCase().includes(q));
  }, [query, rows]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-picker-title"
        className="flex max-h-[min(560px,85vh)] w-full max-w-lg flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-xl"
      >
        <div className="border-b border-outline-variant px-5 py-4">
          <h2 id="category-picker-title" className="font-h3 text-h3 text-on-surface">
            Escolher categoria
          </h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Somente categorias folha (sem filhos) podem receber produto. Expanda até o último nível na lista abaixo.
          </p>
          <label htmlFor="category-picker-filter" className="sr-only">
            Filtrar categorias
          </label>
          <input
            id="category-picker-filter"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Filtrar por nome ou caminho…"
            className="mt-4 w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {loading ? (
            <p className="px-2 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              Carregando categorias…
            </p>
          ) : null}
          {loadError ? (
            <p className="px-2 py-4 font-body-sm text-body-sm text-error">{loadError}</p>
          ) : null}
          {!loading && !loadError && tree.length === 0 ? (
            <p className="px-2 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma categoria cadastrada.
            </p>
          ) : null}
          {!loading && !loadError && tree.length > 0 && filteredRows.length === 0 ? (
            <p className="px-2 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma linha corresponde ao filtro.
            </p>
          ) : null}

          <ul className="space-y-1">
            {filteredRows.map((row) => {
              const checked = selectedCategoryId === row.id && row.isLeaf;
              return (
                <li key={`${row.id}-${row.displayPath}`}>
                  <button
                    type="button"
                    disabled={!row.isLeaf}
                    onClick={() => {
                      if (!row.isLeaf) {
                        return;
                      }
                      onSelectLeaf(row.id, row.displayPath);
                      onOpenChange(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-start gap-3 rounded px-3 py-3 text-left transition-colors ${
                      row.isLeaf
                        ? "cursor-pointer hover:bg-surface-container"
                        : "cursor-not-allowed opacity-55"
                    }`}
                  >
                    <span
                      role="switch"
                      aria-checked={checked}
                      aria-disabled={!row.isLeaf}
                      className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-outline-variant transition-colors ${
                        checked ? "border-primary bg-primary/80" : "bg-background"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 translate-x-1 rounded-full bg-on-surface transition-transform ${
                          checked ? "translate-x-5 bg-surface" : ""
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-body-sm font-semibold text-on-surface">{row.displayPath}</span>
                      {!row.isLeaf ? (
                        <span className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">
                          Expanda até folha — categorias intermediárias não são selecionáveis.
                        </span>
                      ) : (
                        <span className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">
                          Toque para selecionar esta categoria (substitui a anterior).
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-end gap-3 border-t border-outline-variant px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              setQuery("");
            }}
            className="rounded border border-outline-variant px-5 py-2 font-button text-button text-on-surface transition-colors hover:bg-surface-container"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
