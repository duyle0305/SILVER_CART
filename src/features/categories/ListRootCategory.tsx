import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import AddIcon from '@mui/icons-material/Add'
import {
  Button,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRootCategories } from './hooks/useRootCategories'
import type { RootCategory } from './types'
import BorderColorIcon from '@mui/icons-material/BorderColor'

const headCells: readonly HeadCell<RootCategory>[] = [
  { id: 'label', label: 'Label' },
  { id: 'code', label: 'Code' },
]

export default function ListRootCategory() {
  const { data = [], isLoading, isError } = useRootCategories()
  const table = useTable<RootCategory>({
    initialOrderBy: 'code',
  })
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const handleRowClick = (id: string) => {
    navigate(`sub-category/${id}`)
  }

  const renderRow = (row: RootCategory, _: boolean, index: number) => (
    <TableRow key={row.id} hover onClick={() => handleRowClick(row.childrenId)}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`edit/${row.id}`)
          }}
          size="small"
        >
          <BorderColorIcon fontSize="small" />
        </IconButton>
      </TableCell>
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
        isSortable={false}
      />
    </Paper>
  )
}
