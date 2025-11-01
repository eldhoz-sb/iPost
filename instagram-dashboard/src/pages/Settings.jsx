import { useState } from 'react'
import axiosClient from '../api/axiosClient'

export default function Settings() {
  const [connected, setConnected] = useState(false)
  const [profile, setProfile] = useState(null)

  const handleConnect = async () => {
    // Backend endpoint that redirects to Facebook OAuth
    window.location.href = 'http://localhost:5000/api/auth/instagram'
  }

  const handleDisconnect = async () => {
    await axiosClient.post('/auth/disconnect')
    setConnected(false)
    setProfile(null)
  }

  // Example fetched profile (once connected)
  // useEffect(() => {
  //   axiosClient.get('/auth/profile').then(setProfile)
  // }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Instagram Integration</h1>

      {connected ? (
        <div className="bg-white shadow p-4 rounded w-96">
          <div className="flex items-center space-x-4">
            <img src={profile?.picture} alt="profile" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">{profile?.username}</p>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Connect Instagram
        </button>
      )}
    </div>
  )
}
