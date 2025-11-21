import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'

async function getUser() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('pb_auth')

  if (authCookie) {
    const pb = new PocketBase('http://34.50.111.177:8090')
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
    return pb.authStore.model
  }
  return null
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
