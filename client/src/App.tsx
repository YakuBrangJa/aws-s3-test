import {useEffect, useState} from 'react'
import axios from 'axios'
const domain = "http://localhost:8000"
// const domain = "http://form-builder-test.judgify.me:90"
function App () {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if(!e.target.files || e.target.files.length === 0) return
    setFile(e.target.files[0])
  }

  useEffect(() => {
    // Optional: Reset uploaded URL when file changes
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${domain}/api/test`)
        console.log('Test response:', response.data)
      } catch (error) {
        console.error('Error fetching test:', error)
      }
    }
    fetchTest()
  }, [file])

  const uploadFile = async () => {
    if(!file) return

    try {
      // Step 1: Request pre-signed URL from Laravel
      const {data} = await axios.post(`${domain}/api/generate-upload-url`, {
        filename: file.name,
        type: file.type,
      })

      console.log('Pre-signed URL data:', data)
      // Step 2: PUT the file directly to S3
      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      // Step 3: Optional - store file URL or key
      const publicUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${data.key}`
      setUploadedUrl(publicUrl)
      console.log(publicUrl)

      alert('File uploaded successfully!')
    } catch(err) {
      console.error(err)
      alert('Upload failed.')
    }
  }



  return (
    <div style={{padding: 20}}>
      <h2>S3 Upload with Pre-signed URL</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>

      {uploadedUrl && (
        <div style={{marginTop: 20}}>
          <p>Uploaded File:</p>
          <img src={uploadedUrl} alt="Uploaded file" />
        </div>
      )}
    </div>
  )
}

export default App
