import SearchIcon from '@mui/icons-material/Search'
import {
  Avatar,
  Box,
  Divider,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const conversations = [
  { id: 1, name: 'Alexander Smith', message: 'Lorem ipsum dolor sit amet' },
  { id: 2, name: 'Jane Doe', message: 'Sure, I will get back to you.' },
  { id: 3, name: 'John Applessed', message: 'Can we schedule a meeting?' },
]

function ConversationList() {
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
  }

  return (
    <Paper sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Messages
        </Typography>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search for..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {conversations.map((convo) => (
          <ListItemButton
            key={convo.id}
            selected={selectedIndex === convo.id}
            onClick={() => handleListItemClick(convo.id)}
            sx={{ borderRadius: 1.5, mb: 0.5 }}
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary={convo.name} secondary={convo.message} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}

export default ConversationList
