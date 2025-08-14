import {
  StyledToolbar,
  StyledToolbarContainer,
} from '@/features/users/components/styles/TableToolbar.styles'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import type { RoleResponse } from '@/features/roles/types'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'
import { authorizationAction } from '@/features/authentication/constants'

interface TableToolbarProps {
  filter: string
  onFilterChange: (value: string) => void
  selectedRole: string
  onRoleChange: (roleId: string) => void
  roles: RoleResponse[]
  isLoadingRoles: boolean
}

const TableToolbar = ({
  filter,
  onFilterChange,
  selectedRole,
  onRoleChange,
  roles,
  isLoadingRoles,
}: TableToolbarProps) => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const allowModifyUsers =
    user?.role && authorizationAction.allowCreateUser.includes(user.role)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value)
  }

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    onRoleChange(event.target.value)
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
        {allowModifyUsers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/users/add')}
          >
            Add user
          </Button>
        )}
      </Stack>
      <StyledToolbar>
        <Stack direction="row" spacing={2} width="25%">
          <TextField
            variant="outlined"
            size="small"
            value={filter}
            onChange={handleSearch}
            placeholder="Search by keywords..."
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              label="Role"
              value={selectedRole}
              onChange={handleRoleChange}
              disabled={isLoadingRoles}
            >
              <MenuItem value="">
                <em>All Roles</em>
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}

export default TableToolbar
