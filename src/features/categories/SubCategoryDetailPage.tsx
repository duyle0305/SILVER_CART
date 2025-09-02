import type { HeadCell } from '@/components/common/BaseTableHead'
import type { RootCategory } from './types'
import { useListValueCategoryById } from './hooks/useListValueCategoryById'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useNotification } from '@/hooks/useNotification'
import {
  Button,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { BaseTable } from '@/components/common/BaseTable'
import { useTable } from '@/hooks/useTable'
import BorderColorIcon from '@mui/icons-material/BorderColor'

const subCategoryHeadCells: readonly HeadCell<RootCategory>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
]

export default function SubCategoryDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data = [], isLoading, isError } = useListValueCategoryById(id)
  const table = useTable<RootCategory>({
    initialOrderBy: 'code',
  })
  const { showNotification } = useNotification()
  const renderRow = (row: RootCategory, _: boolean, index: number) => (
    <TableRow key={row.id} hover>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
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
      showNotification('Load sub-category failed', 'error')
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
          All sub-categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('add')}
        >
          Add sub-category
        </Button>
      </Stack>
      <BaseTable<RootCategory>
        data={data}
        headCells={subCategoryHeadCells}
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
