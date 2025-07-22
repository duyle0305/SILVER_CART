import { FullPageLoader } from '@/components/common/FullPageLoader'
import { useToggle } from 'ahooks'
import { createContext, useMemo, type PropsWithChildren } from 'react'

interface LoaderContextType {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

// eslint-disable-next-line react-refresh/only-export-components
export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined
)

export function LoaderProvider({ children }: PropsWithChildren) {
  const [isLoading, { setLeft: hideLoader, setRight: showLoader }] =
    useToggle(false)

  const contextValue = useMemo(
    () => ({
      showLoader,
      hideLoader,
      isLoading,
    }),
    [hideLoader, isLoading, showLoader]
  )

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {isLoading && <FullPageLoader />}
    </LoaderContext.Provider>
  )
}
