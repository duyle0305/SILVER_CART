import { useAuthContext } from '@/contexts/AuthContext'
import { useNotification } from '@/hooks/useNotification'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Button,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { authorizationAction } from '../authentication/constants'
import { useProductDetail } from './hooks/useProductDetail'
import { useDeactiveOrActiveProduct } from './hooks/useDeactiveOrActiveProduct'

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
      {label === 'Description' ? (
        <Typography
          variant="body2"
          fontWeight="medium"
          dangerouslySetInnerHTML={{ __html: String(value) }}
        />
      ) : (
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      )}
    </Grid>
  </Grid>
)

function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { showNotification } = useNotification()
  const { data: product, isLoading, error } = useProductDetail(id!)
  const { mutateAsync: toggleProductStatus } = useDeactiveOrActiveProduct()
  const { user } = useAuthContext()
  const allowModifyProducts =
    (user?.role &&
      authorizationAction.allowCreateProducts.includes(user.role)) ||
    (user?.role && authorizationAction.allowUpdateProducts.includes(user.role))

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight="bold">
            Product Information
          </Typography>
          <Chip
            size="small"
            color={product.isActive ? 'success' : 'error'}
            label={product.isActive ? 'Active' : 'Inactive'}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          {allowModifyProducts && (
            <>
              {product.isActive ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => toggleProductStatus(product.id)}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => toggleProductStatus(product.id)}
                >
                  Activate
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
              >
                Edit
              </Button>
            </>
          )}
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
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
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
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Images
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 1 }}
                >
                  {variant.productImages.length > 0 ? (
                    variant.productImages.map((image) => (
                      <Avatar
                        key={image.id}
                        src={image.url}
                        variant="rounded"
                        style={{
                          width: 64,
                          height: 64,
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption">No images</Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Paper>
  )
}

export default ProductDetailPage
