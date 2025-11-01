import { useState } from 'react'

export default function useAuth() {
  const [user, setUser] = useState({ name: 'Demo User' }) // Replace later with real auth
  return { user, setUser }
}
