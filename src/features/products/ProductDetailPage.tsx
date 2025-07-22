import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid size={{ xs: 4 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={{ xs: 8 }}>
      <Typography variant="body2" fontWeight="medium">
        {value}
      </Typography>
    </Grid>
  </Grid>
)

function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const onEdit = () => {
    navigate(`/products/edit/${id}`)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Product information
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
            Edit
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <CardMedia
            component="img"
            image="https://via.placeholder.com/400x400.png?text=Product+Image"
            alt="Vinamilk Fresh Milk"
            sx={{ borderRadius: 2, width: '100%' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" gutterBottom>
            Vinamilk Fresh Milk
          </Typography>
          <DetailItem
            label="Description"
            value="Vinamilk Fresh Milk is a high-quality dairy product made from 100% fresh cow's milk, sourced from modern farms in Vietnam."
          />
          <DetailItem label="Product type" value="Pasteurized Milk" />
          <DetailItem label="Category" value="Drinking Milk" />
          <DetailItem label="Stock" value="5,000" />
          <DetailItem label="Original price" value="35,000 VND" />
          <DetailItem label="Discount price" value="30,000 VND" />
          <DetailItem label="Weight" value="180ml" />
          <DetailItem
            label="Video"
            value={
              <Stack direction="row" spacing={1}>
                <CardMedia
                  component="img"
                  image="https://via.placeholder.com/100x100.png?text=Video+1"
                  sx={{ width: 100, height: 100, borderRadius: 1 }}
                />
                <CardMedia
                  component="img"
                  image="https://via.placeholder.com/100x100.png?text=Video+2"
                  sx={{ width: 100, height: 100, borderRadius: 1 }}
                />
              </Stack>
            }
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ProductDetailPage
