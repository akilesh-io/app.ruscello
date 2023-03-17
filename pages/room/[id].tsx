import VideoCall from '@/components/VideoCall'
import FileUpload from '@/components/FileUpload'

//import styles from '@/styles/VideoCall.module.css'
export default function Room() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full">
        <FileUpload />
      </div>

      <VideoCall />
    </div>
  )
}
