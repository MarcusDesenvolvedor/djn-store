/** next/navigation `refresh()` pode devolver uma Promise; rejeição sem catch vira `[object Event]` no overlay Webpack */
export type RouterRefreshable = {
  refresh: () => void | Promise<unknown>;
};

export function refreshClientRouter(router: RouterRefreshable): void {
  void Promise.resolve(router.refresh()).catch(() => undefined);
}
