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
import { useListProductProperty } from './hooks/useListProductProperty'
import SubProductPropertyTable from './components/SubProductPropertyTable'

const ListProductPropertyPage = () => {
  const { data: productProperties = [], isLoading } = useListProductProperty()
  const [openProductPropertyId, setOpenProductPropertyId] = useState<
    string | null
  >(null)
  const navigate = useNavigate()

  const handleToggle = (productPropertyId: string) => {
    setOpenProductPropertyId((prevId) =>
      prevId === productPropertyId ? null : productPropertyId
    )
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
          All product properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('add')}
        >
          Add product property
        </Button>
      </Stack>

      <Stack spacing={2}>
        {isLoading
          ? Array.from(new Array(5)).map((_, index) => (
              <Paper key={index} sx={{ p: 2 }}>
                <Skeleton variant="text" width="100%" height={48} />
              </Paper>
            ))
          : productProperties.map((productProperty) => {
              const isOpen = openProductPropertyId === productProperty.id
              return (
                <Paper key={productProperty.id} variant="outlined">
                  <Stack
                    direction="row"
                    alignItems="center"
                    onClick={() => handleToggle(productProperty.id)}
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        {productProperty.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {productProperty.note}
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
                      <SubProductPropertyTable
                        subProductProperties={productProperty.values}
                      />
                    </Box>
                  </Collapse>
                </Paper>
              )
            })}
      </Stack>
    </Paper>
  )
}

export default ListProductPropertyPage
