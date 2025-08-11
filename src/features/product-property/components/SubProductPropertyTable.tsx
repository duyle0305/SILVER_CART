import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useTable } from '@/hooks/useTable'
import { TableCell, TableRow } from '@mui/material'
import type { ProductPropertyValue } from '../types'

const headCells: readonly HeadCell<ProductPropertyValue>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
]

interface SubProductPropertyTableProps {
  subProductProperties: ProductPropertyValue[]
}

const SubProductPropertyTable = ({
  subProductProperties,
}: SubProductPropertyTableProps) => {
  const table = useTable<ProductPropertyValue>({ initialOrderBy: 'code' })

  const renderRow = (row: ProductPropertyValue, _: boolean, index: number) => (
    <TableRow key={row.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.childrentLabel}</TableCell>
    </TableRow>
  )

  return (
    <>
      <BaseTable
        data={subProductProperties}
        headCells={headCells}
        isLoading={false}
        table={table}
        pageCount={Math.ceil(subProductProperties.length / table.rowsPerPage)}
        toolbar={<></>}
        renderRow={renderRow}
        showCheckbox={false}
        allowModify={false}
        isSortable={false}
        showPagination={false}
      />
    </>
  )
}

export default SubProductPropertyTable
