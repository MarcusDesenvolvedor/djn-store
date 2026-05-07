"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function SignedInAccount() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <span className="ml-3 inline-block h-9 w-9 shrink-0 rounded-full bg-surface-container-high ring-1 ring-outline-variant" />
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="ml-3 flex items-center gap-3">
      <span className="hidden items-center gap-2 md:flex">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
          aria-hidden
        />
        <span className="max-w-[200px] truncate font-body-sm text-body-sm text-on-surface-variant">
          {email ?? user?.username ?? "Conta ativa"}
        </span>
      </span>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "ring-1 ring-outline-variant",
          },
        }}
      />
    </div>
  );
}

export function VaultStoreHeaderAuth() {
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="micro-chamfer ml-3 inline-flex scale-95 items-center justify-center bg-on-surface px-6 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary active:scale-95"
        >
          Entrar
        </Link>
      </SignedOut>
      <SignedIn>
        <SignedInAccount />
      </SignedIn>
    </>
  );
}
