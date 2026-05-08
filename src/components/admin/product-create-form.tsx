"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  createAdminProductBodySchema,
  type CreateAdminProductFormValues,
} from "@/features/product-admin/product-admin.schema";
import type { Resolver } from "react-hook-form";

type CategoryOption = {
  id: string;
  name: string;
};

export function ProductCreateForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminProductFormValues>({
    resolver: zodResolver(createAdminProductBodySchema) as unknown as Resolver<CreateAdminProductFormValues>,
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      price: 1,
      stock: 0,
      brand: null,
      isActive: true,
      imageUrls: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imageUrls",
  });

  useEffect(() => {
    let cancelled = false;
    setLoadingCats(true);
    setCategoriesError(null);

    void fetch("/api/admin/categories")
      .then(async (res) => {
        const body = (await res.json()) as {
          data?: { id: string; name: string; createdAt?: string }[];
          error?: string;
        };
        if (!res.ok) {
          throw new Error(body.error ?? "Erro ao carregar categorias");
        }
        if (!cancelled) {
          setCategories(body.data ?? []);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setCategoriesError(error instanceof Error ? error.message : "Erro ao carregar categorias");
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

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSubmitError(body.error ?? "Não foi possível criar o produto");
      return;
    }
    router.push("/admin/produtos");
    router.refresh();
  });

  const categoryDisabled = loadingCats || categories.length === 0;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded border border-outline-variant bg-surface-container-lowest p-6 md:p-8"
      noValidate
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-h3 text-h3 text-on-surface">Novo produto</h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            O ID numérico do produto (1, 2, 3…) é gerado automaticamente ao salvar. Você pode anexar várias imagens por URL
            (ordem da lista = ordem de exibição sugerida). Associe uma categoria cadastrada na área de categorias.
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="categoryId"
            className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
          >
            Categoria <span className="text-error">*</span>
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            disabled={categoryDisabled}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{loadingCats ? "Carregando categorias…" : "Selecione a categoria"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoriesError ? (
            <p className="font-body-sm text-body-sm text-error">{categoriesError}</p>
          ) : null}
          {errors.categoryId ? (
            <p className="font-body-sm text-body-sm text-error">{errors.categoryId.message}</p>
          ) : null}
          {!loadingCats && categories.length === 0 && !categoriesError ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma categoria cadastrada — crie ao menos uma em Categorias antes de adicionar produtos.
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="name" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Nome do produto
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.name ? <p className="font-body-sm text-body-sm text-error">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="description"
            className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
          >
            Descrição
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={5}
            className="w-full resize-y rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.description ? (
            <p className="font-body-sm text-body-sm text-error">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Imagens do produto (URLs)
            </span>
            <button
              type="button"
              onClick={() => {
                append({ url: "" });
              }}
              className="inline-flex items-center gap-1.5 rounded border border-outline-variant px-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                add_photo_alternate
              </span>
              Adicionar imagem
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Opcional. Até 32 URLs http(s). Linhas em branco são ignoradas ao salvar.
          </p>
          {errors.imageUrls ? (
            <p className="font-body-sm text-body-sm text-error">
              {typeof errors.imageUrls.message === "string"
                ? errors.imageUrls.message
                : "Verifique as URLs das imagens."}
            </p>
          ) : null}
          <div className="space-y-2">
            {fields.length === 0 ? (
              <p className="rounded border border-dashed border-outline-variant bg-background/50 px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                Nenhuma imagem — use &quot;Adicionar imagem&quot; para incluir links (ex.: CDN ou armazenamento público).
              </p>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="https://…"
                    aria-label={`URL da imagem ${index + 1}`}
                    {...register(`imageUrls.${index}.url` as const)}
                    className="min-w-0 flex-1 rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                    className="shrink-0 rounded border border-outline-variant px-3 py-2 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant transition-colors hover:border-error hover:text-error"
                    aria-label={`Remover imagem ${index + 1}`}
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Preço
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.price ? <p className="font-body-sm text-body-sm text-error">{errors.price.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Estoque
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            {...register("stock", { valueAsNumber: true })}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.stock ? <p className="font-body-sm text-body-sm text-error">{errors.stock.message}</p> : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="brand" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Marca (opcional)
          </label>
          <input
            id="brand"
            {...register("brand")}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.brand ? <p className="font-body-sm text-body-sm text-error">{errors.brand.message}</p> : null}
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
  );
}
