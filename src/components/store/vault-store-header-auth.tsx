"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function storefrontDisplayName(user: ReturnType<typeof useUser>["user"]): string {
  if (!user) {
    return "Conta ativa";
  }
  const full = user.fullName?.trim();
  if (full) {
    return full;
  }
  const composed = `${user.firstName?.trim() ?? ""} ${user.lastName?.trim() ?? ""}`.trim();
  if (composed) {
    return composed;
  }
  const username = user.username?.trim();
  if (username) {
    return username;
  }
  return "Conta ativa";
}

function HeaderAuthSkeleton() {
  return (
    <span className="ml-3 inline-block h-9 w-9 shrink-0 rounded-full bg-surface-container-high ring-1 ring-outline-variant" />
  );
}

function NameBlock({
  user,
  userLoaded,
}: {
  user: ReturnType<typeof useUser>["user"];
  userLoaded: boolean;
}) {
  if (!userLoaded) {
    return (
      <span className="hidden min-h-[1.25rem] min-w-[7rem] items-center gap-2 md:flex">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-surface-container-high"
          aria-hidden
        />
        <span
          className="h-4 max-w-[200px] flex-1 animate-pulse rounded bg-surface-container-high"
          aria-hidden
        />
      </span>
    );
  }

  const label = storefrontDisplayName(user);

  return (
    <span className="hidden items-center gap-2 md:flex">
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
        aria-hidden
      />
      <span className="max-w-[200px] truncate font-body-sm text-body-sm text-on-surface-variant" title={label}>
        {label}
      </span>
    </span>
  );
}

export function VaultStoreHeaderAuth() {
  const { isLoaded: authLoaded, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  if (!authLoaded) {
    return <HeaderAuthSkeleton />;
  }

  if (!userId) {
    return (
      <Link
        href="/sign-in"
        className="micro-chamfer ml-3 inline-flex scale-95 items-center justify-center bg-on-surface px-6 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary active:scale-95"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="ml-3 flex items-center gap-3">
      <NameBlock user={user} userLoaded={userLoaded} />
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
