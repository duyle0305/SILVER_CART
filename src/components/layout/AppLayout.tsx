import { FullPageLoader } from '@/components/common/FullPageLoader'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { Content, Main } from '@/components/layout/styles/AppLayout.styles'
import IncomingCallListener from '@/features/video-call/components/IncomingCallListener'
import IncomingMessageListener from '@/features/video-call/components/IncomingMessageListener'
import { Box } from '@mui/material'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
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
