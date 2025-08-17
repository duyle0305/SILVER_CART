import { useTable } from '@/hooks/useTable'
import { useRootCategories } from './hooks/useRootCategories'
import type { HeadCell } from '@/components/common/BaseTableHead'
import type { RootCategory } from './types'
import { BaseTable } from '@/components/common/BaseTable'
import {
  Button,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNotification } from '@/hooks/useNotification'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

const headCells: readonly HeadCell<RootCategory>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
]

export default function ListRootCategory() {
  const { data = [], isLoading, isError } = useRootCategories()
  const table = useTable<RootCategory>({
    initialOrderBy: 'code',
  })
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const renderRow = (row: RootCategory, _: boolean, index: number) => (
    <TableRow key={row.id} hover>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
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
      <BaseTable<RootCategory>
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
