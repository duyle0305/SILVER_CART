import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubCategoryTable from './components/SubCategoryTable'
import { useCategories } from './hooks/useCategories'

const ListCategoryPage = () => {
  const { data: categories = [], isLoading } = useCategories()
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleToggle = (categoryId: string) => {
    setOpenCategoryId((prevId) => (prevId === categoryId ? null : categoryId))
  }

  return (
    <Paper sx={{ p: 3, boxShadow: 'none' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All categories
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/categories/add-root')}
          >
            Add root category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/categories/add-sub')}
          >
            Add sub-category
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {isLoading
          ? Array.from(new Array(5)).map((_, index) => (
              <Paper key={index} sx={{ p: 2 }}>
                <Skeleton variant="text" width="100%" height={48} />
              </Paper>
            ))
          : categories.map((category) => {
              const isOpen = openCategoryId === category.id
              return (
                <Paper key={category.id} variant="outlined">
                  <Stack
                    direction="row"
                    alignItems="center"
                    onClick={() => handleToggle(category.id)}
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{category.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.note}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      {isOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Stack>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                      <SubCategoryTable subCategories={category.values} />
                    </Box>
                  </Collapse>
                </Paper>
              )
            })}
      </Stack>
    </Paper>
  )
}

export default ListCategoryPage
