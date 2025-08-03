import SendIcon from '@mui/icons-material/Send'
import { Box, IconButton, InputBase, Paper, styled } from '@mui/material'

const InputContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: '24px',
  backgroundColor: theme.palette.grey[100],
}))

const MessageInput = () => {
  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
      <InputContainer elevation={0}>
        <InputBase placeholder="Type a message..." fullWidth sx={{ px: 1 }} />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Box>
  )
}

export default MessageInput
