export type CategoryAdminTreeSerializable = {
  id: string;
  name: string;
  imageUrl: string | null;
  /** ISO timestamp */
  createdAt: string;
  productCount: number;
  childCount: number;
  children: CategoryAdminTreeSerializable[];
};

/** Lista plana serializada (`GET …?flat=1`) para selects e tooling. */
export type CategoryAdminFlatSerializable = {
  id: string;
  name: string;
  imageUrl: string | null;
  /** ISO timestamp */
  createdAt: string;
  parentId: string | null;
  productCount: number;
  childCount: number;
};
