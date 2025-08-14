import { confirmRemovePromotionDialog } from '@/dialogs/registry'
import { useDialog } from '@/hooks/useDialog'
import { useCallback } from 'react'
import { useRemovePromotion } from './useRemovePromotion'
import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'

export const useRemovePromotionDialog = () => {
  const { showDialog, hideDialog } = useDialog()
  const { showLoader, hideLoader } = useLoader()
  const { showNotification } = useNotification()

  const { mutate: removePromotion } = useRemovePromotion()

  const openRemovePromotionDialog = useCallback(
    (id: string) => {
      showDialog(
        confirmRemovePromotionDialog(() => {
          showLoader()
          removePromotion(id, {
            onSuccess: () => {
              hideLoader()
              hideDialog()
            },
            onError: (error: any) => {
              hideLoader()
              showNotification(
                error?.message || 'Failed to remove promotion.',
                'error'
              )
            },
          })
        }, hideDialog)
      )
    },
    [
      showDialog,
      hideDialog,
      showLoader,
      hideLoader,
      showNotification,
      removePromotion,
    ]
  )

  return {
    openRemovePromotionDialog,
  }
}
