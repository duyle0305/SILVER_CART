import { fetchUsers } from '@/features/users/services/userService'
import type { UserBodyParam } from '@/features/users/types'
import { useQuery } from '@tanstack/react-query'

interface UseUsersProps {
  page: number
  pageSize: number
  keyword: string
  roleId?: string
}

export function useUsers({ page, pageSize, keyword, roleId }: UseUsersProps) {
  const queryBody: UserBodyParam = {
    page: page + 1,
    pageSize: pageSize,
    searchTerm: keyword,
    roleId: roleId || undefined,
  }

  return useQuery({
    queryKey: ['users', queryBody],
    queryFn: ({ signal }) => fetchUsers(queryBody, signal),
    refetchOnWindowFocus: false,
  })
}
