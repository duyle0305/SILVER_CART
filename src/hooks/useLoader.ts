import { LoaderContext } from '@/contexts/LoaderContext'
import { useContext } from 'react'

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}
