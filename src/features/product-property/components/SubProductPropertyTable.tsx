import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useTable } from '@/hooks/useTable'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TableCell,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDeactiveOrActiveProductProperty } from '../hooks/useDeatviceOrActiveProductProperty'
import type { ProductPropertyValue } from '../types'

const headCells: readonly HeadCell<ProductPropertyValue>[] = [
  { id: 'code', label: 'Code' },
  { id: 'label', label: 'Label' },
  { id: 'description', label: 'Description' },
  { id: 'isActive', label: 'Status' },
]

interface SubProductPropertyTableProps {
  subProductProperties: ProductPropertyValue[]
}

const SubProductPropertyTable = ({
  subProductProperties,
}: SubProductPropertyTableProps) => {
  const table = useTable<ProductPropertyValue>({ initialOrderBy: 'code' })
  const { mutate: toggleActive } = useDeactiveOrActiveProductProperty()
  const navigate = useNavigate()

  const renderRow = (row: ProductPropertyValue, _: boolean, index: number) => (
    <TableRow key={row.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.label}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={row.isActive}
                onChange={() => toggleActive(row.id)}
              />
            }
            label={row.isActive ? 'Active' : 'Inactive'}
          />
        </FormGroup>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <IconButton
            color="primary"
            onClick={() => navigate('edit/' + row.id)}
            size="small"
          >
            <BorderColorIcon />
          </IconButton>
        </Stack>
      </TableCell>
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
        allowModify={true}
        isSortable={false}
        showPagination={false}
      />
    </>
  )
}

export default SubProductPropertyTable
