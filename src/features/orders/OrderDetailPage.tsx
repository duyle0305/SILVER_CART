import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail'
import { useNotification } from '@/hooks/useNotification'
import HomeIcon from '@mui/icons-material/Home'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import OrderStatusSteps, {
  type TOrderStatus,
} from './components/OrderStatusStep'
import { useFakeGHNChangeStatus } from './hooks/useFakeGHNChangeStatus'
import { useCreateOrderInGHN } from './hooks/useCreateOrderInGHN'
import { authorizationAction } from '../authentication/constants'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFakeGHNCanceledOrder } from './hooks/useFakeGHNCancel'

const currency = (v: number) => v.toLocaleString('vi-VN') + ' VND'

const statusChip = (status: string) => {
  let color: 'success' | 'warning' | 'info' | 'error' | 'default' = 'default'
  let label = ''
  switch (status) {
    case 'Paid':
      color = 'success'
      label = 'Paid'
      break
    case 'PendingConfirm':
      color = 'warning'
      label = 'Pending Confirm'
      break
    case 'PendingPickup':
      color = 'warning'
      label = 'Pending Pickup'
      break
    case 'PendingDelivery':
      color = 'warning'
      label = 'Pending Delivery'
      break
    case 'Shipping':
      color = 'info'
      label = 'Shipping'
      break
    case 'Delivered':
      color = 'success'
      label = 'Delivered'
      break
    case 'Canceled':
      color = 'error'
      label = 'Canceled'
      break
    default:
      color = 'default'
  }
  return <Chip size="small" label={label} color={color} />
}

const renderStatusAction = (
  status: string,
  isLoading: boolean,
  onAction: () => void,
  onCancel: () => void
) => {
  switch (status) {
    case 'Paid':
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          loading={isLoading}
        >
          Confirm
        </Button>
      )

    case 'PendingConfirm':
    case 'PendingPickup':
    case 'PendingDelivery':
    case 'Shipping':
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="info"
            onClick={onAction}
            loading={isLoading}
          >
            GHN change status
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
            loading={isLoading}
          >
            GHN cancel status
          </Button>
        </Stack>
      )

    case 'Delivered':
    case 'Canceled':
    default:
      return null
  }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { showNotification } = useNotification()
  const { user } = useAuthContext()
  const allowModifyStatusOrder =
    (user?.role &&
      authorizationAction.allowModifyStatusOrder.includes(user.role)) ||
    (user?.role &&
      authorizationAction.allowModifyStatusOrder.includes(user.role))

  const { data: order, isLoading, error } = useOrderDetail(id!)
  const { mutateAsync: changeStatus, isPending } = useCreateOrderInGHN()
  const { mutateAsync: fakeGHNChangeStatus, isPending: isFakePending } =
    useFakeGHNChangeStatus()
  const {
    mutateAsync: fakeGHNCanceledOrder,
    isPending: isFakeCanceledPending,
  } = useFakeGHNCanceledOrder()

  useEffect(() => {
    if (error) {
      showNotification(
        (error as Error)?.message || 'Failed to load order.',
        'error'
      )
    }
  }, [error, showNotification])

  const itemSubtotal = useMemo(() => {
    if (!order?.orderDetails) return 0
    return order.orderDetails.reduce((sum, d) => sum + d.price * d.quantity, 0)
  }, [order])

  const payable = useMemo(() => {
    if (!order) return 0
    return Math.max(order.totalPrice - order.discount, 0)
  }, [order])

  const address = useMemo(() => {
    if (!order) return ''
    const parts = [
      order.streetAddress,
      order.wardName,
      order.districtName,
      order.provinceName,
    ].filter(Boolean)
    return parts.join(', ')
  }, [order])

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="primary">
            {order
              ? `Order #${order.id.slice(0, 8).toUpperCase()}`
              : 'Order Detail'}
          </Typography>
          {isLoading ? (
            <Skeleton variant="rounded" width={64} height={24} />
          ) : (
            order && statusChip(order.orderStatus)
          )}
        </Stack>
        <Stack>
          {order &&
            allowModifyStatusOrder &&
            renderStatusAction(
              order.orderStatus,
              [
                'PendingConfirm',
                'PendingPickup',
                'PendingDelivery',
                'Shipping',
              ].includes(order.orderStatus)
                ? isFakePending || isFakeCanceledPending
                : isPending,
              async () => {
                if (
                  [
                    'PendingConfirm',
                    'PendingPickup',
                    'PendingDelivery',
                    'Shipping',
                  ].includes(order.orderStatus)
                ) {
                  await fakeGHNChangeStatus({ orderId: id! })
                } else {
                  await changeStatus({ orderId: id! })
                }
              },
              async () => {
                await fakeGHNCanceledOrder({ orderId: id! })
              }
            )}
        </Stack>
      </Stack>

      <Box mb={2}>
        {isLoading ? (
          <Skeleton variant="rounded" height={64} />
        ) : (
          order && (
            <OrderStatusSteps status={order.orderStatus as TOrderStatus} />
          )
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} variant="outlined">
            <Stack p={2} spacing={2}>
              <Typography variant="h6">Items</Typography>
              {isLoading ? (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                </Stack>
              ) : (
                <TableContainer>
                  <Table size="small" aria-label="order items">
                    <TableHead>
                      <TableRow>
                        <TableCell width={56}>#</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Line Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order?.orderDetails?.map((d, idx) => {
                        const thumb = d.images?.[0]
                        const lineTotal = d.price * d.quantity - d.discount
                        return (
                          <TableRow key={d.id} hover>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar src={thumb} variant="rounded" />
                                <Stack spacing={0}>
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    sx={{ maxWidth: 360 }}
                                  >
                                    {d.productName}
                                  </Typography>
                                  {d.style && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      noWrap
                                    >
                                      {d.style}
                                    </Typography>
                                  )}
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell align="right">
                              {currency(d.price)}
                            </TableCell>
                            <TableCell align="right">{d.quantity}</TableCell>
                            <TableCell align="right">
                              {d.discount ? currency(d.discount) : '—'}
                            </TableCell>
                            <TableCell align="right">
                              {currency(Math.max(lineTotal, 0))}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {!order?.orderDetails?.length && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography color="text.secondary">
                              No items.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper elevation={0} variant="outlined">
              <Stack p={2} spacing={1.5}>
                <Typography variant="h6">Summary</Typography>
                {isLoading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} />
                    <Divider />
                    <Skeleton variant="rounded" height={28} />
                  </Stack>
                ) : (
                  <>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Items Subtotal
                      </Typography>
                      <Typography>{currency(itemSubtotal)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Total</Typography>
                      <Typography>
                        {currency(order?.totalPrice ?? 0)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Discount</Typography>
                      <Typography>
                        - {currency(order?.discount ?? 0)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight={700}>
                        Payable
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {currency(payable)}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>

            <Paper elevation={0} variant="outlined">
              <Stack p={2} spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalPhoneIcon fontSize="small" />
                  <Typography variant="h6">Contact</Typography>
                </Stack>
                {isLoading ? (
                  <Skeleton variant="rounded" height={24} />
                ) : (
                  <>
                    <Typography variant="body2">
                      <strong>Name: </strong>
                      {order?.customerName || order?.elderName || '—'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone: </strong>
                      {order?.phoneNumber || '—'}
                    </Typography>
                  </>
                )}
              </Stack>
            </Paper>

            <Paper elevation={0} variant="outlined">
              <Stack p={2} spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HomeIcon fontSize="small" />
                  <Typography variant="h6">Shipping Address</Typography>
                </Stack>
                {isLoading ? (
                  <Skeleton variant="rounded" height={24} />
                ) : (
                  <Typography variant="body2">{address || '—'}</Typography>
                )}
              </Stack>
            </Paper>

            <Paper elevation={0} variant="outlined">
              <Stack p={2} spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StickyNote2Icon fontSize="small" />
                  <Typography variant="h6">Note</Typography>
                </Stack>
                {isLoading ? (
                  <Skeleton variant="rounded" height={24} />
                ) : (
                  <Typography
                    variant="body2"
                    color={order?.note ? 'text.primary' : 'text.secondary'}
                  >
                    {order?.note || 'No note.'}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}
