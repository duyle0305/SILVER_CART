import { FullPageLoader } from '@/components/common/FullPageLoader'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { Content, Main } from '@/components/layout/styles/AppLayout.styles'
import IncomingCallListener from '@/features/video-call/components/IncomingCallListener'
import IncomingMessageListener from '@/features/video-call/components/IncomingMessageListener'
import { Box } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const AppLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleGlobalMessage = (e: MessageEvent) => {
      const data = e.data
      if (!data || typeof data !== 'object') return

      if (data.type === 'VCALL_ENDED') {
        const callerUserId = data.userId as string | undefined
        const receivedProductId = data.productId as string | undefined
        const shouldNavigate = data.shouldNavigateToReports !== false

        if (shouldNavigate) {
          const params = new URLSearchParams()
          if (callerUserId) params.set('userId', callerUserId)
          if (receivedProductId) params.set('productId', receivedProductId)

          const qs = `?${params.toString()}`
          const targetUrl = `/reports/add${qs}`

          setTimeout(() => {
            navigate(targetUrl, { replace: true })
          }, 100)
        }
      }

      if (data.type === 'TEST_MESSAGE') {
        alert('Test message received in parent window!')
      }
    }

    window.addEventListener('message', handleGlobalMessage)

    return () => {
      window.removeEventListener('message', handleGlobalMessage)
    }
  }, [navigate])

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Main>
        <Header />
        <IncomingMessageListener />
        <IncomingCallListener />
        <Content>
          <Suspense fallback={<FullPageLoader />}>
            <Outlet />
          </Suspense>
        </Content>
      </Main>
    </Box>
  )
}

export default AppLayout
