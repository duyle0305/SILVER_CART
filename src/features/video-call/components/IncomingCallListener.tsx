import { useAuthContext } from '@/contexts/AuthContext'
import { Role } from '@/features/authentication/constants'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeclineCall } from '../hooks/useDeclineCall'
import { useGetConnection } from '../hooks/useGetConnection'
import type { Connection } from '../types'

const CallerRow = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}))

const stashConnection = (conn: Connection) => {
  if (!conn?.id) return
  sessionStorage.setItem(`vc:conn:${conn.id}`, JSON.stringify(conn))
}

const isDismissed = (id?: string) => {
  if (!id) return false
  return sessionStorage.getItem(`vc:dismiss:${id}`) === '1'
}

const markDismissed = (id?: string) => {
  if (!id) return
  sessionStorage.setItem(`vc:dismiss:${id}`, '1')
}

export default function IncomingCallListener() {
  const popupRef = useRef<Window | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthContext()

  const isInCallPage = useMemo(
    () => location.pathname.includes('/video-call'),
    [location.pathname]
  )

  const { mutateAsync: declineCall, isPending: declining } = useDeclineCall()

  const enabled =
    !!user?.userId && user?.role === Role.CONSULTANT && !isInCallPage

  const { data: connection } = useGetConnection(user?.userId ?? '', enabled)

  const isCall = connection?.type === 'CALL'
  const open =
    !!connection && isCall && !isInCallPage && !isDismissed(connection?.id)

  const handleDecline = async () => {
    try {
      if (connection?.id) {
        await declineCall(user?.userId ?? '')
        markDismissed(connection.id)
      }
    } catch {
      if (connection?.id) markDismissed(connection.id)
    }
  }

  const handleAccept = () => {
    if (!connection) return
    // Store the connection data in session storage so the video call page can access it
    stashConnection(connection)

    // Open video call in new tab with full browser capabilities
    const url = `/video-call/${connection.id}?tab=true`

    // Open in new tab - this maintains full WebRTC capabilities unlike popup windows
    const newTab = window.open(url, '_blank')

    if (newTab) {
      // Store reference to the tab for communication
      popupRef.current = newTab
      markDismissed(connection.id)
    } else {
      console.error(
        '❌ Failed to open video call tab - popup blocker may be active'
      )
    }
  }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data
      if (!data || typeof data !== 'object') {
        return
      }

      if (data.type === 'VCALL_ENDED') {
        const callerUserId = data.userId as string | undefined
        const receivedProductId = data.productId as string | undefined
        const shouldNavigate = data.shouldNavigateToReports !== false // Default to true

        // Close popup first
        try {
          if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.close()
          }
        } catch (error) {
          console.warn('Error closing popup:', error)
        }
        popupRef.current = null

        // Then navigate to reports if requested
        if (shouldNavigate) {
          const params = new URLSearchParams()
          if (callerUserId) params.set('userId', callerUserId)
          if (receivedProductId) params.set('productId', receivedProductId)

          const qs = `?${params.toString()}`
          const targetUrl = `/reports/add${qs}`

          // Small delay to ensure popup is closed before navigation
          setTimeout(() => {
            navigate(targetUrl, { replace: true })
          }, 100)
        }
      }
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [navigate])

  return (
    <Dialog open={open} onClose={handleDecline}>
      <DialogTitle>Incoming call</DialogTitle>
      <DialogContent>
        <CallerRow direction="row">
          <Typography fontWeight={600}>{connection?.fullName}</Typography>
        </CallerRow>
        <Typography variant="body2">is calling you…</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} variant="outlined" disabled={declining}>
          Decline
        </Button>
        <Button onClick={handleAccept} variant="contained" disabled={declining}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
