export default function UploadPreview({ file }) {
  if (!file) return null

  const previewURL = URL.createObjectURL(file)

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Preview:</h3>
      <video controls src={previewURL} className="max-w-full rounded" />
    </div>
  )
}
