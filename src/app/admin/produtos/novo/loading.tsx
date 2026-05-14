export default function AdminNovoProdutoLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-10 rounded border border-outline-variant bg-surface-container-lowest p-6 md:p-8">
      <div className="space-y-2 border-b border-outline-variant pb-6">
        <div className="h-8 w-48 rounded bg-surface-container md:h-9" />
        <div className="max-w-xl space-y-2">
          <div className="h-4 w-full rounded bg-surface-container" />
          <div className="h-4 max-w-xl rounded bg-surface-container" />
          <div className="h-4 w-2/3 rounded bg-surface-container" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-7 w-40 rounded bg-surface-container" />
        <div className="h-12 w-full rounded bg-surface-container" />
        <div className="h-28 w-full rounded bg-surface-container" />
      </div>
      <div className="space-y-4">
        <div className="h-7 w-32 rounded bg-surface-container" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-12 rounded bg-surface-container" />
          <div className="h-12 rounded bg-surface-container" />
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-outline-variant pt-6">
        <div className="h-11 w-28 rounded bg-surface-container" />
        <div className="h-11 w-40 rounded bg-surface-container" />
      </div>
    </div>
  );
}
