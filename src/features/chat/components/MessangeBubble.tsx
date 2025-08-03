import { Box, styled, Typography } from '@mui/material'

interface MessageBubbleProps {
  sent?: boolean
}

const Bubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sent',
})<MessageBubbleProps>(({ theme, sent }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  maxWidth: '70%',
  backgroundColor: sent ? theme.palette.primary.main : theme.palette.grey[200],
  color: sent ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: sent ? 'flex-end' : 'flex-start',
}))

interface MessageProps extends MessageBubbleProps {
  text: string
}

const MessageBubble = ({ text, sent }: MessageProps) => {
  return (
    <Bubble sent={sent}>
      <Typography variant="body2">{text}</Typography>
    </Bubble>
  )
}

export default MessageBubble
