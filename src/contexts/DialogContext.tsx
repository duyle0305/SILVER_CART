import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import {
  createContext,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

interface DialogConfig {
  title: ReactNode
  content: ReactNode
  actions?: ReactNode
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => void
  hideDialog: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
)

export function DialogProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<DialogConfig | null>(null)

  const showDialog = (newConfig: DialogConfig) => {
    setConfig(newConfig)
    setIsOpen(true)
  }

  const hideDialog = () => {
    setIsOpen(false)
  }

  const contextValue = {
    showDialog,
    hideDialog,
  }

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {isOpen &&
        config &&
        createPortal(
          <Dialog open={isOpen} onClose={hideDialog}>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogContent>{config.content}</DialogContent>
            <DialogActions>
              {config.actions || <Button onClick={hideDialog}>Close</Button>}
            </DialogActions>
          </Dialog>,
          document.body
        )}
    </DialogContext.Provider>
  )
}
