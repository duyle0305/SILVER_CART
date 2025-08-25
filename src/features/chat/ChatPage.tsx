import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'

type LocationState =
  | {
      channelName?: string
      token?: string
    }
  | undefined

const Shell = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

const EmptyCard = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}))

export default function ChatPage() {
  const location = useLocation()
  const state = (location.state as LocationState) || {}

  const [hasPending, setHasPending] = useState<boolean>(!!state?.channelName)

  useEffect(() => {
    if (!hasPending) {
      const raw = sessionStorage.getItem('sc_pending_chat')
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            channelName?: string
            token?: string
          }
          if (parsed?.channelName) setHasPending(true)
        } catch {}
      }
    }
  }, [hasPending])

  const showEmpty = useMemo(() => !hasPending, [hasPending])

  return (
    <Shell>
      {showEmpty ? (
        <EmptyCard elevation={0}>
          <Stack spacing={1.5} alignItems="center">
            <ChatBubbleOutlineIcon fontSize="large" />
            <Typography variant="h6" fontWeight={600}>
              No conversations
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              There are no chat requests at the moment. When a message arrives,
              you’ll receive a notification and can open the chat to connect
              automatically.
            </Typography>
          </Stack>
        </EmptyCard>
      ) : (
        <ChatBox />
      )}
    </Shell>
  )
}
