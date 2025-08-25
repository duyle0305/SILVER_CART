import { Button, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  minHeight: '100%',
  background: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

export const Frame = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '80vh',
  borderRadius: 12,
  padding: 0,
  background: theme.palette.grey[50],
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[200]}`,
  overflow: 'hidden',
}))

export const Header = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  zIndex: 2,
}))

export const Controls = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: theme.spacing(2.5),
  display: 'flex',
  gap: theme.spacing(4),
  zIndex: 5,
}))

export const CircleButton = styled(Button)(() => ({
  minWidth: 0,
  width: 56,
  height: 56,
  borderRadius: '999px',
  boxShadow: 'none',
  textTransform: 'none',
  padding: 0,
}))

export const RemoteVideo = styled('div')({
  position: 'absolute',
  inset: 0,
  backgroundColor: '#eee',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})

export const LocalVideoPip = styled('div')({
  position: 'absolute',
  width: 180,
  aspectRatio: '16 / 9',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#eee',
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  transform: 'scaleX(-1)',
  zIndex: 2,
  cursor: 'grab',
  touchAction: 'none',
})

export const ControlWithLabel = styled('div')(({ theme }) => ({
  display: 'grid',
  justifyItems: 'center',
  gap: theme.spacing(1),
}))
