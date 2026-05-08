import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefrontProduct } from "@/features/catalog/catalog.service";
import { VaultStoreHeaderAuth } from "@/components/store/vault-store-header-auth";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ productId: string }>;
}>;

function parseProductId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const id = parseProductId(productId);
  const product = id !== null ? await getStorefrontProduct(id) : null;
  const titleSuffix = product ? ` — ${product.name}` : " — Produto";
  const description =
    product?.description.length && product.description.length > 160
      ? `${product.description.slice(0, 157)}…`
      : product?.description;
  return {
    title: `DJN Store${titleSuffix}`,
    description: description ?? "Detalhes do produto na loja pública.",
  };
}

export default async function PublicProductPage({ params }: Props) {
  const { productId: rawParam } = await params;
  const id = parseProductId(rawParam);
  if (id === null) {
    notFound();
  }

  const product = await getStorefrontProduct(id);
  if (!product) {
    notFound();
  }

  const canPurchase = product.isActive && product.stock > 0;
  const primaryImage = product.images[0]?.url ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-margin-page">
          <div className="flex items-center gap-gutter">
            <Link href="/" className="font-h3 text-h3 font-bold tracking-tighter text-on-surface">
              DJN STORE
            </Link>
            <span className="hidden font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant sm:inline">
              Visualização da loja
            </span>
          </div>
          <VaultStoreHeaderAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-container-max flex-1 px-margin-page py-10">
        <nav className="mb-8 font-body-sm text-body-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">
            Início
          </Link>
          <span aria-hidden className="mx-2 text-outline-variant">
            /
          </span>
          <span className="text-on-surface">Produto</span>
        </nav>

        <div className="grid gap-gutter lg:grid-cols-2">
          <div className="aspect-square w-full overflow-hidden rounded border border-outline-variant bg-surface-container-lowest">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary image URLs from catalog
              <img src={primaryImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[72px]" aria-hidden>
                  hide_image
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm border border-outline-variant px-2 py-0.5 font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                {product.categoryName}
              </span>
              {!product.isActive ? (
                <span className="rounded-sm border border-outline-variant bg-surface-container-low px-2 py-0.5 font-meta-mono text-meta-mono text-on-surface-variant">
                  Indisponível na loja
                </span>
              ) : null}
              {product.isActive && product.stock <= 0 ? (
                <span className="rounded-sm border border-outline-variant bg-surface-container-low px-2 py-0.5 font-meta-mono text-meta-mono text-on-surface-variant">
                  Esgotado
                </span>
              ) : null}
            </div>

            <h1 className="font-h1 text-h1 text-on-surface">{product.name}</h1>
            {product.brand ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">Marca: {product.brand}</p>
            ) : null}

            <p className="font-h2 text-h2 tabular-nums text-primary">R$ {product.priceStr}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Estoque exibido: <span className="tabular-nums text-on-surface">{product.stock}</span> un.
            </p>

            <div className="micro-chamfer inline-flex w-fit items-center gap-2 border border-outline-variant bg-surface-container-lowest px-4 py-3 font-button text-button text-on-surface-variant">
              {canPurchase ? "Comprar (em breve)" : "Não disponível para compra"}
            </div>

            <div className="mt-6 border-t border-outline-variant pt-6">
              <h2 className="mb-2 font-h3 text-h3 text-on-surface">Descrição</h2>
              <p className="whitespace-pre-wrap font-body text-body text-on-surface-variant">{product.description}</p>
            </div>

            {product.images.length > 1 ? (
              <div className="mt-4">
                <h3 className="mb-2 font-body-sm font-semibold text-on-surface">Mais imagens</h3>
                <ul className="flex flex-wrap gap-2">
                  {product.images.slice(1).map((img) => (
                    <li key={img.id} className="h-20 w-20 overflow-hidden rounded border border-outline-variant">
                      {/* eslint-disable-next-line @next/next/no-img-element -- catalog image URLs */}
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
