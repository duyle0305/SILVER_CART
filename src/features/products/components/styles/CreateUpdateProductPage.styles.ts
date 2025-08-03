import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import { styled } from '@mui/material/styles'

export const FormWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  width: '150px',
  textAlign: 'center',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  marginLeft: '0 !important',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))

export const ImagePreviewBox = styled(Box)({
  position: 'relative',
  cursor: 'pointer',
})

export const StyledAvatar = styled(Avatar)({
  width: 150,
  height: 150,
})

export const RemoveImageButton = styled(IconButton)({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  zIndex: 999,
})

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}))

export const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.overline,
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}))

export const VariantPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  marginBottom: theme.spacing(2),
  position: 'relative',
}))

export const ProductItemWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
}))

export const AddItemButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderStyle: 'dashed',
  marginTop: theme.spacing(2),
}))

export const AddVariantButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}))

export const ActionButtonsContainer = styled(Stack)({
  justifyContent: 'flex-end',
})

export const RemoveButton = styled(IconButton)({
  marginBottom: '8px',
})

export const StyledVideoName = styled(Typography)({
  maxWidth: '150px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: 'block',
  marginTop: '4px',
})
