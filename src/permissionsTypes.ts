export enum PermissionsType {
  admin_role = "admin_role",
}

export const Permissions = PermissionsType;
export type Permissions = keyof typeof PermissionsType;
