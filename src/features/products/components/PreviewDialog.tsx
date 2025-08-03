import {
  StyledCloseIcon,
  StyledImage,
  StyledVideo,
} from '@/features/products/components/styles/PreviewDialog.style'
import CloseIcon from '@mui/icons-material/Close'
import { Backdrop, Box, Dialog, DialogContent, Fade } from '@mui/material'

interface PreviewDialogProps {
  file: File | null
  onClose: () => void
}

const PreviewDialog = ({ file, onClose }: PreviewDialogProps) => {
  if (!file) {
    return null
  }

  const isVideo = file.type.startsWith('video/')
  const url = URL.createObjectURL(file)

  return (
    <Dialog
      open={!!file}
      onClose={onClose}
      maxWidth="lg"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      closeAfterTransition
    >
      <Fade in={!!file}>
        <Box sx={{ position: 'relative' }}>
          <StyledCloseIcon onClick={onClose}>
            <CloseIcon />
          </StyledCloseIcon>
          <DialogContent sx={{ p: 1 }}>
            {isVideo ? (
              <StyledVideo src={url} controls autoPlay />
            ) : (
              <StyledImage src={url} alt={file.name} />
            )}
          </DialogContent>
        </Box>
      </Fade>
    </Dialog>
  )
}

export default PreviewDialog
