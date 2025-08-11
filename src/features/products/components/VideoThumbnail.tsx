import { useEffect, useMemo, useRef, useState } from 'react'
import VideoCallIcon from '@mui/icons-material/VideoCall'

interface VideoThumbnailProps {
  source?: File | string | null
  className?: string
  /** Optional: poster fallback if URL can't render */
  posterUrl?: string
  /** Optional: open video externally when URL preview fails */
  onOpen?: (url: string) => void
}

const SEEK_TIME = 0.2
const PAUSE_DELAY_MS = 120
const WATCHDOG_MS = 1500

/**
 * Unified and robust video preview:
 * - File: objectURL -> seek -> draw to canvas -> <img> (no CORS risk)
 * - URL: no canvas; play muted briefly + pause to keep first frame (CORS-safe)
 */
const VideoThumbnail = ({
  source,
  className,
  posterUrl,
  onOpen,
}: VideoThumbnailProps) => {
  const isFile = useMemo(
    () => typeof source !== 'string' && source instanceof File,
    [source]
  )
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const revokeRef = useRef<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    return () => {
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current)
        revokeRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    setThumbUrl(null)
    setFailed(false)
  }, [source])

  useEffect(() => {
    if (!source || !isFile) return

    const file = source as File
    const objUrl = URL.createObjectURL(file)
    revokeRef.current = objUrl

    const video = document.createElement('video')
    video.src = objUrl
    video.muted = true
    ;(video as any).playsInline = true
    video.preload = 'metadata'

    const onMeta = () => {
      try {
        video.currentTime = SEEK_TIME
      } catch {
        setFailed(true)
      }
    }

    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        const w = Math.min(video.videoWidth || 300, 600)
        const h = Math.min(video.videoHeight || 300, 600)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('no ctx')
        ctx.drawImage(video, 0, 0, w, h)
        setThumbUrl(canvas.toDataURL('image/png'))
      } catch {
        setFailed(true)
      }
    }

    const onError = () => setFailed(true)

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
    }
  }, [source, isFile])

  useEffect(() => {
    if (!source || isFile || !videoRef.current) return

    const v = videoRef.current
    let pausedTimer: number | undefined
    let watchdog: number | undefined

    const onMeta = () => {
      try {
        const d =
          Number.isFinite(v.duration) && v.duration > 0
            ? Math.min(SEEK_TIME, v.duration * 0.1)
            : SEEK_TIME
        v.currentTime = d
        v.muted = true
        v.play()
          .then(() => {
            pausedTimer = window.setTimeout(() => v.pause(), PAUSE_DELAY_MS)
          })
          .catch(() => {
            v.pause()
          })

        watchdog = window.setTimeout(() => {
          if (v.readyState < 2) setFailed(true)
        }, WATCHDOG_MS)
      } catch {
        setFailed(true)
      }
    }

    const onError = () => setFailed(true)

    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('error', onError)

    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('error', onError)
      if (pausedTimer) window.clearTimeout(pausedTimer)
      if (watchdog) window.clearTimeout(watchdog)
    }
  }, [source, isFile])

  if (isFile) {
    if (thumbUrl) {
      return (
        <img
          src={thumbUrl}
          alt="video thumbnail"
          className={className}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )
    }
    return <VideoCallIcon className={className} />
  }

  if (typeof source === 'string' && source && !failed) {
    return (
      <video
        ref={videoRef}
        src={source}
        poster={posterUrl}
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  if (typeof source === 'string' && source && failed) {
    return (
      <div
        onClick={() => onOpen?.(source)}
        title="Open video"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <VideoCallIcon className={className} />
      </div>
    )
  }

  return <VideoCallIcon className={className} />
}

export default VideoThumbnail
