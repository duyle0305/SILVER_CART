export const ACCESS_TOKEN_KEY = 'at'
export const REFRESH_TOKEN_KEY = 'rt'
export enum Role {
  ADMIN = 'Admin',
  SUPER_ADMIN = 'SuperAdmin',
  CONSULTANT = 'Consultant',
  CUSTOMER = 'Customer',
  GUARDIAN = 'Guardian',
}

export const authorizationAction = {
  allowCreateUser: [Role.ADMIN, Role.SUPER_ADMIN],
  allowUpdateUser: [Role.ADMIN, Role.SUPER_ADMIN],
  allowViewUser: [Role.ADMIN, Role.SUPER_ADMIN, Role.CONSULTANT],
  allowCreateProducts: [Role.ADMIN, Role.SUPER_ADMIN],
  allowUpdateProducts: [Role.ADMIN, Role.SUPER_ADMIN],
  allowViewProducts: [Role.ADMIN, Role.SUPER_ADMIN, Role.CONSULTANT],
}
