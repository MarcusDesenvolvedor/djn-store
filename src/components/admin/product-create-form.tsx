"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createAdminProductBodySchema,
  type CreateAdminProductBody,
} from "@/features/product-admin/product-admin.schema";
import type { Resolver } from "react-hook-form";

export type ProductCreateGameOption = {
  id: string;
  name: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

export function ProductCreateForm({ games }: { games: ProductCreateGameOption[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminProductBody>({
    resolver: zodResolver(createAdminProductBodySchema) as Resolver<CreateAdminProductBody>,
    defaultValues: {
      sku: "",
      gameId: "",
      categoryId: "",
      name: "",
      description: "",
      price: 1,
      stock: 0,
      brand: null,
      isActive: true,
    },
  });

  const gameId = watch("gameId");

  useEffect(() => {
    if (!gameId) {
      setCategories([]);
      setCategoriesError(null);
      setValue("categoryId", "");
      return;
    }

    let cancelled = false;
    setLoadingCats(true);
    setCategoriesError(null);

    void fetch(`/api/admin/categories?gameId=${encodeURIComponent(gameId)}`)
      .then(async (res) => {
        const body = (await res.json()) as { data?: CategoryOption[]; error?: string };
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

    setValue("categoryId", "");

    return () => {
      cancelled = true;
    };
  }, [gameId, setValue]);

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

  const categoryDisabled = !gameId || loadingCats || categories.length === 0;

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
            SKU único por linha de catálogo; categoria sempre do mesmo jogo selecionado.
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
          <label htmlFor="sku" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            SKU
          </label>
          <input
            id="sku"
            {...register("sku")}
            autoComplete="off"
            placeholder="Ex.: D4-GOLD-001"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.sku ? (
            <p className="font-body-sm text-body-sm text-error">{errors.sku.message}</p>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Armazenado em maiúsculas; não pode repetir em outro produto.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="gameId" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Jogo
          </label>
          <select
            id="gameId"
            {...register("gameId")}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          >
            <option value="">Selecione o jogo</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {errors.gameId ? (
            <p className="font-body-sm text-body-sm text-error">{errors.gameId.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="categoryId"
            className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
          >
            Categoria
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            disabled={categoryDisabled}
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{loadingCats ? "Carregando…" : "Selecione a categoria"}</option>
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
          {gameId && !loadingCats && categories.length === 0 && !categoriesError ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma categoria para este jogo no banco — crie categorias antes (Prisma / seed).
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
