import { useEffect, useRef, useState, useCallback } from 'react'
import AgoraRTC, {
  type IAgoraRTCClient,
  type ILocalAudioTrack,
  type ILocalVideoTrack,
  type IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng'

type Options = {
  appId: string
  channel: string
  token?: string | null
  uid?: string | number | null
  codec?: 'vp8' | 'h264'
}

export function useAgoraCall({
  appId,
  channel,
  token = null,
  uid = null,
  codec = 'vp8',
}: Options) {
  const clientRef = useRef<IAgoraRTCClient | null>(null)
  const [joined, setJoined] = useState(false)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null)
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [assignedUid, setAssignedUid] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // init client once
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec })
    clientRef.current = client

    const sync = () => setRemoteUsers(Array.from(client.remoteUsers))

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      try {
        await client.subscribe(user, mediaType)
        sync()
        if (mediaType === 'video' && user.videoTrack)
          user.videoTrack.play(`remote-${user.uid}`)
        if (mediaType === 'audio' && user.audioTrack) user.audioTrack.play()
      } catch (e: unknown) {
        setError((e as Error)?.message || String(e))
      }
    }

    client.on('user-published', handleUserPublished)
    client.on('user-unpublished', sync)
    client.on('user-joined', sync)
    client.on('user-left', sync)

    return () => {
      client.removeAllListeners()
      clientRef.current = null
    }
  }, [codec])

  const join = useCallback(async () => {
    if (!clientRef.current) return
    setError(null)
    const client = clientRef.current

    try {
      const [aTrack, vTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      setLocalAudioTrack(aTrack)
      setLocalVideoTrack(vTrack)

      const uidJoined = await client.join(
        appId,
        channel,
        token || null,
        uid || null
      )
      setAssignedUid(uidJoined)
      await client.publish([aTrack, vTrack])

      setJoined(true)
      setIsMicOn(true)
      setIsCamOn(true)
      return uidJoined
    } catch (e: unknown) {
      setError((e as Error)?.message || String(e))
      throw e
    }
  }, [appId, channel, token, uid])

  const leave = useCallback(async () => {
    if (!clientRef.current) return
    try {
      localAudioTrack?.close()
      localVideoTrack?.close()
      await clientRef.current.unpublish()
      await clientRef.current.leave()
    } finally {
      setLocalAudioTrack(null)
      setLocalVideoTrack(null)
      setRemoteUsers([])
      setJoined(false)
      setAssignedUid(null)
    }
  }, [localAudioTrack, localVideoTrack])

  const toggleMic = useCallback(async () => {
    if (!localAudioTrack) return
    const next = !localAudioTrack.enabled
    await localAudioTrack.setEnabled(next)
    setIsMicOn(next)
  }, [localAudioTrack])

  const toggleCam = useCallback(async () => {
    if (!localVideoTrack) return
    const next = !localVideoTrack.enabled
    await localVideoTrack.setEnabled(next)
    setIsCamOn(next)
  }, [localVideoTrack])

  return {
    joined,
    isMicOn,
    isCamOn,
    remoteUsers,
    localVideoTrack,
    assignedUid,
    error,
    join,
    leave,
    toggleMic,
    toggleCam,
  }
}
