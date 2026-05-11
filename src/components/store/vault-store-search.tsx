"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type SearchCategories = ReadonlyArray<{ id: string; name: string }>;
type SearchProducts = ReadonlyArray<{ id: number; name: string; categoryName: string }>;

type SearchOkBody = Readonly<{ data?: { categories: SearchCategories; products: SearchProducts } }>;

export function VaultStoreSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<SearchCategories>([]);
  const [products, setProducts] = useState<SearchProducts>([]);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(ev: MouseEvent) {
      if (!rootRef.current?.contains(ev.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length === 0) {
      setLoading(false);
      setCategories([]);
      setProducts([]);
      return;
    }

    const handle = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
          const body = (await res.json()) as SearchOkBody & { error?: string };
          if (!res.ok) {
            setCategories([]);
            setProducts([]);
            return;
          }
          const data = body.data;
          if (!data) {
            setCategories([]);
            setProducts([]);
            return;
          }
          setCategories(data.categories ?? []);
          setProducts(data.products ?? []);
        } finally {
          setLoading(false);
        }
      })();
    }, 280);

    return () => window.clearTimeout(handle);
  }, [query]);

  const hasResults = categories.length > 0 || products.length > 0;
  const term = query.trim();
  const showPanel = open && term.length > 0;

  const collapse = useCallback(() => setOpen(false), []);

  return (
    <div ref={rootRef} className="relative w-full md:w-auto">
      <div className="flex w-full items-center rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-on-surface-variant transition-colors focus-within:border-primary">
        <span className="material-symbols-outlined mr-2 shrink-0 text-[18px]" aria-hidden>
          search
        </span>
        <input
          className="w-full min-w-0 border-none bg-transparent text-body-sm placeholder-on-surface-variant/50 outline-none focus:ring-0 md:w-52"
          placeholder="Buscar produtos e categorias…"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          aria-label="Buscar produtos e categorias"
        />
        {loading ? (
          <span className="material-symbols-outlined ml-1 shrink-0 animate-pulse text-[16px]" aria-hidden>
            progress_activity
          </span>
        ) : null}
      </div>

      {showPanel ? (
        <div
          id="storefront-search-panel"
          role="region"
          aria-label="Resultados da busca"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded border border-outline-variant bg-surface-container-lowest py-2 shadow-lg md:left-auto md:right-0 md:min-w-[min(420px,calc(100vw-4rem))]"
        >
          {!hasResults && !loading ? (
            <div className="px-4 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              Nenhum resultado para esse termo.
            </div>
          ) : null}

          {categories.length > 0 ? (
            <div className="px-2 pb-2">
              <div className="px-2 py-1 font-meta-mono text-[10px] uppercase tracking-wider text-outline-variant">
                Categorias
              </div>
              <ul className="flex flex-col gap-0.5">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`#catalog-${c.id}`}
                      className="flex items-center justify-between gap-2 rounded px-2 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-container"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={collapse}
                    >
                      <span className="min-w-0 truncate">{c.name}</span>
                      <span className="material-symbols-outlined shrink-0 text-[14px] text-outline-variant" aria-hidden>
                        category
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className={`px-2 ${categories.length > 0 ? "border-t border-outline-variant pt-2" : ""}`}>
              <div className="px-2 py-1 font-meta-mono text-[10px] uppercase tracking-wider text-outline-variant">
                Produtos
              </div>
              <ul className="flex flex-col gap-0.5">
                {products.map((p) => (
                  <li key={p.id}>
                    <Link
                      prefetch={false}
                      href={`/produtos/${p.id}`}
                      className="block rounded px-2 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-container"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={collapse}
                    >
                      <span className="block truncate">{p.name}</span>
                      <span className="mt-0.5 block font-meta-mono text-[11px] uppercase tracking-wide text-on-surface-variant">
                        {p.categoryName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
