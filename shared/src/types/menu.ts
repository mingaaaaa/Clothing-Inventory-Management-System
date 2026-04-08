export interface MenuItem {
  id: number;
  key: string;
  label: string;
  path: string;
  icon: string | null;
  sort: number;
  parentId: number | null;
  children?: MenuItem[];
}
