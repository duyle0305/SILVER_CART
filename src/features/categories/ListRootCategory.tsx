import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import AddIcon from '@mui/icons-material/Add'
import {
  Button,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from './hooks/useCategories'
import type { Category } from './types'

const headCells: readonly HeadCell<Category>[] = [
  { id: 'label', label: 'Label' },
  { id: 'note', label: 'Note' },
]

export default function ListRootCategory() {
  const { data = [], isLoading, isError } = useCategories()
  const table = useTable<Category>({
    initialOrderBy: 'code',
  })
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const handleRowClick = (id: string) => {
    navigate(`sub-category/${id}`)
  }

  const renderRow = (row: Category, _: boolean, index: number) => (
    <TableRow
      key={row.id}
      hover
      onClick={() => handleRowClick(row.childrenId)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
    </TableRow>
  )

  useEffect(() => {
    if (isError) {
      showNotification('Load root categories failed', 'error')
    }
  }, [isError, showNotification])

  return (
    <Paper sx={{ p: 3, boxShadow: 'none' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All root categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categories/add-root')}
        >
          Add root category
        </Button>
      </Stack>
      <BaseTable<Category>
        data={data}
        headCells={headCells}
        isLoading={isLoading}
        table={table}
        pageCount={0}
        renderRow={renderRow}
        toolbar={null}
        showCheckbox={false}
        showPagination={false}
        allowModify={false}
        isSortable={false}
      />
    </Paper>
  )
}
