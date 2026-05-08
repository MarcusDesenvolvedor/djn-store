"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createAdminCategoryBodySchema,
  type CreateAdminCategoryInput,
} from "@/features/category-admin/category-admin.schema";
import type { Resolver } from "react-hook-form";

export function CategoryCreateForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminCategoryInput>({
    resolver: zodResolver(createAdminCategoryBodySchema) as Resolver<CreateAdminCategoryInput>,
    defaultValues: { name: "", imageUrl: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSubmitError(body.error ?? "Não foi possível criar a categoria");
      return;
    }
    reset({ name: "", imageUrl: "" });
    router.refresh();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded border border-outline-variant bg-surface-container-lowest p-6 md:p-8"
      noValidate
    >
      <h3 className="font-h3 text-h3 text-on-surface">Nova categoria</h3>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
        Nome obrigatório. Opcionalmente, uma URL de imagem representativa (http ou https).
      </p>

      {submitError ? (
        <div className="mt-4 rounded border border-outline-variant bg-surface-container px-4 py-3 font-body-sm text-body-sm text-error">
          {submitError}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="category-name" className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
            Nome
          </label>
          <input
            id="category-name"
            {...register("name")}
            autoComplete="off"
            placeholder="Ex.: Moedas"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.name ? <p className="font-body-sm text-body-sm text-error">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="category-image-url"
            className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant"
          >
            Imagem (URL)
          </label>
          <input
            id="category-image-url"
            type="text"
            {...register("imageUrl")}
            autoComplete="off"
            placeholder="https://…"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none ring-primary focus:border-transparent focus:ring-1"
          />
          {errors.imageUrl ? <p className="font-body-sm text-body-sm text-error">{errors.imageUrl.message}</p> : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="micro-chamfer shrink-0 bg-on-surface px-8 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando…" : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
