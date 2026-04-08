export enum UserRole {
  ADMIN = 'ADMIN',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
  STORE_MANAGER = 'STORE_MANAGER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface UserProfile {
  id: number;
  username: string;
  realName: string | null;
  phone: string | null;
  role: UserRole;
  storeId: number | null;
}
