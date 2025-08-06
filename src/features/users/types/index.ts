export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  roleName: string
  isVerified: boolean
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
