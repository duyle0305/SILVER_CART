import { useRoles } from '@/features/roles/hooks/useRoles'
import {
  createUserSchema,
  type CreateUserFormInputs,
} from '@/features/users/schemas'
import { useCreateUser } from '@/features/users/hooks/useCreateUser'
import { useNotification } from '@/hooks/useNotification'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CreateUserPage = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles()
  const { mutate: createUserMutation, isPending } = useCreateUser()
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormInputs>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      userName: '',
      phoneNumber: '',
      password: '',
      roleId: '',
    },
  })

  const onSubmit = (data: CreateUserFormInputs) => {
    setErrorMessage('')
    createUserMutation(data, {
      onSuccess: () => {
        showNotification('User created successfully!', 'success')
        navigate('/users')
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const apiError =
          error?.response?.data?.message || 'Failed to create user.'
        setErrorMessage(apiError)
      },
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Create New User
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {errorMessage && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error" onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('fullName')}
              label="Full Name"
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('userName')}
              label="Username"
              fullWidth
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('phoneNumber')}
              label="Phone Number"
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('password')}
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.roleId}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="role-select-label"
                    label="Role"
                    disabled={isLoadingRoles}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.roleId && (
                <FormHelperText>{errors.roleId.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <Button variant="outlined" onClick={() => navigate('/users')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create User'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default CreateUserPage
