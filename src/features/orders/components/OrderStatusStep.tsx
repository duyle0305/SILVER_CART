import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import StorefrontIcon from '@mui/icons-material/Storefront'
import VerifiedIcon from '@mui/icons-material/Verified'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material'
import {
  ColorConnector,
  StepIconBox,
  Wrapper,
} from './styles/OrderStatusStep.style'

export type TOrderStatus =
  | 'Paid'
  | 'PendingChecked'
  | 'PendingConfirm'
  | 'PendingPickup'
  | 'PendingDelivery'
  | 'Shipping'
  | 'Delivered'
  | 'Canceled'

const PIPELINE: Array<{
  key: Exclude<TOrderStatus, 'Canceled'>
  label: string
  Icon: React.ElementType
}> = [
  { key: 'Paid', label: 'Paid', Icon: CheckCircleIcon },
  { key: 'PendingChecked', label: 'Pending Check', Icon: FactCheckIcon },
  { key: 'PendingConfirm', label: 'Pending Confirm', Icon: VerifiedIcon },
  { key: 'PendingPickup', label: 'Pending Pickup', Icon: StorefrontIcon },
  {
    key: 'PendingDelivery',
    label: 'Pending Delivery',
    Icon: PendingActionsIcon,
  },
  { key: 'Shipping', label: 'Shipping', Icon: LocalShippingIcon },
  {
    key: 'Delivered',
    label: 'Delivered',
    Icon: CheckCircleOutlineIcon,
  },
]

export interface OrderStatusStepsProps {
  status: TOrderStatus
}

export default function OrderStatusSteps({ status }: OrderStatusStepsProps) {
  const isCanceled = status === 'Canceled'
  const activeIndex = isCanceled
    ? -1
    : PIPELINE.findIndex((s) => s.key === status)

  return (
    <Wrapper elevation={0}>
      {isCanceled ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CancelIcon color="error" />
          <Typography variant="subtitle1" color="error" fontWeight={600}>
            Canceled
          </Typography>
        </Box>
      ) : (
        <Stepper
          alternativeLabel
          activeStep={activeIndex}
          connector={<ColorConnector />}
        >
          {PIPELINE.map((step, index) => {
            const Icon = step.Icon
            const completed = activeIndex > index
            const active = activeIndex === index
            return (
              <Step key={step.key} completed={completed} active={active}>
                <StepLabel
                  StepIconComponent={() => (
                    <StepIconBox active={active} completed={completed}>
                      <Icon fontSize="small" />
                    </StepIconBox>
                  )}
                >
                  <Typography variant="body2">{step.label}</Typography>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      )}
    </Wrapper>
  )
}
