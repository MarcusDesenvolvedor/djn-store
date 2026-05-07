import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <p className="mb-10 font-meta-mono text-meta-mono uppercase tracking-[0.25em] text-on-surface-variant">
        DJN Store
      </p>
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-[420px]",
            card: "border border-outline-variant bg-surface-container-lowest shadow-none",
            headerTitle: "font-h3 text-h3 text-on-surface",
            headerSubtitle: "font-body-sm text-body-sm text-on-surface-variant",
            socialButtonsBlockButton:
              "border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface",
            formButtonPrimary: "bg-on-surface text-surface hover:bg-primary",
            footerActionLink: "text-primary hover:text-on-surface",
          },
          variables: {
            colorPrimary: "#e5e2e1",
            colorText: "#e5e2e1",
            colorTextSecondary: "#c4c7c7",
            colorBackground: "#141313",
            colorInputBackground: "#0e0e0e",
            colorNeutral: "#444748",
            borderRadius: "0.25rem",
          },
        }}
      />
    </div>
  );
}
