import { useRouter } from 'next/router'

import { ContextProvider } from '../Context'
import Layout from '@/components/layout'
import VideoPlayer from '@/components/videoPlayer'
import Sidebar from '@/components/sidebar'
import Notifications from '@/components/notifications'

const RoomID = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Layout>
      <p>Post: {id}</p>
      <ContextProvider>
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-indigo-600 xl:inline">Video Chat</span>
          </h1>
        </div>
        <VideoPlayer />
        <Sidebar>
          <Notifications />
        </Sidebar>
      </ContextProvider>
    </Layout>
  )
}

export default RoomID
