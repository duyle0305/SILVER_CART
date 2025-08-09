import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useTable } from '@/hooks/useTable'
import type { Brand } from './types'
import { useBrands } from './hooks/useBrands'
import { Button, Stack, TableCell, TableRow, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

const headCells: readonly HeadCell<Brand>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
]

const ListBrandPage = () => {
  const navigate = useNavigate()
  const { data: brands = [], isLoading } = useBrands()
  const table = useTable<Brand>({ initialOrderBy: 'code' })

  const renderRow = (row: Brand, _: boolean, index: number) => (
    <TableRow key={row.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
    </TableRow>
  )

  return (
    <BaseTable
      data={brands}
      headCells={headCells}
      isLoading={isLoading}
      table={table}
      pageCount={0}
      toolbar={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary">
            Brands
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/brands/add')}
          >
            Add Brand
          </Button>
        </Stack>
      }
      renderRow={renderRow}
      isSortable={false}
      showPagination={false}
      allowModify={false}
      showCheckbox={false}
    />
  )
}

export default ListBrandPage
