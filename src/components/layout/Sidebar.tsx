import {
  StyledDrawer,
  StyledListSubheader,
  StyledLogoToolbar,
  StyledNavItem,
  StyledNavList,
} from '@/components/layout/styles/Sidebar.styles'
import { useLogoutConfirmation } from '@/features/authentication/hooks/useLogoutConfirmation'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import InventoryIcon from '@mui/icons-material/Inventory'
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const { openLogoutConfirmationDialog } = useLogoutConfirmation()

  const dashboardItem = useMemo(
    () => ({
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    }),
    []
  )

  const categories = useMemo(() => {
    return [
      {
        name: 'Management',
        items: [
          { text: 'Users', icon: <PeopleIcon />, path: '/users' },
          { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        ],
      },
      {
        name: 'System',
        items: [
          { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
          {
            text: 'Log out',
            icon: <LogoutIcon />,
            action: openLogoutConfirmationDialog,
          },
        ],
      },
    ]
  }, [openLogoutConfirmationDialog])

  return (
    <StyledDrawer variant="permanent">
      <StyledLogoToolbar>
        <img src="/logo.svg" alt="logo" width={48} />
        <Typography variant="h6" noWrap>
          Silver Cart
        </Typography>
      </StyledLogoToolbar>

      <StyledNavList disablePadding>
        <StyledNavItem component={NavLink} to={dashboardItem.path}>
          <ListItemIcon>{dashboardItem.icon}</ListItemIcon>
          <ListItemText primary={dashboardItem.text} />
        </StyledNavItem>
      </StyledNavList>

      <StyledNavList>
        {categories.map((category) => (
          <div key={category.name}>
            <StyledListSubheader>{category.name}</StyledListSubheader>
            {category.items.map((item) => (
              <ListItem key={item.text} disablePadding>
                {item.path ? (
                  <StyledNavItem component={NavLink} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </StyledNavItem>
                ) : (
                  <StyledNavItem component="button" onClick={item.action}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </StyledNavItem>
                )}
              </ListItem>
            ))}
          </div>
        ))}
      </StyledNavList>
    </StyledDrawer>
  )
}

export default Sidebar
