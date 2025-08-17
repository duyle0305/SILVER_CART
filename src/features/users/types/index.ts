export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  roleName: string
  isVerified: boolean
  isDeleted: boolean
}

export interface Address {
  id: string
  streetAddress: string
  wardCode: string
  wardName: string
  districtID: number
  districtName: string
  provinceID: number
  provinceName: string
  phoneNumber: string
}

export interface UserDetail {
  id: string
  fullName: string
  userName: string
  email: string | null
  avatar: string | null
  gender: number
  phoneNumber: string | null
  emergencyPhoneNumber: string | null
  birthDate: string
  age: number
  rewardPoint: number
  description: string
  relationShip: string
  guardianId: string
  roleId: string
  roleName: string
  addresses: Address[]
  userPromotions: string[]
  categoryLabels: string[]
  cartCount: number
  paymentCount: number
  isDeleted: boolean
}

export interface UserBodyParam {
  roleId?: string
  searchTerm?: string
  page: number
  pageSize: number
}

export interface CreateUserPayload {
  fullName: string
  email: string
  userName: string
  phoneNumber: string
  password: string
  roleId: string
}
