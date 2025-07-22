import { useQuery } from '@tanstack/react-query'
import {
  fetchUsers,
  type UserQueryParams,
} from '@/features/users/services/userService'
import type { SortType } from '@/constants'

interface UseUsersProps {
  page: number
  pageSize: number
  order: SortType
  orderBy: string
  keyword: string
}

export function useUsers({
  page,
  pageSize,
  order,
  orderBy,
  keyword,
}: UseUsersProps) {
  const queryParams: UserQueryParams = {
    'PagingRequest.Page': page + 1,
    'PagingRequest.PageSize': pageSize,
    'PagingRequest.SortType': order,
    'PagingRequest.ColName': orderBy,
    keyword,
  }

  return useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => fetchUsers(queryParams),
    refetchOnWindowFocus: false,
  })
}
