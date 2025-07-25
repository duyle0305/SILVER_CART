import { Backdrop, CircularProgress } from '@mui/material'

export function FullPageLoader() {
  return (
    <Backdrop
      open={true}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
