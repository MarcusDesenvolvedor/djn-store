"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FocusEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CategoryPickerModal } from "@/components/admin/category-picker-modal";
import { ProductRichTextEditor } from "@/components/admin/product-rich-text-editor";
import type { CategoryAdminTreeSerializable } from "@/features/category-admin/category-admin.types";
import {
  PRODUCT_ORIGIN_VALUES,
  createAdminProductBodySchema,
  type AdminProductVariantFormRow,
  type CreateAdminProductFormValues,
} from "@/features/product-admin/product-admin.schema";
import { describeUnknownError } from "@/lib/error-message";
import { refreshClientRouter } from "@/lib/safe-router-refresh";

const ORIGIN_LABELS: Record<(typeof PRODUCT_ORIGIN_VALUES)[number], string> = {
  NATIONAL: "Nacional",
  IMPORTED: "Importado",
  OTHER: "Outros",
};

type MediaRow = {
  tempId: string;
  file?: File;
  previewUrl?: string;
  url: string;
  altText: string;
  isPrimary: boolean;
};

function FormSection({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-4 border-t border-outline-variant pt-8 first:border-t-0 first:pt-0">
      <div>
        <h3 className="font-h3 text-h3 text-on-surface">{title}</h3>
        {description ? (
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function generateTempId(): string {
  return typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyVariantRow(): AdminProductVariantFormRow {
  return {
    tempId: generateTempId(),
    combination: "",
    sku: "",
    salePrice: null,
    stock: 0,
  };
}

/** Avoids `05` when replacing default `0` in controlled `<input type="number">`. */
function selectAllOnNumberFocus(event: FocusEvent<HTMLInputElement>): void {
  event.currentTarget.select();
}

export function ProductCreateForm() {
  const router = useRouter();
  const [categoryTree, setCategoryTree] = useState<CategoryAdminTreeSerializable[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryPathLabel, setCategoryPathLabel] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([]);
  const [variantRows, setVariantRows] = useState<AdminProductVariantFormRow[]>([]);
  const longHtmlRef = useRef<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminProductFormValues>({
    defaultValues: {
      categoryId: "",
      name: "",
      shortDescription: "",
      longDescriptionRich: "",
      price: 1,
      costPrice: null,
      promoPrice: null,
      promoEndsAt: "",
      stock: 0,
      minStockAlert: null,
      origin: "NATIONAL",
      brand: "",
      isActive: true,
    },
  });

  const categoryIdVal = watch("categoryId");

  const activeVariantPayloadRows = useMemo(
    () => variantRows.filter((r) => r.combination.trim().length > 0),
    [variantRows],
  );

  const variantStockSum = useMemo(
    () =>
      activeVariantPayloadRows.reduce((acc, r) => {
        const n = Number(r.stock);
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0),
    [activeVariantPayloadRows],
  );

  useEffect(() => {
    if (activeVariantPayloadRows.length === 0) {
      return;
    }
    setValue("stock", variantStockSum, { shouldDirty: true, shouldValidate: true });
  }, [activeVariantPayloadRows.length, setValue, variantStockSum]);

  const priceVal = watch("price");
  const costVal = watch("costPrice");

  const marginPct = useMemo(() => {
    if (costVal === null || costVal === undefined || costVal <= 0) {
      return null;
    }
    const sale = Number(priceVal);
    if (!Number.isFinite(sale)) {
      return null;
    }
    return ((sale - costVal) / costVal) * 100;
  }, [costVal, priceVal]);

  useEffect(() => {
    let cancelled = false;
    setLoadingCats(true);
    setCategoriesError(null);

    void fetch("/api/admin/categories")
      .then(async (res) => {
        const body = (await res.json()) as {
          data?: CategoryAdminTreeSerializable[];
          error?: string;
        };
        if (!res.ok) {
          throw new Error(body.error ?? "Erro ao carregar categorias");
        }
        if (!cancelled) {
          setCategoryTree(body.data ?? []);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setCategoriesError(describeUnknownError(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCats(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addMediaFromFiles = useCallback((files: readonly File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      return;
    }
    setMediaRows((rows) => {
      const next = [...rows];
      for (const file of imageFiles) {
        next.push({
          tempId: generateTempId(),
          file,
          previewUrl: URL.createObjectURL(file),
          url: "",
          altText: "",
          isPrimary: false,
        });
      }
      if (!next.some((r) => r.isPrimary) && next.length > 0) {
        const first = next[0];
        if (first) {
          next[0] = { ...first, isPrimary: true };
        }
      }
      return next;
    });
  }, []);

  const removeMediaRow = useCallback((tempId: string) => {
    setMediaRows((rows) => {
      const row = rows.find((r) => r.tempId === tempId);
      if (row?.previewUrl) {
        URL.revokeObjectURL(row.previewUrl);
      }
      const filtered = rows.filter((r) => r.tempId !== tempId);
      if (filtered.length > 0 && !filtered.some((r) => r.isPrimary)) {
        return filtered.map((r, i) => ({ ...r, isPrimary: i === 0 }));
      }
      return filtered;
    });
  }, []);

  const setMediaPrimary = useCallback((tempId: string) => {
    setMediaRows((rows) => rows.map((r) => ({ ...r, isPrimary: r.tempId === tempId })));
  }, []);

  const updateMediaRow = useCallback((tempId: string, patch: Partial<Pick<MediaRow, "url" | "altText">>) => {
    setMediaRows((rows) => rows.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)));
  }, []);

  const appendUrlOnlyRow = useCallback(() => {
    setMediaRows((rows) => {
      const next: MediaRow[] = [
        ...rows,
        { tempId: generateTempId(), url: "", altText: "", isPrimary: false },
      ];
      if (!next.some((r) => r.isPrimary) && next.length > 0) {
        const first = next[0];
        if (first) {
          next[0] = { ...first, isPrimary: true };
        }
      }
      return next;
    });
  }, []);

  const appendVariantRow = useCallback(() => {
    setVariantRows((rows) => [...rows, emptyVariantRow()]);
  }, []);

  const removeVariantRow = useCallback((tempId: string) => {
    setVariantRows((rows) => rows.filter((r) => r.tempId !== tempId));
  }, []);

  const patchVariantRow = useCallback((tempId: string, patch: Partial<AdminProductVariantFormRow>) => {
    setVariantRows((rows) => rows.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)));
  }, []);

  const onValidatedSubmit = handleSubmit((values) => {
    setSubmitError(null);
    clearErrors();

    const danglingLocal = mediaRows.some((r) => r.file !== undefined && r.url.trim().length === 0);
    if (danglingLocal) {
      setSubmitError(
        "Há imagens apenas locais sem URL pública. Publique em um CDN ou storage e cole o link — upload direto ainda não está integrado.",
      );
      return;
    }

    const strayVariantNeedsCombo = variantRows.some((r) => {
      const comboEmpty = r.combination.trim().length === 0;
      const hasSignal =
        r.stock > 0 ||
        r.sku.trim().length > 0 ||
        (r.salePrice !== null && r.salePrice !== undefined && Number(r.salePrice) > 0);
      return comboEmpty && hasSignal;
    });
    if (strayVariantNeedsCombo) {
      setSubmitError(
        "Variantes com estoque ou SKU/preço precisam de uma combinação (rótulo). Remova linhas em branco ou preencha o texto.",
      );
      return;
    }

    const imageAssets = mediaRows
      .map((r) => ({
        url: r.url.trim(),
        altText: r.altText.trim().length > 0 ? r.altText.trim() : null,
        isPrimary: r.isPrimary,
      }))
      .filter((r) => r.url.length > 0);

    const variantsPayload = activeVariantPayloadRows.map((r) => ({
      sku: r.sku.trim().length === 0 ? null : r.sku.trim().slice(0, 80),
      attributes: { combo: r.combination.trim().slice(0, 120) },
      salePrice: r.salePrice,
      stock: r.stock,
    }));

    const parsed = createAdminProductBodySchema.safeParse({
      ...values,
      longDescriptionRich: longHtmlRef.current.length > 0 ? longHtmlRef.current : values.longDescriptionRich,
      brand: values.brand.trim().length > 0 ? values.brand.trim() : null,
      promoEndsAt: values.promoEndsAt.trim().length === 0 ? null : values.promoEndsAt,
      imageAssets,
      variants: variantsPayload,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const path0 = issue?.path[0];
      if (typeof path0 === "string") {
        setError(path0 as keyof CreateAdminProductFormValues, {
          type: "manual",
          message: issue.message,
        });
      }
      setSubmitError(issue?.message ?? "Dados inválidos");
      return;
    }

    void (async () => {
      try {
        const res = await fetch("/api/admin/products", {
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
        if (!res.ok) {
          setSubmitError(body.error ?? "Não foi possível criar o produto");
          return;
        }
        void Promise.resolve(router.push("/admin/produtos")).catch(() => undefined);
        refreshClientRouter(router);
      } catch (err: unknown) {
        setSubmitError(describeUnknownError(err));
      }
    })();
  });

  const categoryPickerDisabled = loadingCats || categoriesError !== null;

  const stockLockedByVariants = activeVariantPayloadRows.length > 0;

  return (
    <>
      <CategoryPickerModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        tree={categoryTree}
        selectedCategoryId={categoryIdVal}
        loading={loadingCats}
        loadError={categoriesError}
        onSelectLeaf={(id, displayPath) => {
          setValue("categoryId", id, { shouldDirty: true, shouldValidate: true });
          setCategoryPathLabel(displayPath);
        }}
      />

      <form
        onSubmit={(e) => {
          try {
            void Promise.resolve(onValidatedSubmit(e)).catch((reason: unknown) => {
              setSubmitError(describeUnknownError(reason));
            });
          } catch (reason: unknown) {
            setSubmitError(describeUnknownError(reason));
          }
        }}
        className="space-y-10 rounded border border-outline-variant bg-surface-container-lowest p-6 md:p-8"
        noValidate
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-h3 text-h3 text-on-surface">Novo produto</h2>
            <p className="mt-1 max-w-prose font-body-sm text-body-sm text-on-surface-variant">
              Cadastro para catálogo (preços, mídia com imagem principal, descrição longa em rich text). SKU principal é
              sempre gerado no servidor. Use categorias folha via modal e variantes opcionais para combinações com estoque
              próprio.
            </p>
          </div>
          <Link
            href="/admin/produtos"
            className="font-body-sm text-body-sm text-on-surface-variant underline-offset-4 transition-colors hover:text-on-surface hover:underline"
          >
            Voltar à lista
          </Link>
        </div>

        {submitError ? (
          <div className="rounded border border-outline-variant bg-surface-container px-4 py-3 font-body-sm text-body-sm text-error">
            {submitError}
          </div>
        ) : null}

        <FormSection
          title="Informações básicas"
          description="Título em destaque, categoria folha e texto para vitrine."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="name"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Nome / título <span className="text-error">*</span>
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="Nome comercial do item"
                className="w-full rounded border border-outline-variant bg-background px-3 py-3 text-lg font-semibold text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
              {errors.name ? <p className="font-body-sm text-body-sm text-error">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                Categoria / departamento <span className="text-error">*</span>
              </span>
              <input type="hidden" {...register("categoryId")} />
              <button
                type="button"
                disabled={categoryPickerDisabled}
                onClick={() => {
                  setCategoryModalOpen(true);
                }}
                className="flex w-full items-center justify-between gap-3 rounded border border-outline-variant bg-background px-3 py-3 text-left font-body text-body text-on-surface outline-none ring-primary transition-colors hover:border-primary focus:border-transparent focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={categoryPathLabel.length > 0 ? "text-on-surface" : "text-on-surface-variant"}>
                  {loadingCats
                    ? "Carregando categorias…"
                    : categoryPathLabel.length > 0
                      ? categoryPathLabel
                      : "Toque para escolher uma categoria folha…"}
                </span>
                <span className="material-symbols-outlined shrink-0 text-[22px] text-on-surface-variant" aria-hidden>
                  expand_more
                </span>
              </button>
              {categoriesError ? (
                <p className="font-body-sm text-body-sm text-error">{categoriesError}</p>
              ) : null}
              {errors.categoryId ? (
                <p className="font-body-sm text-body-sm text-error">{errors.categoryId.message}</p>
              ) : null}
              {!loadingCats && categoryTree.length === 0 && !categoriesError ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nenhuma categoria cadastrada — crie ao menos uma em Categorias antes de adicionar produtos.
                </p>
              ) : null}
              {!loadingCats && categoryTree.length > 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Somente nós folha são válidos para produto; o servidor também bloqueia categorias intermediárias.
                </p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="shortDescription"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Descrição curta <span className="text-error">*</span>
              </label>
              <textarea
                id="shortDescription"
                {...register("shortDescription")}
                rows={3}
                placeholder="Resumo para listagens e SEO"
                className="w-full resize-y rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
              {errors.shortDescription ? (
                <p className="font-body-sm text-body-sm text-error">{errors.shortDescription.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="long-rich"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Descrição longa (rich text)
              </label>
              <ProductRichTextEditor
                id="long-rich"
                disabled={isSubmitting}
                onHtmlChange={(html) => {
                  longHtmlRef.current = html;
                  setValue("longDescriptionRich", html, { shouldDirty: true });
                }}
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Editor leve (negrito, listas, cabeçalhos). O HTML é sanitizado no servidor.
              </p>
              {errors.longDescriptionRich ? (
                <p className="font-body-sm text-body-sm text-error">{errors.longDescriptionRich.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="origin" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                Origem do produto
              </label>
              <select
                id="origin"
                {...register("origin")}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              >
                {PRODUCT_ORIGIN_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {ORIGIN_LABELS[v]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Preços"
          description="Valores exibidos e margem aproximada para o time (custo só na área admin)."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="price" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                Preço de venda <span className="text-error">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
                onFocus={selectAllOnNumberFocus}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
              {errors.price ? <p className="font-body-sm text-body-sm text-error">{errors.price.message}</p> : null}
            </div>

            <div className="space-y-2 rounded border border-dashed border-outline-variant bg-background/40 p-4">
              <label htmlFor="costPrice" className="font-meta-mono text-meta-mono uppercase tracking-widest text-error">
                Preço de custo (somente admin)
              </label>
              <input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={costVal ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  setValue("costPrice", raw === "" ? null : Number(raw), { shouldDirty: true });
                }}
                onFocus={selectAllOnNumberFocus}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
              {marginPct !== null ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Margem sobre custo:{" "}
                  <span className="tabular-nums font-semibold text-on-surface">{marginPct.toFixed(1)}%</span>
                </p>
              ) : (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Informe custo &gt; 0 e preço de venda para ver markup aproximado.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="promoPrice"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Preço promocional
              </label>
              <input
                id="promoPrice"
                type="number"
                step="0.01"
                min="0"
                value={watch("promoPrice") ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  setValue("promoPrice", raw === "" ? null : Number(raw), { shouldDirty: true });
                }}
                onFocus={selectAllOnNumberFocus}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
              {errors.promoPrice ? (
                <p className="font-body-sm text-body-sm text-error">{errors.promoPrice.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="promoEndsAt"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Validade da promoção
              </label>
              <input
                id="promoEndsAt"
                type="datetime-local"
                {...register("promoEndsAt")}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Inventário" description="Estoque consolidado ou repartido pelas variantes abaixo.">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="stock" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                Estoque atual <span className="text-error">*</span>
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                step="1"
                {...register("stock", { valueAsNumber: true })}
                onFocus={selectAllOnNumberFocus}
                disabled={stockLockedByVariants}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1 disabled:cursor-not-allowed disabled:opacity-70"
              />
              {stockLockedByVariants ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Somente leitura: estoque igual à soma das variantes preenchidas ({variantStockSum} un.).
                </p>
              ) : null}
              {errors.stock ? <p className="font-body-sm text-body-sm text-error">{errors.stock.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="minStockAlert"
                className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
              >
                Estoque mínimo (alerta)
              </label>
              <input
                id="minStockAlert"
                type="number"
                min="0"
                step="1"
                value={watch("minStockAlert") ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  setValue("minStockAlert", raw === "" ? null : Number(raw), { shouldDirty: true });
                }}
                onFocus={selectAllOnNumberFocus}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Galeria de mídia"
          description="Arraste imagens para pré-visualizar; a persistência hoje exige URL http(s) pública por linha (upload ao bucket ainda não ligado)."
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              addMediaFromFiles([...e.dataTransfer.files]);
            }}
            className="rounded border border-dashed border-outline-variant bg-background/50 px-4 py-8 text-center"
          >
            <p className="font-body-sm text-body-sm text-on-surface">
              Arraste imagens aqui ou use &quot;Escolher arquivos&quot; / &quot;Adicionar só URL&quot;.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <label className="micro-chamfer inline-flex cursor-pointer items-center gap-2 border border-outline-variant bg-surface-container-lowest px-4 py-2 font-button text-button text-on-surface transition-colors hover:border-primary">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const list = e.target.files;
                    if (list && list.length > 0) {
                      addMediaFromFiles([...list]);
                    }
                    e.target.value = "";
                  }}
                />
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  upload
                </span>
                Escolher arquivos
              </label>
              <button
                type="button"
                onClick={() => {
                  appendUrlOnlyRow();
                }}
                className="micro-chamfer inline-flex items-center gap-2 border border-outline-variant px-4 py-2 font-button text-button text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  link
                </span>
                Adicionar linha por URL
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mediaRows.length === 0 ? (
              <p className="rounded border border-outline-variant bg-background/50 px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                Nenhuma mídia — adicione por URL ou arquivo (arquivo exige URL pública antes de salvar).
              </p>
            ) : (
              mediaRows.map((row, index) => (
                <div
                  key={row.tempId}
                  className="flex flex-col gap-3 rounded border border-outline-variant bg-background/30 p-4 md:flex-row"
                >
                  <div className="flex shrink-0 items-start gap-3">
                    <div className="relative h-24 w-24 overflow-hidden rounded border border-outline-variant bg-surface-container-lowest">
                      {row.previewUrl || (row.url.trim().length > 0 && row.url.startsWith("http")) ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin preview / arbitrary URLs
                        <img src={row.previewUrl ?? row.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[32px]" aria-hidden>
                            image
                          </span>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                      <input
                        type="radio"
                        name="primary-image"
                        checked={row.isPrimary}
                        onChange={() => {
                          setMediaPrimary(row.tempId);
                        }}
                        className="h-4 w-4 border-outline-variant"
                      />
                      Principal
                    </label>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="sr-only" htmlFor={`url-${row.tempId}`}>
                      URL da imagem {index + 1}
                    </label>
                    <input
                      id={`url-${row.tempId}`}
                      type="text"
                      value={row.url}
                      onChange={(e) => {
                        updateMediaRow(row.tempId, { url: e.target.value });
                      }}
                      placeholder="https://… (obrigatório para salvar)"
                      autoComplete="off"
                      className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
                    />
                    <label className="sr-only" htmlFor={`alt-${row.tempId}`}>
                      Texto alternativo {index + 1}
                    </label>
                    <input
                      id={`alt-${row.tempId}`}
                      type="text"
                      value={row.altText}
                      onChange={(e) => {
                        updateMediaRow(row.tempId, { altText: e.target.value });
                      }}
                      placeholder="Texto alternativo (acessibilidade)"
                      className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeMediaRow(row.tempId);
                      }}
                      className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant underline-offset-2 hover:text-error hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </FormSection>

        <FormSection
          title="Variações"
          description="Opcional — cada linha vira uma variante persistida com estoque próprio (preço opcional por linha)."
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                appendVariantRow();
              }}
              className="micro-chamfer inline-flex items-center gap-2 border border-outline-variant px-4 py-2 font-button text-button text-on-surface transition-colors hover:border-primary"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                add
              </span>
              Adicionar variante
            </button>
            {variantRows.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setVariantRows([]);
                }}
                className="font-body-sm text-body-sm text-on-surface-variant underline-offset-2 hover:text-error hover:underline"
              >
                Limpar grade
              </button>
            ) : null}
          </div>

          {variantRows.length === 0 ? (
            <p className="rounded border border-outline-variant bg-background/40 px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
              Sem variantes — o produto usa apenas o estoque consolidado acima.
            </p>
          ) : (
            <div className="overflow-x-auto rounded border border-outline-variant">
              <table className="w-full min-w-[640px] border-collapse text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="border-b border-outline-variant bg-background/40 text-on-surface-variant">
                    <th className="py-3 pl-4 pr-3 font-semibold">Combinação</th>
                    <th className="py-3 pr-3 font-semibold">SKU variante</th>
                    <th className="py-3 pr-3 font-semibold">Preço (opcional)</th>
                    <th className="py-3 pr-3 font-semibold">Estoque</th>
                    <th className="py-3 pr-4 font-semibold"> </th>
                  </tr>
                </thead>
                <tbody className="text-on-surface">
                  {variantRows.map((row) => (
                    <tr key={row.tempId} className="border-b border-outline-variant/70">
                      <td className="py-3 pl-4 pr-3 align-top">
                        <label className="sr-only" htmlFor={`vc-${row.tempId}`}>
                          Combinação
                        </label>
                        <input
                          id={`vc-${row.tempId}`}
                          type="text"
                          value={row.combination}
                          onChange={(e) => {
                            patchVariantRow(row.tempId, { combination: e.target.value });
                          }}
                          placeholder="Ex.: PoE 2 — SSF Hardcore"
                          className="w-full min-w-[200px] rounded border border-outline-variant bg-background px-2 py-2 outline-none ring-primary focus:border-transparent focus:ring-1"
                        />
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <label className="sr-only" htmlFor={`vs-${row.tempId}`}>
                          SKU da variante
                        </label>
                        <input
                          id={`vs-${row.tempId}`}
                          type="text"
                          value={row.sku}
                          onChange={(e) => {
                            patchVariantRow(row.tempId, { sku: e.target.value });
                          }}
                          placeholder="Opcional — único por produto"
                          autoComplete="off"
                          className="w-full min-w-[140px] rounded border border-outline-variant bg-background px-2 py-2 outline-none ring-primary focus:border-transparent focus:ring-1"
                        />
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <label className="sr-only" htmlFor={`vp-${row.tempId}`}>
                          Preço da variante
                        </label>
                        <input
                          id={`vp-${row.tempId}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={row.salePrice ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            patchVariantRow(row.tempId, {
                              salePrice: raw === "" ? null : Number(raw),
                            });
                          }}
                          onFocus={selectAllOnNumberFocus}
                          placeholder="—"
                          className="w-full min-w-[110px] rounded border border-outline-variant bg-background px-2 py-2 outline-none ring-primary focus:border-transparent focus:ring-1"
                        />
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <label className="sr-only" htmlFor={`vq-${row.tempId}`}>
                          Estoque da variante
                        </label>
                        <input
                          id={`vq-${row.tempId}`}
                          type="number"
                          min="0"
                          step="1"
                          value={row.stock}
                          onChange={(e) => {
                            patchVariantRow(row.tempId, {
                              stock: Number.parseInt(e.target.value, 10) || 0,
                            });
                          }}
                          onFocus={selectAllOnNumberFocus}
                          className="w-full min-w-[96px] rounded border border-outline-variant bg-background px-2 py-2 outline-none ring-primary focus:border-transparent focus:ring-1"
                        />
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <button
                          type="button"
                          onClick={() => {
                            removeVariantRow(row.tempId);
                          }}
                          className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant underline-offset-2 hover:text-error hover:underline"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FormSection>

        <FormSection title="Marca e status">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="brand" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                Marca (opcional)
              </label>
              <input
                id="brand"
                {...register("brand")}
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="h-4 w-4 rounded border-outline-variant bg-background text-on-surface"
                  />
                )}
              />
              <label htmlFor="isActive" className="font-body-sm text-body-sm text-on-surface">
                Produto ativo na vitrine
              </label>
            </div>
          </div>
        </FormSection>

        <div className="flex flex-wrap justify-end gap-3 border-t border-outline-variant pt-6">
          <Link
            href="/admin/produtos"
            className="rounded border border-outline-variant px-6 py-2.5 font-button text-button text-on-surface transition-colors hover:bg-surface-container"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="micro-chamfer bg-on-surface px-8 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Salvando…" : "Criar produto"}
          </button>
        </div>
      </form>
    </>
  );
}
