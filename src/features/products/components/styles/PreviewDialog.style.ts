import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledCloseIcon = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'white',
  },
  zIndex: 999,
}))

export const StyledVideo = styled('video')({
  maxWidth: '100%',
  maxHeight: '85vh',
  display: 'block',
})

export const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '85vh',
  display: 'block',
})
