import {
  StyledToolbar,
  StyledToolbarContainer,
} from '@/features/users/components/styles/TableToolbar.styles'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { ChangeEvent } from 'react'

interface TableToolbarProps {
  filter: string
  onFilterChange: (value: string) => void
}

const TableToolbar = ({ filter, onFilterChange }: TableToolbarProps) => {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value)
  }

  return (
    <StyledToolbarContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add user
        </Button>
      </Stack>
      <StyledToolbar>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            size="small"
            value={filter}
            onChange={handleSearch}
            placeholder="Search by keywords..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}

export default TableToolbar
