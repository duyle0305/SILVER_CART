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
import { useGetConnection } from '../hooks/useGetConnection'
import type { Connection } from '../types'
import { useDeclineCall } from '../hooks/useDeclineCall'

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
    stashConnection(connection)

    const params = new URLSearchParams()
    params.set('channel', connection.channelName)
    if (connection.token) params.set('token', connection.token)
    params.set('popup', '1')

    const url = `/video-call/${connection.id}?${params.toString()}`

    const popup = window.open(
      url,
      `videocall-${connection.id}`,
      ['width=1024', 'height=720', 'noopener', 'noreferrer'].join(',')
    )

    if (popup) {
      popupRef.current = popup
      markDismissed(connection.id)
    } else {
      navigate(url, { state: { connection }, replace: false })
    }
  }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const data = e.data
      if (!data || typeof data !== 'object') return

      if (data.type === 'VCALL_ENDED') {
        const callerUserId = data.userId as string | undefined
        const qs = callerUserId
          ? `?userId=${encodeURIComponent(callerUserId)}`
          : ''
        navigate(`/reports/add${qs}`, { replace: true })

        try {
          popupRef.current?.close()
        } catch {}
        popupRef.current = null
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
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
        <Button onClick={handleDecline} variant="outlined" loading={declining}>
          Decline
        </Button>
        <Button onClick={handleAccept} variant="contained" loading={declining}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
