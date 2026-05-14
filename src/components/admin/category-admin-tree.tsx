"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, JSX, SetStateAction } from "react";
import { useState } from "react";
import {
  createAdminCategoryBodySchema,
  patchAdminCategoryBodySchema,
} from "@/features/category-admin/category-admin.schema";
import type { CategoryAdminTreeSerializable } from "@/features/category-admin/category-admin.types";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { describeUnknownError } from "@/lib/error-message";
import { refreshClientRouter } from "@/lib/safe-router-refresh";

/** Botões de ação na linha da árvore (ícone + quadrado). */
const treeActionIcon =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-40";

export type CategoryAdminTreeProps = {
  roots: CategoryAdminTreeSerializable[];
};

export function CategoryAdminTree({ roots }: CategoryAdminTreeProps) {
  const router = useRouter();
  /** Ramos iniciam recolhidos (`true` apenas para nós explicitamente expandidos). */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showRootPanel, setShowRootPanel] = useState(false);
  const [addChildUnderId, setAddChildUnderId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function toggleExpanded(id: string): void {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function afterMutation(): void {
    setShowRootPanel(false);
    setAddChildUnderId(null);
    setEditingId(null);
    refreshClientRouter(router);
  }

  const hasRoots = roots.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowRootPanel((s) => !s)}
          className="micro-chamfer bg-on-surface px-5 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary"
        >
          {showRootPanel ? "Ocultar formulário" : "Adicionar categoria raiz"}
        </button>
      </div>

      {showRootPanel ? (
        <CategoryCreateInlineForm
          subtitle="Nova categoria de nível 0 — sem pai."
          onCancel={() => setShowRootPanel(false)}
          submitLabel="Criar raiz"
          resolvePayload={(name, imageUrl) => ({ name, imageUrl, parentId: undefined })}
          onSaved={afterMutation}
        />
      ) : null}

      {!hasRoots && !showRootPanel ? (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-14 text-center">
          <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
            account_tree
          </span>
          <p className="font-body text-body text-on-surface-variant">
            Nenhuma categoria — use “Adicionar categoria raiz” para iniciar a árvore.
          </p>
        </div>
      ) : null}

      {hasRoots ? (
        <div className="overflow-x-auto rounded border border-outline-variant">
          <ul className="m-0 list-none p-0">
            {roots.map((node) => (
              <CategoryTreeBranch
                key={node.id}
                node={node}
                depth={0}
                expanded={expanded}
                toggleExpanded={toggleExpanded}
                addChildUnderId={addChildUnderId}
                setAddChildUnderId={setAddChildUnderId}
                editingId={editingId}
                setEditingId={setEditingId}
                afterMutation={afterMutation}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type CategoryTreeBranchProps = {
  node: CategoryAdminTreeSerializable;
  depth: number;
  expanded: Record<string, boolean>;
  toggleExpanded: (id: string) => void;
  addChildUnderId: string | null;
  setAddChildUnderId: Dispatch<SetStateAction<string | null>>;
  editingId: string | null;
  setEditingId: Dispatch<SetStateAction<string | null>>;
  afterMutation: () => void;
};

function CategoryTreeBranch({
  node,
  depth,
  expanded,
  toggleExpanded,
  addChildUnderId,
  setAddChildUnderId,
  editingId,
  setEditingId,
  afterMutation,
}: CategoryTreeBranchProps): JSX.Element {
  const hasKids = node.children.length > 0;
  const isOpen = expanded[node.id] === true;
  /** Painéis abaixo da linha somem quando o ramo com filhos está recolhido (como a lista de filhos). */
  const showBranchPanels = !hasKids || isOpen;
  const paddingLeftPx = 8 + depth * 20;

  function handleToggleBranch(): void {
    if (hasKids && isOpen) {
      setAddChildUnderId((cur) => (cur === node.id ? null : cur));
      setEditingId((cur) => (cur === node.id ? null : cur));
    }
    toggleExpanded(node.id);
  }

  return (
    <li className="border-b border-outline-variant/70 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2 py-3 pr-3" style={{ paddingLeft: paddingLeftPx }}>
        {hasKids ? (
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={handleToggleBranch}
            title={isOpen ? "Recolher" : "Expandir"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform ${isOpen ? "rotate-90" : ""}`}
              aria-hidden
            >
              chevron_right
            </span>
          </button>
        ) : (
          <span className="inline-block h-8 w-8 shrink-0" aria-hidden />
        )}

        <div className="flex min-w-[36px] shrink-0">
          {node.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- URLs arbitrárias do admin
            <img
              src={node.imageUrl}
              alt=""
              className="h-9 w-9 rounded border border-outline-variant object-cover"
            />
          ) : (
            <span
              className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-outline-variant text-outline-variant"
              title="Sem imagem"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                image
              </span>
            </span>
          )}
        </div>

        <div className="min-w-[120px] flex-1">
          <p className="font-body-sm font-medium leading-snug text-on-surface">{node.name}</p>
          <p className="font-meta-mono text-meta-mono uppercase tracking-wide text-on-surface-variant">
            nível {depth} · {node.productCount} produto{node.productCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setAddChildUnderId((cur) => (cur === node.id ? null : node.id));
              setEditingId(null);
            }}
            title="Adicionar subcategoria"
            aria-label="Adicionar subcategoria"
            aria-pressed={addChildUnderId === node.id}
            className={`${treeActionIcon} ${addChildUnderId === node.id ? "border-primary text-primary" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden>
              post_add
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId((cur) => (cur === node.id ? null : node.id));
              setAddChildUnderId(null);
            }}
            title="Editar nome e imagem"
            aria-label="Editar nome e imagem"
            aria-pressed={editingId === node.id}
            className={`${treeActionIcon} ${editingId === node.id ? "border-primary text-primary" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden>
              edit
            </span>
          </button>
          <CategoryDeleteButton
            categoryId={node.id}
            categoryName={node.name}
            productCount={node.productCount}
            childCount={node.childCount}
          />
        </div>
      </div>

      {addChildUnderId === node.id && showBranchPanels ? (
        <div className="border-t border-outline-variant/50 bg-surface-container-lowest/50 px-3 py-4">
          <CategoryCreateInlineForm
            subtitle="Subcategoria — será criada logo abaixo deste nível na árvore."
            submitLabel="Criar subcategoria"
            onCancel={() => setAddChildUnderId(null)}
            resolvePayload={(name, imageUrl) => ({
              name,
              imageUrl,
              parentId: node.id,
            })}
            onSaved={afterMutation}
          />
        </div>
      ) : null}

      {editingId === node.id && showBranchPanels ? (
        <div className="border-t border-outline-variant/50 bg-surface-container-lowest/60 px-3 py-4">
          <CategoryEditInlineForm
            categoryId={node.id}
            initialName={node.name}
            initialImageUrl={node.imageUrl ?? ""}
            onCancel={() => setEditingId(null)}
            onSaved={afterMutation}
          />
        </div>
      ) : null}

      {hasKids && isOpen ? (
        <ul className="m-0 list-none p-0">
          {node.children.map((child) => (
            <CategoryTreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggleExpanded={toggleExpanded}
              addChildUnderId={addChildUnderId}
              setAddChildUnderId={setAddChildUnderId}
              editingId={editingId}
              setEditingId={setEditingId}
              afterMutation={afterMutation}
            />
          ))}
        </ul>
      ) : null}

    </li>
  );
}

type CategoryCreateInlineFormProps = {
  subtitle: string;
  submitLabel: string;
  onCancel: () => void;
  onSaved: () => void;
  resolvePayload: (name: string, imageUrl: string) => CreateAdminCategoryPayload;
};

/** Match createAdminCategoryBodySchema parentId optional */
type CreateAdminCategoryPayload = {
  name: string;
  imageUrl: string | null;
  parentId?: string;
};

function CategoryCreateInlineForm({
  subtitle,
  submitLabel,
  onCancel,
  onSaved,
  resolvePayload,
}: CategoryCreateInlineFormProps): JSX.Element {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(): Promise<void> {
    const payloadRaw = resolvePayload(name.trim(), imageUrlInput.trim() === "" ? "" : imageUrlInput.trim());
    const parsed = createAdminCategoryBodySchema.safeParse(payloadRaw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      let body: { error?: string } = {};
      try {
        body = (await res.json()) as { error?: string };
      } catch {
        body = {};
      }
      setPending(false);
      if (!res.ok) {
        setError(body.error ?? "Não foi possível criar");
        return;
      }
      setName("");
      setImageUrlInput("");
      refreshClientRouter(router);
      onSaved();
    } catch (err: unknown) {
      setPending(false);
      setError(describeUnknownError(err));
    }
  }

  return (
    <div className="rounded border border-outline-variant bg-background/60 p-4 md:p-5">
      <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
      {error ? (
        <div className="mt-3 rounded border border-outline-variant bg-surface-container px-4 py-2 font-body-sm text-error">
          {error}
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-4">
        <div className="space-y-2">
          <label className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
            placeholder="Ex.: Eletrônicos"
          />
        </div>
        <div className="space-y-2">
          <label className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Imagem (URL)
          </label>
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            autoComplete="off"
            placeholder="https://…"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded border border-outline-variant px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            void onSubmit().catch((reason: unknown) => {
              setPending(false);
              setError(describeUnknownError(reason));
            });
          }}
          className="micro-chamfer bg-on-surface px-6 py-2 font-button text-button text-surface transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Salvando…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

function CategoryEditInlineForm({
  categoryId,
  initialName,
  initialImageUrl,
  onCancel,
  onSaved,
}: {
  categoryId: string;
  initialName: string;
  initialImageUrl: string;
  onCancel: () => void;
  onSaved: () => void;
}): JSX.Element {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [imageUrlInput, setImageUrlInput] = useState(initialImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(): Promise<void> {
    const parsed = patchAdminCategoryBodySchema.safeParse({
      name: name.trim(),
      imageUrl: imageUrlInput.trim() === "" ? null : imageUrlInput.trim(),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      let body: { error?: string } = {};
      try {
        body = (await res.json()) as { error?: string };
      } catch {
        body = {};
      }
      setPending(false);
      if (!res.ok) {
        setError(body.error ?? "Não foi possível salvar");
        return;
      }
      refreshClientRouter(router);
      onSaved();
    } catch (err: unknown) {
      setPending(false);
      setError(describeUnknownError(err));
    }
  }

  return (
    <div className="rounded border border-outline-variant bg-background/70 p-4 md:p-5">
      <p className="font-body-sm text-body-sm text-on-surface-variant">Editar categoria.</p>
      {error ? (
        <div className="mt-3 rounded border border-outline-variant bg-surface-container px-4 py-2 font-body-sm text-error">
          {error}
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-4">
        <div className="space-y-2">
          <label className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
        </div>
        <div className="space-y-2">
          <label className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Imagem (URL)
          </label>
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            autoComplete="off"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="rounded border border-outline-variant px-4 py-2 font-button text-button text-on-surface-variant hover:bg-surface-container"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            void onSubmit().catch((reason: unknown) => {
              setPending(false);
              setError(describeUnknownError(reason));
            });
          }}
          className="micro-chamfer bg-on-surface px-6 py-2 font-button text-button text-surface transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}
