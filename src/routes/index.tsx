import AppLayout from '@/components/layout/AppLayout'
import { AuthGuard } from '@/features/authentication/components/AuthGuard'
import { GuestGuard } from '@/features/authentication/components/GuestGuard'
import { authorizationAction, Role } from '@/features/authentication/constants'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

const Dashboard = lazy(() => import('@/features/dashboard/DashboardPage'))
const Users = lazy(() => import('@/features/users'))
const UserDetailPage = lazy(() => import('@/features/users/UserDetailPage'))
const CreateUserPage = lazy(() => import('@/features/users/CreateUserPage'))
const Products = lazy(() => import('@/features/products/ProductListPage'))
const ProductDetailPage = lazy(
  () => import('@/features/products/ProductDetailPage')
)
const CreateUpdateProductPage = lazy(
  () => import('@/features/products/CreateUpdateProductPage')
)
const ChatPage = lazy(() => import('@/features/chat/ChatPage'))
const ListCategoryPage = lazy(
  () => import('@/features/categories/ListCategoryPage')
)
const CreateRootCategoryPage = lazy(
  () => import('@/features/categories/CreateRootCategoryPage')
)
const CreateSubCategoryPage = lazy(
  () => import('@/features/categories/CreateSubCategoryPage')
)
const ListBrandPage = lazy(() => import('@/features/brands/ListBrandPage'))
const CreateBrandPage = lazy(() => import('@/features/brands/CreateBrandPage'))
const ListProductPropertyPage = lazy(
  () => import('@/features/product-property/ListProductPropertyPage')
)
const CreateProductPropertyPage = lazy(
  () => import('@/features/product-property/CreateProductPropertyPage')
)
const VideoCallPage = lazy(() => import('@/features/video-call/VideoCallPage'))

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
      // Dashboard
      {
        index: true,
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN, Role.CONSULTANT]}>
            <Dashboard />
          </AuthGuard>
        ),
        handle: {
          title: 'Dashboard',
        },
      },
      // Users
      {
        path: 'users',
        element: <Outlet />,
        handle: {
          title: 'User Management',
        },
        children: [
          {
            index: true,
            element: (
              <AuthGuard roles={authorizationAction.allowViewUser}>
                <Users />
              </AuthGuard>
            ),
          },
          {
            path: 'add',
            element: (
              <AuthGuard roles={authorizationAction.allowCreateUser}>
                <CreateUserPage />
              </AuthGuard>
            ),
            handle: {
              title: 'Create User',
            },
          },
          {
            path: ':id',
            element: (
              <AuthGuard roles={authorizationAction.allowViewUser}>
                <UserDetailPage />
              </AuthGuard>
            ),
            handle: {
              title: 'User Information',
            },
          },
        ],
      },
      // Products
      {
        path: 'products',
        handle: {
          title: 'Product Management',
        },
        children: [
          {
            index: true,
            element: (
              <AuthGuard roles={authorizationAction.allowViewProducts}>
                <Products />
              </AuthGuard>
            ),
          },
          {
            path: 'add',
            element: (
              <AuthGuard roles={authorizationAction.allowCreateProducts}>
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
              <AuthGuard roles={authorizationAction.allowUpdateProducts}>
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
      // Categories
      {
        path: 'categories',
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
            <Outlet />
          </AuthGuard>
        ),
        handle: {
          title: 'Category Management',
        },
        children: [
          {
            index: true,
            element: <ListCategoryPage />,
          },
          {
            path: 'add-root',
            element: <CreateRootCategoryPage />,
            handle: {
              title: 'Create Root Category',
            },
          },
          {
            path: 'add-sub',
            element: <CreateSubCategoryPage />,
            handle: {
              title: 'Create Sub-Category',
            },
          },
        ],
      },
      // Chat
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
      // Brands
      {
        path: 'brands',
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
            <Outlet />
          </AuthGuard>
        ),
        handle: {
          title: 'Brand Management',
        },
        children: [
          {
            index: true,
            element: <ListBrandPage />,
          },
          {
            path: 'add',
            element: <CreateBrandPage />,
            handle: {
              title: 'Create Brand',
            },
          },
        ],
      },
      // Product Properties
      {
        path: 'product-properties',
        element: (
          <AuthGuard roles={[Role.ADMIN, Role.SUPER_ADMIN]}>
            <Outlet />
          </AuthGuard>
        ),
        handle: {
          title: 'Product Property Management',
        },
        children: [
          {
            index: true,
            element: <ListProductPropertyPage />,
          },
          {
            path: 'add',
            element: <CreateProductPropertyPage />,
            handle: {
              title: 'Create Product Property',
            },
          },
        ],
      },
      // Video Call
      {
        path: 'video-call',
        element: (
          <AuthGuard roles={[Role.CONSULTANT]}>
            <VideoCallPage />
          </AuthGuard>
        ),
        handle: {
          title: 'Video Call',
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
