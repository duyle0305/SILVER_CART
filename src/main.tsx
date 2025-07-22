import { DialogProvider } from '@/contexts/DialogContext'
import { LoaderProvider } from '@/contexts/LoaderContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import '@/index.css'
import { router } from '@/routes'
import { theme } from '@/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <NotificationProvider>
            <LoaderProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </LoaderProvider>
          </NotificationProvider>
        </DialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
