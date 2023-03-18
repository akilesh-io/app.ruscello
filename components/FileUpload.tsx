import { useState } from 'react'
import Video from './video'

const FileUpload = () => {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<string | null>(null)

  const handleDragEnter = (event) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files[0]
    setFile(URL.createObjectURL(file))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0] // Displays the file name
    setFile(URL.createObjectURL(file)) // Displays the file blob
  }

  function handleClick() {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    fileInput.click()
  }

  return (
    <div>
      <input type="file" className="hidden" onChange={handleFileChange} />

      {file ? (
        <div>
          <div>
            <Video videoFilePath={file} />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
          >
            Select file
          </button>
        </div>
      ) : (
        <div className="p-2">
          <div
            className={
              `relative border-2 border-dashed rounded-md p-4 ${
                dragging ? 'border-blue-500' : 'border-gray-500'
              }` + (file ? 'hidden' : '')
            }
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div>
                <p className="text-gray-700 mb-2">
                  Drag and drop your file here
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleClick}
                >
                  Select file
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
