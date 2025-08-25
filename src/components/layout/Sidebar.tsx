import {
  StyledDrawer,
  StyledListSubheader,
  StyledLogoToolbar,
  StyledNavItem,
  StyledNavList,
} from '@/components/layout/styles/Sidebar.styles'
import { useAuthContext } from '@/contexts/AuthContext'
import { Role } from '@/features/authentication/constants'
import { useLogoutConfirmation } from '@/features/authentication/hooks/useLogoutConfirmation'
import AppsIcon from '@mui/icons-material/Apps'
import CategoryIcon from '@mui/icons-material/Category'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ChatIcon from '@mui/icons-material/Forum'
import InventoryIcon from '@mui/icons-material/Inventory'
import LogoutIcon from '@mui/icons-material/Logout'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import StorefrontIcon from '@mui/icons-material/Storefront'
import RateReviewIcon from '@mui/icons-material/RateReview'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const { openLogoutConfirmationDialog } = useLogoutConfirmation()
  const { user } = useAuthContext()
  const userRole = user?.role

  const dashboardItem = useMemo(
    () => ({
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    }),
    []
  )

  const categories = useMemo(() => {
    if (!userRole) return []
    const items = []

    if (userRole === Role.ADMIN) {
      items.push({
        name: 'Management',
        items: [
          { text: 'Products', icon: <InventoryIcon />, path: '/products' },
          { text: 'Users', icon: <PeopleIcon />, path: '/users' },
          {
            text: 'Categories',
            icon: <CategoryIcon />,
            path: '/categories',
          },
          { text: 'Brands', icon: <StorefrontIcon />, path: '/brands' },
          {
            text: 'Product Properties',
            icon: <AppsIcon />,
            path: '/product-properties',
          },
          {
            text: 'Reports',
            icon: <AssessmentIcon />,
            path: '/reports',
          },
          {
            text: 'Promotions',
            icon: <LocalOfferIcon />,
            path: '/promotions',
          },
        ],
      })
    }

    if (userRole === Role.CONSULTANT) {
      items.push(
        {
          name: 'Management',
          items: [
            { text: 'Products', icon: <InventoryIcon />, path: '/products' },
            { text: 'Users', icon: <PeopleIcon />, path: '/users' },
            {
              text: 'Promotions',
              icon: <LocalOfferIcon />,
              path: '/promotions',
            },
            {
              text: 'Reports',
              icon: <AssessmentIcon />,
              path: '/reports',
            },
          ],
        },
        {
          name: 'General',
          items: [
            { text: 'Chat Box', icon: <ChatIcon />, path: '/chat' },
            // {
            //   text: 'Video Call',
            //   icon: <VideoCallIcon />,
            //   path: '/video-call',
            // },
          ],
        }
      )
    }

    if (userRole === Role.STAFF) {
      items.push(
        {
          name: 'Management',
          items: [
            {
              text: 'Orders',
              icon: <LocalShippingIcon />,
              path: '/orders',
            },
            { text: 'Products', icon: <InventoryIcon />, path: '/products' },
            { text: 'Users', icon: <PeopleIcon />, path: '/users' },
            {
              text: 'Promotions',
              icon: <LocalOfferIcon />,
              path: '/promotions',
            },
            {
              text: 'Feedbacks',
              icon: <RateReviewIcon />,
              path: '/feedbacks',
            },
            {
              text: 'Reports',
              icon: <AssessmentIcon />,
              path: '/reports',
            },
          ],
        },
        {
          name: 'General',
          items: [{ text: 'Chat Box', icon: <ChatIcon />, path: '/chat' }],
        }
      )
    }

    items.push({
      name: 'System',
      items: [
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        {
          text: 'Log out',
          icon: <LogoutIcon />,
          action: openLogoutConfirmationDialog,
        },
      ],
    })

    return items
  }, [openLogoutConfirmationDialog, userRole])

  return (
    <StyledDrawer variant="permanent">
      <StyledLogoToolbar>
        <img src="/logo.svg" alt="logo" width={48} />
        <Typography variant="h6" noWrap>
          Silver Cart
        </Typography>
      </StyledLogoToolbar>

      {user?.role && user?.role === Role.ADMIN && (
        <StyledNavList disablePadding>
          <StyledNavItem component={NavLink} to={dashboardItem.path}>
            <ListItemIcon>{dashboardItem.icon}</ListItemIcon>
            <ListItemText primary={dashboardItem.text} />
          </StyledNavItem>
        </StyledNavList>
      )}

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
