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
  Chip,
  Skeleton,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductDetail } from './hooks/useProductDetail'
import { useNotification } from '@/hooks/useNotification'
import { useEffect } from 'react'
import dayjs from 'dayjs'

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <Grid container spacing={2} sx={{ mb: 1.5 }}>
    <Grid size={{ xs: 4, sm: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={{ xs: 8, sm: 9 }}>
      <Typography variant="body2" fontWeight="medium">
        {value}
      </Typography>
    </Grid>
  </Grid>
)

function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { showNotification } = useNotification()
  const { data: product, isLoading, error } = useProductDetail(id!)

  useEffect(() => {
    if (error) {
      showNotification(
        error.message || 'Failed to load product details.',
        'error'
      )
    }
  }, [error, showNotification])

  const onEdit = () => {
    navigate(`/products/edit/${id}`)
  }

  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={500} />
      </Paper>
    )
  }

  if (!product) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Product not found.</Typography>
      </Paper>
    )
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
          Product Information
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
        {product.videoPath && (
          <Grid size={{ xs: 12, md: 4 }}>
            <CardMedia
              component="video"
              controls
              src={product.videoPath}
              sx={{ borderRadius: 2, width: '100%', mb: 2 }}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <DetailItem label="Brand" value={product.brand} />
          <DetailItem
            label="Description"
            value={product.description || 'N/A'}
          />
          <DetailItem
            label="Categories"
            value={
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {product.categories.map((cat) => (
                  <Chip key={cat.id} label={cat.label} size="small" />
                ))}
              </Stack>
            }
          />
          <DetailItem
            label="Manufacture Date"
            value={dayjs(product.manufactureDate).format('DD/MM/YYYY')}
          />
          <DetailItem
            label="Expiration Date"
            value={dayjs(product.expirationDate).format('DD/MM/YYYY')}
          />
          <DetailItem
            label="Dimensions"
            value={`W:${product.width} x H:${product.height} x L:${product.length} (cm)`}
          />
          <DetailItem label="Weight" value={`${product.weight} g`} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Variants
      </Typography>

      <Stack spacing={2}>
        {product.productVariants.map((variant) => (
          <Paper key={variant.id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {variant.productVariantValues
                .map((v) => v.valueLabel)
                .join(' - ')}
            </Typography>
            <DetailItem
              label="Price"
              value={`${variant.price.toLocaleString()} VND`}
            />
            <DetailItem label="Stock" value={variant.stock} />
            <DetailItem
              label="Status"
              value={
                variant.isActive ? (
                  <Chip label="Active" color="success" size="small" />
                ) : (
                  <Chip label="Inactive" color="default" size="small" />
                )
              }
            />
          </Paper>
        ))}
      </Stack>
    </Paper>
  )
}

export default ProductDetailPage
