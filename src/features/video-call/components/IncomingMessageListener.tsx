import { useAuthContext } from '@/contexts/AuthContext'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetConnection } from '@/features/video-call/hooks/useGetConnection'
import type { Connection } from '@/features/video-call/types'
import { useConnectToChannel } from '@/features/video-call/hooks/useConnectToChannel'
import { config } from '@/config'
import { useEnsureRtmLogin } from '@/features/chat/hooks/useEnsureRtmLogin'
import { Role } from '@/features/authentication/constants'

const IncomingMessageListener = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { mutateAsync: connectToChannel } = useConnectToChannel()
  const { ensureLogin } = useEnsureRtmLogin(config.agoraAppId)
  const isInChatPage = useMemo(
    () => location.pathname.includes('/chat'),
    [location.pathname]
  )

  const enabled =
    !!user?.userId &&
    (user?.role === Role.CONSULTANT || user?.role === Role.STAFF) &&
    !isInChatPage

  const { data } = useGetConnection(user?.userId || '', enabled)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<Connection | null>(null)

  const isMessage = useMemo(() => data && data.type === 'MESS', [data])

  useEffect(() => {
    if (isMessage && data) {
      setPending(data as Connection)
      setOpen(true)
    }
  }, [isMessage, data])

  const handleOpenChat = async () => {
    if (!pending || !user) return

    let rtmToken: string | undefined
    try {
      const res = await ensureLogin(String(user.userId))
      rtmToken = res?.token ?? undefined
    } catch (e) {
      console.error('RTM login failed:', e)
    }

    try {
      await connectToChannel({
        userId: user.userId,
        channelName: pending.channelName,
        type: pending.type,
        token: rtmToken ?? '',
        consultant: pending.consultant,
      })
    } catch {
      // Ignore errors
    }

    sessionStorage.setItem(
      'sc_pending_chat',
      JSON.stringify({
        channelName: pending.channelName,
        token: rtmToken,
      })
    )

    setOpen(false)
    navigate('/chat')
  }

  if (!pending) return null

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>New message</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {pending.fullName} sent you a message.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">
          Dismiss
        </Button>
        <Button onClick={handleOpenChat} variant="contained">
          Open chat
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IncomingMessageListener
