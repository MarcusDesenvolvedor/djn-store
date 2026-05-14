import Image from "next/image";
import Link from "next/link";
import type { StorefrontCategoryListItem } from "@/features/catalog/catalog.service";
import { VaultHomeFaq } from "@/components/store/vault-home-faq";
import { VaultStoreHeaderAuth } from "@/components/store/vault-store-header-auth";
import { VaultStoreSearch } from "@/components/store/vault-store-search";

const NAV_ITEMS_MAX = 6;
const NAV_LABEL_MAX = 16;

function navTruncatedTitle(name: string): string {
  if (name.length <= NAV_LABEL_MAX) {
    return name;
  }
  return `${name.slice(0, NAV_LABEL_MAX - 1)}…`;
}

function resolveCategoryCoverUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return "/category-placeholder.svg";
  }
  const trimmed = imageUrl.trim();
  if (trimmed.length === 0) {
    return "/category-placeholder.svg";
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
  } catch {
    /* invalid URL */
  }
  return "/category-placeholder.svg";
}

function productCountMeta(count: number): string {
  if (count === 0) return "Sem produtos ativos";
  if (count === 1) return "1 produto";
  return `${count} produtos`;
}

type VaultArpgHomeProps = {
  categories: ReadonlyArray<StorefrontCategoryListItem>;
};

export function VaultArpgHome({ categories }: VaultArpgHomeProps) {
  const navCategories = categories.slice(0, NAV_ITEMS_MAX);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface dark:bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between gap-gutter px-margin-page">
          <div className="flex min-w-0 flex-1 items-center gap-gutter">
            <Link
              className="font-h3 text-h3 shrink-0 font-bold tracking-tighter text-on-surface dark:text-on-surface"
              href="/"
              prefetch={false}
            >
              DJN STORE
            </Link>
            <div className="hidden min-w-0 flex-1 justify-center md:flex md:max-w-md">
              <VaultStoreSearch />
            </div>
          </div>
          {navCategories.length > 0 ? (
            <nav
              aria-label="Categorias do catálogo"
              className="hidden shrink-0 items-center gap-x-5 gap-y-1 lg:flex max-xl:gap-x-3"
            >
              {navCategories.map((category) => (
                <a
                  key={category.id}
                  title={category.name}
                  className="max-w-[7.25rem] truncate font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-on-surface-variant"
                  href={`#catalog-${category.id}`}
                >
                  {navTruncatedTitle(category.name)}
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden lg:block lg:w-[1px]" aria-hidden />
          )}
          <div className="flex shrink-0 items-center gap-base">
            <button
              type="button"
              aria-label="shopping_cart"
              className="scale-95 p-2 text-on-surface-variant transition-colors duration-200 hover:text-primary active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                shopping_cart
              </span>
            </button>
            <VaultStoreHeaderAuth />
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-margin-page pb-section-gap pt-32 text-center">
          <div className="pointer-events-none absolute inset-0 scanline-bg opacity-30" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-variant/20 blur-[100px]" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <span className="mb-6 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-1 font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Mercado Premium
            </span>
            <h1 className="mb-6 font-h1 text-h1 leading-tight text-on-surface">
              O Arsenal Definitivo para sua Jornada
            </h1>
            <p className="mb-10 max-w-xl font-body text-body text-on-surface-variant">
              Acesso exclusivo a ativos virtuais de alto tier, moedas e artefatos raros. Uma plataforma
              construída com foco em segurança, velocidade e estética minimalista para o ecossistema ARPG.
            </p>
            <div className="flex gap-4">
              <a
                className="micro-chamfer group flex items-center gap-2 bg-on-surface px-8 py-4 font-button text-button text-surface transition-all duration-300 hover:bg-primary"
                href="#jogos"
              >
                Explorar Jogos
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
              <a
                className="micro-chamfer border border-outline-variant bg-transparent px-8 py-4 font-button text-button text-on-surface transition-all duration-300 hover:bg-surface-container"
                href="#como-funciona"
              >
                Como Funciona
              </a>
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-container-max scroll-mt-28 px-margin-page py-section-gap"
          id="jogos"
        >
          <div className="mb-gutter flex items-end justify-between border-b border-outline-variant pb-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">Categorias da loja</h2>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Nomes e imagens vindos do cadastro administrativo — abra cada categoria para navegar até ela nesta página.
              </p>
            </div>
          </div>
          {categories.length === 0 ? (
            <p className="rounded border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-10 text-center font-body text-body text-on-surface-variant">
              Nenhuma categoria cadastrada ainda. Crie categorias no painel administrativo para exibi-las aqui.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categories.map((category) => {
                const cover = resolveCategoryCoverUrl(category.imageUrl);
                const remote = /^https?:\/\//i.test(cover);

                return (
                  <a
                    key={category.id}
                    id={`catalog-${category.id}`}
                    className="group relative flex scroll-mt-28 flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-lowest transition-colors duration-300 hover:border-on-surface-variant"
                    href={`#catalog-${category.id}`}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                      <Image
                        src={cover}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 240px"
                        className="object-cover opacity-60 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-80 group-hover:mix-blend-normal"
                        unoptimized={remote}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                    </div>
                    <div className="flex grow flex-col justify-between p-4">
                      <h3 className="mb-1 font-h3 text-h3 text-on-surface">{category.name}</h3>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="font-meta-mono text-meta-mono text-on-surface-variant">
                          {productCountMeta(category.activeProductCount)}
                        </span>
                        <span className="material-symbols-outlined shrink-0 text-[18px] text-outline-variant transition-colors group-hover:text-primary">
                          north_east
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        <section
          className="mx-auto w-full max-w-container-max border-t border-outline-variant px-margin-page py-section-gap"
          id="como-funciona"
        >
          <div className="mb-16 text-center">
            <h2 className="font-h2 text-h2 text-on-surface">Processo de Aquisição</h2>
            <p className="mx-auto mt-2 max-w-2xl font-body text-body text-on-surface-variant">
              Um fluxo de transação otimizado, projetado para eliminar atritos e garantir a entrega rápida e segura dos
              seus ativos virtuais.
            </p>
          </div>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute left-[15%] right-[15%] top-12 z-0 hidden h-px bg-outline-variant md:block" />
            <div className="relative z-10 flex flex-col items-center bg-background text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest shadow-sm">
                <span
                  className="material-symbols-outlined text-[32px] text-on-surface"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  sports_esports
                </span>
              </div>
              <h3 className="mb-2 font-h3 text-h3 text-on-surface">1. Escolha o Jogo</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Selecione o universo desejado e navegue por nosso inventário meticulosamente categorizado por ligas e
                servidores.
              </p>
            </div>
            <div className="relative z-10 flex flex-col items-center bg-background text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest shadow-sm">
                <span
                  className="material-symbols-outlined text-[32px] text-on-surface"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  add_shopping_cart
                </span>
              </div>
              <h3 className="mb-2 font-h3 text-h3 text-on-surface">2. Confirme o Pedido</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Adicione os itens ao carrinho. Nosso sistema de checkout processa o pagamento de forma criptografada e
                instantânea.
              </p>
            </div>
            <div className="relative z-10 flex flex-col items-center bg-background text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest shadow-sm">
                <span
                  className="material-symbols-outlined text-[32px] text-on-surface"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  handshake
                </span>
              </div>
              <h3 className="mb-2 font-h3 text-h3 text-on-surface">3. Receba via Trade</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Nossos agentes automatizados ou especialistas in-game iniciarão a transferência segura no menor tempo
                possível.
              </p>
            </div>
          </div>
        </section>

        <VaultHomeFaq />
      </main>

      <footer className="mt-auto border-t border-outline-variant bg-surface-container-lowest dark:border-outline-variant dark:bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-container-max flex-col items-center justify-between gap-base px-margin-page py-gutter md:flex-row">
          <div className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface">
            © 2026 DJN STORE PREMIUM VIRTUAL ASSETS
          </div>
          <nav className="flex gap-6">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant opacity-80 transition-colors duration-200 hover:text-on-surface hover:opacity-100"
              href="#"
            >
              Termos de Uso
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant opacity-80 transition-colors duration-200 hover:text-on-surface hover:opacity-100"
              href="#"
            >
              Privacidade
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant opacity-80 transition-colors duration-200 hover:text-on-surface hover:opacity-100"
              href="#"
            >
              Suporte
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant opacity-80 transition-colors duration-200 hover:text-on-surface hover:opacity-100"
              href="#"
            >
              Métodos de Pagamento
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
