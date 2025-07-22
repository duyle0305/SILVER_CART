import { useState, useCallback, type ChangeEvent } from 'react'

type Order = 'Ascending' | 'Descending'

export interface UseTableReturn<T> {
  order: Order
  orderBy: keyof T | string
  selected: readonly (string | number)[]
  page: number
  rowsPerPage: number
  isSelected: (id: string | number) => boolean
  handleRequestSort: (property: keyof T | string) => void
  handleSelectAllClick: (
    event: ChangeEvent<HTMLInputElement>,
    allIds: (string | number)[]
  ) => void
  handleSelectRowClick: (id: string | number) => void
  handleChangePage: (event: ChangeEvent<unknown>, newPage: number) => void
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void
  setFilterPage: (page: number) => void
}

export function useTable<T extends { id: string | number }>({
  initialOrderBy = 'id',
  initialOrder = 'Ascending',
  initialPageSize = 10,
}: {
  initialOrderBy?: keyof T | string
  initialOrder?: Order
  initialPageSize?: number
}): UseTableReturn<T> {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [orderBy, setOrderBy] = useState<keyof T | string>(initialOrderBy)
  const [selected, setSelected] = useState<readonly (string | number)[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize)

  const handleRequestSort = useCallback(
    (property: keyof T | string) => {
      const isAscending = orderBy === property && order === 'Ascending'
      setOrder(isAscending ? 'Descending' : 'Ascending')
      setOrderBy(property)
    },
    [order, orderBy]
  )

  const handleSelectAllClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>, allIds: (string | number)[]) => {
      if (event.target.checked) {
        setSelected(allIds)
        return
      }
      setSelected([])
    },
    []
  )

  const handleSelectRowClick = useCallback(
    (id: string | number) => {
      const selectedIndex = selected.indexOf(id)
      let newSelected: readonly (string | number)[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        )
      }
      setSelected(newSelected)
    },
    [selected]
  )

  const handleChangePage = useCallback(
    (_: ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage - 1)
    },
    []
  )

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    },
    []
  )

  return {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    isSelected,
    handleRequestSort,
    handleSelectAllClick,
    handleSelectRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    setFilterPage: (page: number) => setPage(page),
  }
}
