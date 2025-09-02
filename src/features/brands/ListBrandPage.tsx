import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useTable } from '@/hooks/useTable'
import AddIcon from '@mui/icons-material/Add'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import {
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBrands } from './hooks/useBrands'
import { useDeactiveOrActiveBrand } from './hooks/useDeactiveOrActiveBrand'
import type { Brand } from './types'

const headCells: readonly HeadCell<Brand>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
  { id: 'isActive', label: 'Status' },
]

const ListBrandPage = () => {
  const navigate = useNavigate()
  const { data: brands = [], isLoading } = useBrands()
  const table = useTable<Brand>({ initialOrderBy: 'code' })
  const { mutateAsync: toggleBrandStatus } = useDeactiveOrActiveBrand()

  const renderRow = (row: Brand, _: boolean, index: number) => (
    <TableRow key={row.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell width={900}>{row.description}</TableCell>
      <TableCell>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={row.isActive}
                onChange={() => toggleBrandStatus(row.id)}
              />
            }
            label={row.isActive ? 'Active' : 'Inactive'}
          />
        </FormGroup>
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => navigate('edit/' + row.id)}
          size="small"
          color="primary"
        >
          <BorderColorIcon />
        </IconButton>
      </TableCell>
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
      showCheckbox={false}
    />
  )
}

export default ListBrandPage
