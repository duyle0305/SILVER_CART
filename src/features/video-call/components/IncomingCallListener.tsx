import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { onIncomingCall, type IncomingCallPayload } from '@/lib/callSignaling'
import { useLocation, useNavigate } from 'react-router-dom'

const CallerRow = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}))

export default function IncomingCallListener() {
  const [incoming, setIncoming] = useState<IncomingCallPayload | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isInCallPage = useMemo(
    () => location.pathname.includes('/video-call'),
    [location.pathname]
  )

  useEffect(() => {
    const off = onIncomingCall((payload) => {
      if (isInCallPage) return
      setIncoming(payload)
    })
    return off
  }, [isInCallPage])

  const handleDecline = () => setIncoming(null)

  const handleAccept = () => {
    if (!incoming) return
    const params = new URLSearchParams()
    params.set('channel', incoming.channel)
    if (incoming.token) params.set('token', String(incoming.token))
    if (incoming.uid !== undefined && incoming.uid !== null)
      params.set('uid', String(incoming.uid))
    navigate(`/video-call?${params.toString()}`)
    setIncoming(null)
  }

  return (
    <Dialog open={!!incoming} onClose={handleDecline}>
      <DialogTitle>Incoming call</DialogTitle>
      <DialogContent>
        <CallerRow direction="row">
          <Avatar
            src={incoming?.avatarUrl}
            alt={incoming?.callerName}
            sx={{ width: 36, height: 36 }}
          />
          <Typography fontWeight={600}>{incoming?.callerName}</Typography>
        </CallerRow>
        <Typography variant="body2">is calling you…</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} variant="outlined">
          Decline
        </Button>
        <Button onClick={handleAccept} variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
