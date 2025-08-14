export const ACCESS_TOKEN_KEY = 'at'
export const REFRESH_TOKEN_KEY = 'rt'
export enum Role {
  ADMIN = 'Admin',
  CONSULTANT = 'Consultant',
  STAFF = 'Staff',
  UNKNOWN = 'Unknown',
}

export const authorizationAction = {
  allowCreateUser: [Role.ADMIN],
  allowViewUser: [Role.ADMIN, Role.CONSULTANT, Role.STAFF],
  allowCreateProducts: [Role.ADMIN],
  allowUpdateProducts: [Role.ADMIN],
  allowViewProducts: [Role.ADMIN, Role.CONSULTANT, Role.STAFF],
  allowCRUDCategories: [Role.ADMIN],
  allowChat: [Role.CONSULTANT, Role.STAFF],
  allowCRUDBrands: [Role.ADMIN],
  allowCRUDProductProperties: [Role.ADMIN],
  allowVideoCall: [Role.CONSULTANT],
  allowViewFeedbacks: [Role.STAFF],
  allowRespondFeedback: [Role.STAFF],
  allowViewPromotion: [Role.ADMIN, Role.CONSULTANT, Role.STAFF],
  allowWritePromotion: [Role.ADMIN],
}
