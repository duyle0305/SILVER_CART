import {
  Box,
  Paper,
  Stack,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { styled } from '@mui/material/styles'

export const PageWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const TablePaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}))

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}))

export const HeaderTableCell = styled(TableCell)({
  fontWeight: 'bold',
})

export const StyledTableRow = styled(TableRow)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
})

export const HotlineTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 'medium',
}))

export const PaginationContainer = styled(Stack)({
  alignItems: 'center',
  margin: '16px 0',
})
