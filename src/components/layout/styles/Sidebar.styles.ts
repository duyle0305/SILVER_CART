import {
  Drawer,
  List,
  ListItemButton,
  ListSubheader,
  Toolbar,
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

export const DRAWER_WIDTH = 280

export const StyledDrawer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
  },
})

export const StyledLogoToolbar = styled(Toolbar)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '32px',
})

export const StyledNavList = styled(List)({
  paddingLeft: '16px',
  paddingRight: '16px',
})

export const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ component?: React.ElementType; to?: string }>(({ theme }) => ({
  borderRadius: '8px',
  position: 'relative',
  transition: 'background-color 0.3s',
  width: '100%',

  '& .MuiListItemIcon-root': {
    minWidth: '35px',
  },

  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 'bold',

    '& .MuiListItemIcon-root': {
      color: 'inherit',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      height: '60%',
      width: '4px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '4px',
    },
  },
}))

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  padding: 0,
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
}))
