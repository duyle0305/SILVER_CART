import AppLayout from '@/components/layout/AppLayout'
import { AuthGuard } from '@/features/authentication/components/AuthGuard'
import { GuestGuard } from '@/features/authentication/components/GuestGuard'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

// Importing components in main layout
const Dashboard = lazy(() => import('@/features/dashboard'))
const Users = lazy(() => import('@/features/users'))
const UserDetailPage = lazy(() => import('@/features/users/UserDetailPage'))
const Products = lazy(() => import('@/features/products'))
const ProductDetailPage = lazy(
  () => import('@/features/products/ProductDetailPage')
)
const CreateUpdateProductPage = lazy(
  () => import('@/features/products/CreateUpdateProductPage')
)

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
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            handle: {
              title: 'Dashboard',
            },
          },
          {
            path: 'users',
            element: <Outlet />,
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
                element: <Products />,
              },
              {
                path: 'add',
                element: <CreateUpdateProductPage />,
                handle: {
                  title: 'Add Product',
                },
              },
              {
                path: 'edit/:id',
                element: <CreateUpdateProductPage />,
                handle: {
                  title: 'Edit product information',
                },
              },
              {
                path: ':id',
                element: <ProductDetailPage />,
                handle: {
                  title: 'Product information',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
