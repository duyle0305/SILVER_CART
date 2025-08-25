import SendIcon from '@mui/icons-material/Send'
import { Box, IconButton, InputBase, Paper, styled } from '@mui/material'
import { useState } from 'react'

const InputContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: '24px',
  backgroundColor: theme.palette.grey[100],
}))

type Props = {
  onSend?: (text: string) => void
}

const MessageInput = ({ onSend }: Props) => {
  const [value, setValue] = useState('')

  const triggerSend = () => {
    if (!value.trim()) return
    onSend?.(value)
    setValue('')
  }

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
      <InputContainer elevation={0}>
        <InputBase
          placeholder="Type a message..."
          fullWidth
          sx={{ px: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              triggerSend()
            }
          }}
        />
        <IconButton color="primary" onClick={triggerSend}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Box>
  )
}

export default MessageInput
