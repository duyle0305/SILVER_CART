import type { SortType } from '@/constants'
import type { Role } from '@/features/authentication/constants'
import { fetchUsers } from '@/features/users/services/userService'
import type { UserQueryParams } from '@/features/users/types'
import { useQuery } from '@tanstack/react-query'

interface UseUsersProps {
  page: number
  pageSize: number
  order: SortType
  orderBy: string
  keyword: string
  role?: Role[]
}

export function useUsers({
  page,
  pageSize,
  order,
  orderBy,
  keyword,
  role,
}: UseUsersProps) {
  const queryParams: UserQueryParams = {
    'PagingRequest.Page': page + 1,
    'PagingRequest.PageSize': pageSize,
    'PagingRequest.SortType': order,
    'PagingRequest.ColName': orderBy,
    keyword,
    Role: role,
  }

  return useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => fetchUsers(queryParams),
    refetchOnWindowFocus: false,
  })
}
