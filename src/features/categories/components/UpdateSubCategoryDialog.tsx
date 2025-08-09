import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useCategoriesNoValue } from '../hooks/useCategoriesNoValue'
import { useLinkSubCategory } from '../hooks/useLinkSubCategory'
import { useNotification } from '@/hooks/useNotification'
import type { SubCategory } from '../types'

interface UpdateSubCategoryDialogProps {
  open: boolean
  onClose: () => void
  subCategory: SubCategory | null
}

const UpdateSubCategoryDialog = ({
  open,
  onClose,
  subCategory,
}: UpdateSubCategoryDialogProps) => {
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const { data: rootCategories = [], isLoading: isLoadingCategories } =
    useCategoriesNoValue()
  const { showNotification } = useNotification()

  const { mutate: linkSubCategory, isPending } = useLinkSubCategory()

  useEffect(() => {
    if (open) {
      setSelectedSubCategoryId('')
    }
  }, [open])

  const handleUpdate = () => {
    if (!subCategory || !selectedSubCategoryId) {
      showNotification('Please select a category from the dropdown.', 'warning')
      return
    }

    linkSubCategory(
      {
        categoryId: subCategory.id,
        subCategoryId: selectedSubCategoryId,
      },
      {
        onSuccess: () => {
          showNotification('Sub-category updated successfully!', 'success')
          onClose()
        },
        onError: (error) => {
          showNotification(
            error.message || 'Failed to update sub-category.',
            'error'
          )
        },
      }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Link to Sub-Category</DialogTitle>
      <DialogContent>
        {isLoadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="category-select-label">Sub-Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedSubCategoryId}
              label="Sub-Category"
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
            >
              {rootCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate} variant="contained" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateSubCategoryDialog
