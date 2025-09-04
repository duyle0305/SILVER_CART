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

  console.log('AppLayout component mounted')

  // Global message listener for video call events
  useEffect(() => {
    const handleGlobalMessage = (e: MessageEvent) => {
      console.log(
        'AppLayout received global message:',
        e.data,
        'from origin:',
        e.origin
      )

      const data = e.data
      if (!data || typeof data !== 'object') return

      if (data.type === 'VCALL_ENDED') {
        console.log('AppLayout processing VCALL_ENDED message:', data)

        const callerUserId = data.userId as string | undefined
        const receivedProductId = data.productId as string | undefined
        const shouldNavigate = data.shouldNavigateToReports !== false

        console.log('AppLayout navigation data:', {
          callerUserId,
          receivedProductId,
          shouldNavigate,
        })

        if (shouldNavigate) {
          const params = new URLSearchParams()
          if (callerUserId) params.set('userId', callerUserId)
          if (receivedProductId) params.set('productId', receivedProductId)

          const qs = `?${params.toString()}`
          const targetUrl = `/reports/add${qs}`

          console.log('AppLayout navigating to:', targetUrl)

          setTimeout(() => {
            navigate(targetUrl, { replace: true })
          }, 100)
        }
      }

      if (data.type === 'TEST_MESSAGE') {
        console.log('AppLayout received TEST_MESSAGE:', data)
        alert('Test message received in parent window!')
      }
    }

    console.log('AppLayout: Adding global message listener')
    window.addEventListener('message', handleGlobalMessage)

    return () => {
      console.log('AppLayout: Removing global message listener')
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
