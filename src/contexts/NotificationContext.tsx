import { Alert, Snackbar, type AlertColor } from '@mui/material'
import { useToggle } from 'ahooks'
import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void
  hideNotification: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')
  const lastNotificationRef = useRef<{
    message: string
    severity: AlertColor
  } | null>(null)

  const showNotification = useCallback(
    (newMessage: string, newSeverity: AlertColor = 'info') => {
      const lastNotification = lastNotificationRef.current
      if (
        lastNotification &&
        lastNotification.message === newMessage &&
        lastNotification.severity === newSeverity
      ) {
        return
      }

      lastNotificationRef.current = {
        message: newMessage,
        severity: newSeverity,
      }
      setMessage(newMessage)
      setSeverity(newSeverity)
      open()
    },
    [open]
  )

  const hideNotification = useCallback(() => {
    close()
    setTimeout(() => {
      lastNotificationRef.current = null
    }, 100)
  }, [close])

  const handleClose = useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      hideNotification()
    },
    [hideNotification]
  )

  const handleAlertClose = useCallback(
    (event?: React.SyntheticEvent) => {
      event?.stopPropagation()
      hideNotification()
    },
    [hideNotification]
  )

  const contextValue = useMemo(
    () => ({
      showNotification,
      hideNotification,
    }),
    [showNotification, hideNotification]
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={6000} // 6 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
