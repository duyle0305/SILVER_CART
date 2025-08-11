import { AuthProvider } from '@/contexts/AuthContext'
import { DialogProvider } from '@/contexts/DialogContext'
import { LoaderProvider } from '@/contexts/LoaderContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import '@/index.css'
import { router } from '@/routes'
import { theme } from '@/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogProvider>
          <NotificationProvider>
            <LoaderProvider>
              <AuthProvider>
                <CssBaseline />
                <RouterProvider router={router} />
              </AuthProvider>
            </LoaderProvider>
          </NotificationProvider>
        </DialogProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </QueryClientProvider>
)
