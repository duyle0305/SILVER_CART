import AppLayout from '@/components/layout/AppLayout'
import { AuthGuard } from '@/features/authentication/components/AuthGuard'
import { GuestGuard } from '@/features/authentication/components/GuestGuard'
import { Role } from '@/features/authentication/constants'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

const Dashboard = lazy(() => import('@/features/dashboard/DashboardPage'))
const Users = lazy(() => import('@/features/users'))
const UserDetailPage = lazy(() => import('@/features/users/UserDetailPage'))
const Products = lazy(() => import('@/features/products/ProductListPage'))
const ProductDetailPage = lazy(
  () => import('@/features/products/ProductDetailPage')
)
const CreateUpdateProductPage = lazy(
  () => import('@/features/products/CreateUpdateProductPage')
)
const ChatPage = lazy(() => import('@/features/chat/ChatPage'))

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
            <Dashboard />
          </AuthGuard>
        ),
        handle: {
          title: 'Dashboard',
        },
      },
      {
        path: 'users',
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
            <Outlet />
          </AuthGuard>
        ),
        handle: {
          title: 'User Management',
        },
        children: [
          {
            index: true,
            element: <Users />,
          },
          {
            path: ':id',
            element: <UserDetailPage />,
            handle: {
              title: 'User Information',
            },
          },
        ],
      },
      {
        path: 'products',
        handle: {
          title: 'Product Management',
        },
        children: [
          {
            index: true,
            element: (
              <AuthGuard
                roles={[Role.ADMIN, Role.SUPER_ADMIN, Role.CONSULTANT]}
              >
                <Products />
              </AuthGuard>
            ),
          },
          {
            path: 'add',
            element: (
              <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
                <CreateUpdateProductPage />
              </AuthGuard>
            ),
            handle: {
              title: 'Add Product',
            },
          },
          {
            path: 'edit/:id',
            element: (
              <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
                <CreateUpdateProductPage />
              </AuthGuard>
            ),
            handle: {
              title: 'Edit product information',
            },
          },
          {
            path: ':id',
            element: (
              <AuthGuard
                roles={[Role.ADMIN, Role.SUPER_ADMIN, Role.CONSULTANT]}
              >
                <ProductDetailPage />
              </AuthGuard>
            ),
            handle: {
              title: 'Product information',
            },
          },
        ],
      },
      {
        path: 'chat',
        element: (
          <AuthGuard roles={[Role.CONSULTANT]}>
            <ChatPage />
          </AuthGuard>
        ),
        handle: {
          title: 'Chat Box',
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
