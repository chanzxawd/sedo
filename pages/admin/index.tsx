import React from 'react'
import { useSession } from 'next-auth/react'
import AdminDasboard from '@/components/AdminDasboard'

export default function Admin() {
    const { data: session } = useSession()

    if (session?.user?.email === "admin@gmail.com") {
      return (
        <div>
          <AdminDasboard/>
        </div>
      )
    }
  return (
    <div>
      <h1>You are not an admin</h1>
    </div>
  )
}
