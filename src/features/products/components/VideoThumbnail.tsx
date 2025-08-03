import { StyledAvatar } from '@/features/products/components/styles/CreateUpdateProductPage.styles'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

interface VideoThumbnailProps {
  file: File
}

const VideoThumbnail = ({ file }: VideoThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!file) return

    setIsLoading(true)
    const video = document.createElement('video')
    const videoUrl = URL.createObjectURL(file)
    video.src = videoUrl
    video.crossOrigin = 'anonymous'

    video.onloadeddata = () => {
      video.currentTime = 1
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setThumbnailUrl(canvas.toDataURL('image/jpeg'))
      }
      setIsLoading(false)
      URL.revokeObjectURL(videoUrl)
    }

    video.onerror = () => {
      console.error('Error loading video for thumbnail generation.')
      setIsLoading(false)
      URL.revokeObjectURL(videoUrl)
    }

    return () => {
      URL.revokeObjectURL(videoUrl)
    }
  }, [file])

  if (isLoading) {
    return (
      <StyledAvatar variant="rounded">
        <CircularProgress size={24} />
      </StyledAvatar>
    )
  }

  if (thumbnailUrl) {
    return <StyledAvatar src={thumbnailUrl} variant="rounded" />
  }

  return (
    <StyledAvatar variant="rounded">
      <VideoCallIcon />
    </StyledAvatar>
  )
}

export default VideoThumbnail
