import VideoList      from '@/components/VideoList'
import React          from 'react'
import { useSession } from 'next-auth/react'
import Link           from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  if (session?.user?.email === "admin@gmail.com") {
    return (
      <div>
        <h1>Admin</h1>
        <VideoList />
      </div>
    )
  }

  return (
    <div>
      {session ? <VideoList /> : <Link href="/auth/signin"><p>Please sign in</p></Link>}
    </div>
  )
}
