import { config } from '@/config'
import { useAuthContext } from '@/contexts/AuthContext'
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import { Avatar, Container, Stack, Tooltip, Typography } from '@mui/material'
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  CircleButton,
  Controls,
  ControlWithLabel,
  Frame,
  Header,
  LocalVideoPip,
  RemoteVideo,
  Root,
} from './components/styles/VideoCallPage.style'
import { useDisconnectFromChannel } from './hooks/useDisconnectFromChannel'
import type { Connection } from './types'

const SS_KEY = (id: string) => `vc:conn:${id}`

const unstashConnection = (id?: string): Connection | null => {
  if (!id) return null
  try {
    const raw = sessionStorage.getItem(SS_KEY(id))
    return raw ? (JSON.parse(raw) as Connection) : null
  } catch {
    return null
  }
}

export default function VideoCallPage() {
  const navigate = useNavigate()
  const { user: consultant } = useAuthContext()
  const leavingRef = useRef(false)
  const frameRef = useRef<HTMLDivElement | null>(null)

  const [client] = useState<IAgoraRTCClient>(() =>
    AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  )
  const [pipPos, setPipPos] = useState({ x: 0, y: 0 })
  const [micOn, setMicOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const speakingRef = useRef(false)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  })

  const videoRef = useRef<ICameraVideoTrack | null>(null)
  const audioRef = useRef<IMicrophoneAudioTrack | null>(null)
  const joinedRef = useRef(false)

  const { state } = useLocation() as { state?: { connection?: Connection } }
  const { connectionId } = useParams<{ connectionId: string }>()
  const { mutateAsync: disconnect } = useDisconnectFromChannel()

  const connection: Connection | null = useMemo(() => {
    return state?.connection || unstashConnection(connectionId) || null
  }, [state?.connection, connectionId])

  const productId = useMemo(() => {
    return (connection as any)?.productId
  }, [connection])

  const CHANNEL = connection?.channelName ?? ''
  const TOKEN: string | null = connection?.token ?? null

  const parsedUID = consultant?.userId ? parseInt(consultant.userId, 10) : 0
  const UID = !isNaN(parsedUID) && parsedUID > 0 ? parsedUID : null

  const HEADER_NAME = connection?.fullName ?? 'Customer'
  const HEADER_AVATAR = ''

  useEffect(() => {
    if (window.opener && !window.name) {
      window.name = 'video-call-popup'
    }
  }, [])
  const onPipPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const pip = e.currentTarget
    const frame = frameRef.current
    if (!frame) return

    pip.setPointerCapture(e.pointerId)
    dragRef.current.dragging = true
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
    dragRef.current.startLeft = pipPos.x
    dragRef.current.startTop = pipPos.y
    pip.style.cursor = 'grabbing'
  }

  const onPipPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragRef.current.dragging) return
    const frame = frameRef.current
    const pip = document.getElementById('local-player-pip')
    if (!frame || !pip) return

    const frameRect = frame.getBoundingClientRect()
    const pipRect = pip.getBoundingClientRect()

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    let nextX = dragRef.current.startLeft + dx
    let nextY = dragRef.current.startTop + dy

    nextX = Math.min(Math.max(0, nextX), frameRect.width - pipRect.width)
    nextY = Math.min(Math.max(0, nextY), frameRect.height - pipRect.height)

    setPipPos({ x: nextX, y: nextY })
  }

  const onPipPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragRef.current.dragging) return
    dragRef.current.dragging = false
    const pip = e.currentTarget
    pip.releasePointerCapture(e.pointerId)
    pip.style.cursor = 'grab'
  }

  const handleToggleMic = async () => {
    const track = audioRef.current
    const next = !micOn
    setMicOn(next)
    try {
      if (track && typeof track.setEnabled === 'function') {
        await track.setEnabled(next)
      }
    } catch (e) {
      console.error('Toggle mic failed:', e)
    }
    if (!next) {
      speakingRef.current = false
      setSpeaking(false)
    }
  }

  const handleDisconnect = async () => {
    if (leavingRef.current) return
    leavingRef.current = true

    try {
      await disconnect?.(consultant?.userId ?? '')

      audioRef.current?.close()
      videoRef.current?.close()
      audioRef.current = null
      videoRef.current = null

      await client.leave()
    } catch (e) {
      console.warn('Error during Agora cleanup:', e)
    } finally {
      joinedRef.current = false
      const callerUserId = connection?.userId ?? ''
      const searchParams = new URLSearchParams(window.location.search)
      const isPopupFromUrl = searchParams.get('popup') === 'true'
      const isTabFromUrl = searchParams.get('tab') === 'true'
      const isInSeparateWindow =
        isPopupFromUrl ||
        isTabFromUrl ||
        (window.opener && !window.opener.closed)

      if (isInSeparateWindow) {
        try {
          if (window.opener && !window.opener.closed) {
            const message = {
              type: 'VCALL_ENDED',
              userId: callerUserId,
              connectionId,
              productId: productId,
              shouldNavigateToReports: true,
            }
            window.opener.postMessage(message, '*')
          }
        } catch (error) {
          console.warn('Error sending message to parent:', error)
        }
        window.close()
      } else {
        const params = new URLSearchParams()
        if (callerUserId) params.set('userId', callerUserId)
        if (productId) params.set('productId', productId)
        const reportUrl = `/reports/add?${params.toString()}`
        navigate(reportUrl, { replace: true })
      }
    }
  }

  useEffect(() => {
    if (!CHANNEL || !connection) {
      console.warn('⚠️ Missing channel or connection data!')
      return
    }

    let isCancelled = false

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      try {
        await client.subscribe(user, mediaType)
        setRemoteUsers(Array.from(client.remoteUsers))
      } catch (error) {
        console.error(
          `❌ FAILED TO SUBSCRIBE to ${mediaType} from ${user.uid}:`,
          error
        )
      }
    }

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(Array.from(client.remoteUsers))
    }

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid))
      if (!leavingRef.current) {
        void handleDisconnect()
      }
    }

    const initializeAgora = async () => {
      if (!config.agoraAppId) {
        console.error('❌ No Agora App ID configured!')
        return
      }

      client.on('user-published', handleUserPublished)
      client.on('user-unpublished', handleUserUnpublished)
      client.on('user-left', handleUserLeft)

      try {
        await client.join(config.agoraAppId, CHANNEL, TOKEN, UID ?? null)
        if (isCancelled) return
        joinedRef.current = true

        if (client.remoteUsers.length > 0) {
          for (const user of client.remoteUsers) {
            if (user.hasVideo) await handleUserPublished(user, 'video')
            if (user.hasAudio) await handleUserPublished(user, 'audio')
          }
        }

        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks()
        if (isCancelled) {
          audioTrack.close()
          videoTrack.close()
          return
        }
        audioRef.current = audioTrack
        videoRef.current = videoTrack

        await audioTrack.setEnabled(micOn)

        await client.publish([audioTrack, videoTrack])

        videoTrack.play('local-player')
      } catch (error) {
        console.error('❌ Failed to initialize Agora:', error)
      }
    }

    initializeAgora()

    return () => {
      isCancelled = true
      client.removeAllListeners()
    }
  }, [client, CHANNEL, TOKEN, UID, connection])

  useEffect(() => {
    if (remoteUsers.length === 0) return

    remoteUsers.forEach((user) => {
      if (user.hasVideo && user.videoTrack) {
        try {
          user.videoTrack.play('remote-player')
        } catch (err) {
          console.error(`❌ Failed to play video for ${user.uid}:`, err)
        }
      }

      if (user.hasAudio && user.audioTrack) {
        if (!user.audioTrack.isPlaying) {
          try {
            user.audioTrack.play()
          } catch (err) {
            console.error(`❌ Failed to play audio for ${user.uid}:`, err)
          }
        }
      }
    })
  }, [remoteUsers])

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (joinedRef.current) {
        await handleDisconnect()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [client])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'FORCE_CLOSE_POPUP') {
        handleDisconnect()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const pip = document.getElementById('local-player-pip')
    if (!frame || !pip) return

    const padding = 16
    const frameRect = frame.getBoundingClientRect()
    const pipRect = pip.getBoundingClientRect()

    const defaultX = Math.max(
      padding,
      frameRect.width - pipRect.width - padding
    )
    const defaultY = Math.max(
      padding,
      frameRect.height - pipRect.height - padding
    )
    setPipPos({ x: defaultX, y: defaultY })
  }, [])

  useEffect(() => {
    const THRESHOLD = 0.06
    const QUIET_FRAMES = 4
    let quietCount = 0
    const intervalId = window.setInterval(() => {
      const track = audioRef.current
      if (!track || !micOn) {
        if (speakingRef.current) {
          speakingRef.current = false
          setSpeaking(false)
        }
        return
      }
      const level = track.getVolumeLevel?.() ?? 0
      if (level >= THRESHOLD) {
        quietCount = 0
        if (!speakingRef.current) {
          speakingRef.current = true
          setSpeaking(true)
        }
      } else {
        quietCount++
        if (quietCount >= QUIET_FRAMES && speakingRef.current) {
          speakingRef.current = false
          setSpeaking(false)
        }
      }
    }, 140)

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [micOn])

  return (
    <Root>
      <Container>
        <Frame ref={frameRef}>
          <Header sx={{ padding: 2 }}>
            <Avatar
              src={HEADER_AVATAR}
              alt={HEADER_NAME}
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="body2" fontWeight={600}>
              {HEADER_NAME}
            </Typography>
          </Header>

          <RemoteVideo id="remote-player" />

          <LocalVideoPip
            id="local-player-pip"
            onPointerDown={onPipPointerDown}
            onPointerMove={onPipPointerMove}
            onPointerUp={onPipPointerUp}
            style={{ left: pipPos.x, top: pipPos.y }}
            sx={{
              outline: speaking
                ? (t) => `3px solid ${t.palette.primary.main}`
                : 'none',
            }}
          >
            <div id="local-player" style={{ width: '100%', height: '100%' }} />
          </LocalVideoPip>

          <Controls>
            <Stack direction="row" spacing={4}>
              <ControlWithLabel>
                <Tooltip title={micOn ? 'Mute' : 'Unmute'}>
                  <CircleButton variant="contained" onClick={handleToggleMic}>
                    {micOn ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
                  </CircleButton>
                </Tooltip>
                <Typography variant="caption">
                  {micOn ? 'Mic On' : 'Mic Off'}
                </Typography>
              </ControlWithLabel>
              <ControlWithLabel>
                <Tooltip title="Disconnect">
                  <CircleButton
                    variant="contained"
                    onClick={handleDisconnect}
                    color="error"
                  >
                    <CallEndRoundedIcon />
                  </CircleButton>
                </Tooltip>
                <Typography variant="caption">Disconnect</Typography>
              </ControlWithLabel>
            </Stack>
          </Controls>
        </Frame>
      </Container>
    </Root>
  )
}
