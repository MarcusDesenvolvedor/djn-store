import type { Metadata } from "next";
import { ProductCreateForm } from "@/components/admin/product-create-form";

export const metadata: Metadata = {
  title: "Novo produto",
};

export default async function AdminNovoProdutoPage() {
  return (
    <div className="mx-auto max-w-3xl pb-8">
      <ProductCreateForm />
    </div>
  );
}
