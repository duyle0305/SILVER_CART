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
} from 'agora-rtc-sdk-ng'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
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
  const [search] = useSearchParams()
  const { mutateAsync: disconnect } = useDisconnectFromChannel()

  const connection: Connection | null = useMemo(() => {
    return state?.connection || unstashConnection(connectionId) || null
  }, [state?.connection, connectionId])

  const urlChannel = search.get('channel') ?? undefined
  const urlToken = search.get('token') ?? undefined
  const urlUidStr = search.get('uid')
  const urlUid: number | null =
    urlUidStr !== null && urlUidStr !== undefined
      ? Number.isNaN(Number(urlUidStr))
        ? null
        : Number(urlUidStr)
      : null

  const CHANNEL = urlChannel ?? ''
  const TOKEN: string | null = urlToken ?? null
  const UID: number | null = urlUid

  const HEADER_NAME = connection?.fullName ?? 'Customer'
  const HEADER_AVATAR = ''

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
      try {
        await disconnect?.(consultant?.userId ?? '')
      } catch (e) {
        console.warn('disconnect() failed:', e)
      }

      try {
        const tracks = [audioRef.current, videoRef.current].filter(Boolean) as (
          | IMicrophoneAudioTrack
          | ICameraVideoTrack
        )[]
        if (tracks.length) await client.unpublish(tracks)
      } catch (e) {
        console.warn('unpublish failed:', e)
      }

      audioRef.current?.close()
      videoRef.current?.close()

      try {
        await client.leave()
      } catch (e) {
        console.warn('leave failed:', e)
      }
      joinedRef.current = false
    } finally {
      const callerUserId = connection?.userId ?? ''
      const qs = callerUserId
        ? `?userId=${encodeURIComponent(callerUserId)}`
        : ''
      navigate(`/reports/add${qs}`, { replace: true })
    }
  }

  useEffect(() => {
    if (!CHANNEL) {
      console.warn('No channel provided in query. Abort join.')
      return
    }

    let canceled = false

    const onUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType)
      if (mediaType === 'video' && user.videoTrack) {
        user.videoTrack.play('remote-player')
      }
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play()
      }
    }

    const onUserLeft = () => {
      if (!leavingRef.current) {
        void handleDisconnect()
      }
    }

    const init = async () => {
      await client.join(config.agoraAppId, CHANNEL, TOKEN, UID ?? null)
      if (canceled) return
      joinedRef.current = true

      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks()
      if (canceled) return

      audioRef.current = audioTrack
      videoRef.current = videoTrack

      try {
        await audioTrack.setEnabled(micOn)
      } catch (e) {
        console.error('Sync mic state failed:', e)
      }

      await client.publish([audioTrack, videoTrack])
      videoTrack.play('local-player')
    }

    client.on('user-published', onUserPublished)
    client.on('user-left', onUserLeft)

    init()

    return () => {
      canceled = true
      client.off('user-published', onUserPublished)
      client.off('user-left', onUserLeft)
      audioRef.current?.close()
      videoRef.current?.close()
      if (joinedRef.current) client.leave()
    }
  }, [client, CHANNEL, TOKEN, UID])

  useEffect(() => {
    const onConnChange = (cur: string, _: string, __?: any) => {
      if (
        (cur === 'DISCONNECTED' || cur === 'DISCONNECTING') &&
        !leavingRef.current
      ) {
        void handleDisconnect()
      }
    }
    client.on('connection-state-change', onConnChange)
    return () => client.off('connection-state-change', onConnChange)
  }, [client])

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
            aria-label="Local preview window"
            role="button"
            sx={{
              outline: speaking
                ? (t) => `3px solid ${t.palette.primary.main}`
                : 'none',
              boxShadow: speaking
                ? (t) =>
                    `0 0 0 4px ${t.palette.primary.main}33, 0 6px 18px rgba(0,0,0,0.35)`
                : '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'outline 120ms ease, box-shadow 120ms ease',
            }}
          >
            <div id="local-player" style={{ width: '100%', height: '100%' }} />
          </LocalVideoPip>

          <Controls>
            <Stack direction="row" spacing={4}>
              <ControlWithLabel>
                <Tooltip
                  title={micOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  <CircleButton
                    variant="contained"
                    aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                    onClick={handleToggleMic}
                  >
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
                    aria-label="Disconnect"
                    onClick={handleDisconnect}
                    color="error"
                    sx={{ backgroundColor: (t) => t.palette.error.light }}
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
