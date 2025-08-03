import { Grid, Box } from '@mui/material'
import ConversationList from './components/ConversationList'
import Chatbox from './components/ChatBox'

export default function ChatPage() {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ConversationList />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Chatbox />
        </Grid>
      </Grid>
    </Box>
  )
}
