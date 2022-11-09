import { ContextProvider } from './Context'
import Head from 'next/head'
import VideoPlayer from '@/components/videoPlayer'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/layout'

import Sidebar from '@/components/sidebar'
import Notifications from '@/components/notifications'

export default function Home() {
  return (
    <div className={styles.container}>
      <Layout>
      <Head>
          <title>Ruscello</title>
          <meta name="description" content="Hello There :)" />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <ContextProvider>
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-indigo-600 xl:inline">
                Video Chat
              </span>
            </h1>
          </div>
          <VideoPlayer />
          <Sidebar>
            <Notifications />
          </Sidebar>
        </ContextProvider>
      </Layout>
    </div>
  )
}
