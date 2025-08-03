import { Avatar, Box, Paper, Stack, styled, Typography } from '@mui/material'
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
}))

const MessageArea = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const messages = [
  { id: 1, text: 'Hey, how are you?', sent: false },
  { id: 2, text: 'I am good, thanks for asking!', sent: true },
  { id: 3, text: 'What about you?', sent: true },
  {
    id: 4,
    text: 'Doing great! Just working on this chat component.',
    sent: false,
  },
  { id: 5, text: 'That sounds interesting! Are you using React?', sent: false },
  {
    id: 6,
    text: 'Yes, I am using React with TypeScript and Material UI.',
    sent: true,
  },
  {
    id: 7,
    text: 'Nice! Material UI makes things look so much better.',
    sent: false,
  },
  {
    id: 8,
    text: 'Absolutely! The components are really flexible.',
    sent: true,
  },
  {
    id: 9,
    text: 'How long did it take you to set up the chat UI?',
    sent: false,
  },
  {
    id: 10,
    text: 'Not too long. The most time-consuming part was styling.',
    sent: true,
  },
  {
    id: 11,
    text: 'I can imagine. Customizing styles can be tricky.',
    sent: false,
  },
  {
    id: 12,
    text: 'Yeah, but I learned a lot about the styled API.',
    sent: true,
  },
  { id: 13, text: 'Are you planning to add real-time messaging?', sent: false },
  {
    id: 14,
    text: 'Eventually, yes! I want to integrate with a backend soon.',
    sent: true,
  },
  {
    id: 15,
    text: 'Let me know if you need help with sockets or APIs.',
    sent: false,
  },
  {
    id: 16,
    text: 'Thanks! I appreciate it. I might reach out soon.',
    sent: true,
  },
  {
    id: 17,
    text: 'No problem! Good luck with the rest of the project.',
    sent: false,
  },
  { id: 18, text: 'Thank you! Have a great day!', sent: true },
  { id: 19, text: 'You too!', sent: false },
]

const ChatBox = () => {
  return (
    <ChatContainer elevation={3}>
      <Header>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Annie Suh
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active now
            </Typography>
          </Box>
        </Stack>
      </Header>

      <MessageArea>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} sent={msg.sent} />
        ))}
      </MessageArea>

      <MessageInput />
    </ChatContainer>
  )
}

export default ChatBox
