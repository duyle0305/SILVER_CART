import { confirmLogoutDialog } from '@/dialogs/registry'
import { clearTokens } from '@/features/authentication/utils/tokenStorage'
import { useDialog } from '@/hooks/useDialog'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export const useLogoutConfirmation = () => {
  const navigate = useNavigate()
  const { showDialog, hideDialog } = useDialog()

  const handleConfirmLogout = useCallback(async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }

    clearTokens()
    hideDialog()
    navigate('/login', { replace: true })
  }, [hideDialog, navigate])

  const openLogoutConfirmationDialog = useCallback(() => {
    showDialog(confirmLogoutDialog(handleConfirmLogout, hideDialog))
  }, [showDialog, hideDialog, handleConfirmLogout])

  return { openLogoutConfirmationDialog }
}
