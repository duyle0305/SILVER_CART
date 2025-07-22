import { confirmLogoutDialog } from '@/dialogs/registry'
import { clearTokens } from '@/features/authentication/utils/tokenStorage'
import { useDialog } from '@/hooks/useDialog'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLogoutConfirmation = () => {
  const navigate = useNavigate()
  const { showDialog, hideDialog } = useDialog()

  const handleConfirmLogout = useCallback(() => {
    clearTokens()
    hideDialog()
    navigate('/login', { replace: true })
  }, [hideDialog, navigate])

  const openLogoutConfirmationDialog = useCallback(() => {
    showDialog(confirmLogoutDialog(handleConfirmLogout, hideDialog))
  }, [showDialog, hideDialog, handleConfirmLogout])

  return { openLogoutConfirmationDialog }
}
