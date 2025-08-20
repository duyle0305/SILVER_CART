import { Paper, StepConnector, stepConnectorClasses } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.divider,
  },
  [`&.Mui-active .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.Mui-completed .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
}))

export const Wrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}))

export const StepIconBox = styled('div')<{
  active?: boolean
  completed?: boolean
  disabled?: boolean
}>(({ theme, active, completed, disabled }) => ({
  display: 'grid',
  placeItems: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `2px solid ${
    completed
      ? theme.palette.primary.main
      : active
        ? theme.palette.primary.main
        : theme.palette.divider
  }`,
  color:
    completed || active
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  background: disabled
    ? theme.palette.action.hover
    : theme.palette.background.paper,
}))
