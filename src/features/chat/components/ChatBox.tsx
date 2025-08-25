import { config } from '@/config'
import { useAuthContext } from '@/contexts/AuthContext'
import useAgoraRtm from '@/lib/agora/useAgoraRtm'
import { Avatar, Box, Paper, styled, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MessageInput from './MessageInput'
import MessageBubble from './MessangeBubble'

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '85vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
}))

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
}))

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

type LocationState =
  | {
      channelName?: string
      token?: string
    }
  | undefined

const ChatBox = () => {
  const { user } = useAuthContext()
  const location = useLocation()
  const state = (location.state as LocationState) || {}
  const [joinedOnce, setJoinedOnce] = useState(false)

  const { connected, channelName, messages, joinChannel, sendChannelMessage } =
    useAgoraRtm({
      appId: config.agoraAppId,
      uid: user?.userId || 'guest',
      token: state?.token || undefined,
    })

  useEffect(() => {
    if (state?.channelName && !joinedOnce) {
      joinChannel(state.channelName)
      setJoinedOnce(true)
    }
  }, [state?.channelName, joinChannel, joinedOnce])

  useEffect(() => {
    if (!joinedOnce) {
      const raw = sessionStorage.getItem('sc_pending_chat')
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            channelName?: string
            token?: string
          }
          if (parsed.channelName) {
            joinChannel(parsed.channelName)
            setJoinedOnce(true)
          }
        } finally {
          sessionStorage.removeItem('sc_pending_chat')
        }
      }
    }
  }, [joinedOnce, joinChannel])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    try {
      await sendChannelMessage(text.trim())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ChatContainer elevation={0}>
      <Header>
        <Avatar />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">
            {channelName ? `Channel: ${channelName}` : 'No channel joined'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {connected ? 'Connected' : 'Disconnected'}
          </Typography>
        </Box>
      </Header>

      <MessageArea>
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            sent={String(m.from) === String(user?.userId)}
          />
        ))}
      </MessageArea>

      <MessageInput onSend={handleSend} />
    </ChatContainer>
  )
}

export default ChatBox
