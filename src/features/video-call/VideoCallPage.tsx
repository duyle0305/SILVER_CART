import { config } from '@/config'
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded'
import {
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useEffect, useRef, useState } from 'react'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'

const CHANNEL = 'test_phat'

const Root = styled('div')(({ theme }) => ({
  minHeight: '100%',
  background: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

const Frame = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '80vh',
  borderRadius: 12,
  padding: 0,
  background: theme.palette.grey[50],
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[200]}`,
  overflow: 'hidden',
}))

const Header = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  zIndex: 2,
}))

const Controls = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: theme.spacing(2.5),
  display: 'flex',
  gap: theme.spacing(4),
  zIndex: 5,
}))

const CircleButton = styled(Button)(() => ({
  minWidth: 0,
  width: 56,
  height: 56,
  borderRadius: '999px',
  boxShadow: 'none',
  textTransform: 'none',
  padding: 0,
}))

const RemoteVideo = styled('div')({
  position: 'absolute',
  inset: 0,
  backgroundColor: '#eee',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})

const LocalVideoPip = styled('div')({
  position: 'absolute',
  width: 180,
  aspectRatio: '16 / 9',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#eee',
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  transform: 'scaleX(-1)',
  zIndex: 2,
  cursor: 'grab',
  touchAction: 'none',
})

const ControlWithLabel = styled('div')(({ theme }) => ({
  display: 'grid',
  justifyItems: 'center',
  gap: theme.spacing(1),
}))

export default function VideoCallPage() {
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

  const handleDisconnect = async () => {
    try {
      const tracks = [audioRef.current, videoRef.current].filter(Boolean) as (
        | IMicrophoneAudioTrack
        | ICameraVideoTrack
      )[]
      if (tracks.length) await client.unpublish(tracks)
    } catch {}
    audioRef.current?.close()
    videoRef.current?.close()
    await client.leave()
    joinedRef.current = false
  }

  const handleToggleMic = async () => {
    setMicOn((prev) => {
      const next = !prev
      const track = audioRef.current

      if (track) {
        ;(async () => {
          try {
            if (
              'setEnabled' in track &&
              typeof (track as any).setEnabled === 'function'
            ) {
              await (track as any).setEnabled(next)
            } else if (
              'setMuted' in track &&
              typeof (track as any).setMuted === 'function'
            ) {
              await (track as any).setMuted(!next)
            }
          } catch (e) {
            console.error('Toggle mic failed:', e)
          }
        })()
      }

      if (!next) {
        speakingRef.current = false
        setSpeaking(false)
      }

      return next
    })
  }

  useEffect(() => {
    if (!CHANNEL) return

    let canceled = false

    const init = async () => {
      await client.join(
        config.agoraAppId,
        CHANNEL,
        config.agoraToken || null,
        null
      )
      if (canceled) return
      joinedRef.current = true

      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks()
      if (canceled) return

      audioRef.current = audioTrack
      videoRef.current = videoTrack

      try {
        if (
          'setEnabled' in audioTrack &&
          typeof (audioTrack as any).setEnabled === 'function'
        ) {
          await (audioTrack as any).setEnabled(micOn)
        } else if (
          'setMuted' in audioTrack &&
          typeof (audioTrack as any).setMuted === 'function'
        ) {
          await (audioTrack as any).setMuted(!micOn)
        }
      } catch (e) {
        console.error('Sync mic state failed:', e)
      }

      await client.publish([audioTrack, videoTrack])

      videoTrack.play('local-player')
    }

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType)

      if (mediaType === 'video' && user.videoTrack) {
        user.videoTrack.play('remote-player')
      }
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play()
      }
    })

    client.on('user-unpublished', (_user, mediaType) => {
      if (mediaType === 'video') {
      }
    })

    init()

    return () => {
      canceled = true
      audioRef.current?.close()
      videoRef.current?.close()
      if (joinedRef.current) client.leave()
    }
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
    let intervalId: number | undefined
    const THRESHOLD = 0.06
    const QUIET_FRAMES = 4

    let quietCount = 0
    intervalId = window.setInterval(() => {
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
            <Avatar src="" alt="Customer" sx={{ width: 28, height: 28 }} />
            <Typography variant="body2" fontWeight={600}>
              Customer
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
