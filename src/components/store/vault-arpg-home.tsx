import Image from "next/image";
import { VaultHomeFaq } from "@/components/store/vault-home-faq";
import { VaultStoreHeaderAuth } from "@/components/store/vault-store-header-auth";

const GAME_CARDS = [
  {
    title: "Path of Exile 2",
    meta: "EARLY ACCESS",
    alt: "Path of Exile 2 Cover",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVTMaN350Eda5biinVNHGjaq39BLgpNcSPLeROmdKjWYhzsP47HeN7PvIqrxqfpDRSVr9ZXAzWf8mrvvZRrUpu-tfwxp_ndqov-XmoUWHOw7FJLBPFYLifBzzlUzOXAwvPYPSz86GIr-rE3SqI03rqDlC9FLIJcfS5oRljssIbt5petQFgdlRzJX52StBAgfYLQ7mHE-RqaWOWBFn7AbUJ5XnN9NnTRr_Hv25Shq2czsDEzCA9GKUFx6ANuc3rES61WJMmZ7aokxt3",
  },
  {
    title: "Diablo IV",
    meta: "SEASON 6",
    alt: "Diablo IV Cover",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtG7BV497FZaX_lcd_l1E0OodtUyN8w1UHCVWg2qXpsZggmPq4HqxUTL6urasq3Gx2_C9Iflo33GOf2FU8AHoXuyBf5HzyqksYPFpmm_f9QxjgAnsS8MrgFR9zV2oLQZS9342nvCaPzARd7rIq1xfNGQrf7rEhJzrUb_w-4rCnspjVAs0KRgX4kxD75OX2Vw4ikGO3NEdxAUvwKBq8jPzxcv45ZwgZbvOMpEHS5gQNMWQtkBnQBLdqQR50h8Bmz-UjSKXpQmf2mHoK",
  },
  {
    title: "Last Epoch",
    meta: "CYCLE 1",
    alt: "Last Epoch Cover",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI-oTu95rAk7j1hRaKcDHlQup_yKtv-4mSRP709uNPKb_5KeM41DFzsS5xkvpybuZCYxllY4qT53uTUTHfiBVuXzFSXwLCwqD6JMY6KMrQDZTOYAcdQba9jp3mkXLfAG8EaRR0IoCUVuIc7JBVzl04um7c5mp5OBAT2YuBYNkhSguPjK-5JBV59uXAKHLsmaOm-5O14Mxrf4wtW9c1f_nBxsXiarJf_ZCB7Nki1zkRYDpZVsub5NukOBNiDDHwVK0Eq3u_W4c-M34D",
  },
  {
    title: "Path of Exile 1",
    meta: "NECROPOLIS",
    alt: "Path of Exile 1 Cover",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjHdPa9NpJKU3zTw1Q82ckHHRcJTwHFkurdRXuQkbXUiOoKcjtBzBCVCBtmKE8KtcZNf1LDx2hYBj7dZXUd_OG02EbDkihIZ0QxqVRSlCMj0GA4HcQVflVfbYrROfWS6uC1tWcvgJ_HtpVDSPNbIStXCKVk0HXHhqH28PeNFUTjmEL-AmdD62MsVeW8HSpm8cWV5rAFilFA5EKYtUqJmTypO0LyxgAQV9wJVBMxk1N8LwBlwHqfx1r1lKNTU5RK5ouO0RU8URQDJ9i",
  },
  {
    title: "Torchlight Inf.",
    meta: "NEW SEASON",
    alt: "Torchlight Infinite Cover",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyUEOcyKkO2gmLBxii6jCtSqt6yFTq-0OzdQdWNU84wdvSDzIFJ_-2bk6yzSyVnpgQotBbW2WPB6a34Xq96wc8Yi7GYvk3vc12V3nhiET55XzeEBobZDD16TRoRnHPozMRG4ddfZNcxb55JL4dMnbbt8VEscsSlqT_ITCtUsSgmg9olUBIO1FUocGQFMoJF-x4nLuN0MDr0MOZBx1OM659y9FEicrLm2rixZDw2IwJ0RN8ns3jGG9iuce8vKvyrPUyaN9OU47Ia-LC",
  },
] as const;

export function VaultArpgHome() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface dark:bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-margin-page">
          <div className="flex items-center gap-gutter">
            <a
              className="font-h3 text-h3 font-bold tracking-tighter text-on-surface dark:text-on-surface"
              href="#"
            >
              DJN STORE
            </a>
            <div className="hidden items-center rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-on-surface-variant transition-colors focus-within:border-primary md:flex">
              <span className="material-symbols-outlined mr-2 text-[18px]">search</span>
              <input
                className="w-48 border-none bg-transparent text-body-sm placeholder-on-surface-variant/50 outline-none focus:ring-0"
                placeholder="Buscar itens, runas..."
                type="text"
                readOnly
                aria-readonly
              />
            </div>
          </div>
          <nav className="hidden items-center gap-gutter lg:flex">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-on-surface-variant"
              href="#"
            >
              Diablo IV
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-on-surface-variant"
              href="#"
            >
              PoE 2
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-on-surface-variant"
              href="#"
            >
              Last Epoch
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-on-surface-variant"
              href="#"
            >
              Hero Siege
            </a>
          </nav>
          <div className="flex items-center gap-base">
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

      <main className="flex grow flex-col">
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

        <section className="mx-auto w-full max-w-container-max px-margin-page py-section-gap" id="jogos">
          <div className="mb-gutter flex items-end justify-between border-b border-outline-variant pb-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">Catálogo de Jogos</h2>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Selecione seu domínio para acessar o inventário de mercado.
              </p>
            </div>
            <a
              className="flex items-center gap-1 font-meta-mono text-meta-mono uppercase text-primary transition-colors hover:text-on-surface"
              href="#"
            >
              Ver todos{" "}
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {GAME_CARDS.map((game) => (
              <a
                key={game.title}
                className="group relative flex flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-lowest transition-colors duration-300 hover:border-on-surface-variant"
                href="#"
              >
                <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                  <Image
                    src={game.src}
                    alt={game.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 240px"
                    className="object-cover opacity-60 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-80 group-hover:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                </div>
                <div className="flex grow flex-col justify-between p-4">
                  <h3 className="mb-1 font-h3 text-h3 text-on-surface">{game.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-meta-mono text-meta-mono text-on-surface-variant">
                      {game.meta}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-outline-variant transition-colors group-hover:text-primary">
                      north_east
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-container-max border-t border-outline-variant px-margin-page py-section-gap"
          id="como-funciona"
        >
          <div className="mb-16 text-center">
            <h2 className="font-h2 text-h2 text-on-surface">Processo de Aquisição</h2>
            <p className="mx-auto mt-2 max-w-2xl font-body text-body text-on-surface-variant">
              Um fluxo de transação otimizado, projetado para eliminar atritos e garantir a entrega rápida
              e segura dos seus ativos virtuais.
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
                Selecione o universo desejado e navegue por nosso inventário meticulosamente categorizado por
                ligas e servidores.
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
                Adicione os itens ao carrinho. Nosso sistema de checkout processa o pagamento de forma
                criptografada e instantânea.
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
                Nossos agentes automatizados ou especialistas in-game iniciarão a transferência segura no
                menor tempo possível.
              </p>
            </div>
          </div>
        </section>

        <VaultHomeFaq />
      </main>

      <footer className="mt-auto border-t border-outline-variant bg-surface-container-lowest dark:bg-surface-container-lowest dark:border-outline-variant">
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
    </>
  );
}
