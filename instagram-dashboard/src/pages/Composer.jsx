import { useState } from 'react'
import UploadPreview from '../components/UploadPreview'

export default function Composer() {
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [type, setType] = useState('post')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submit post:', { file, caption, type })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create a Post / Reel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="post">Post</option>
          <option value="reel">Reel</option>
          <option value="story">Story</option>
        </select>

        <textarea
          placeholder="Write a caption..."
          className="border p-2 rounded w-full"
          rows="3"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <UploadPreview file={file} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  )
}
