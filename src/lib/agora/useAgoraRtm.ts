/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'

type UseAgoraRtmOptions = {
  appId: string
  uid: string | number
  token?: string | null
}

export type RtmChatMessage = {
  id: string
  text: string
  from: string
  ts: number
}

export function useAgoraRtm({ appId, uid, token = null }: UseAgoraRtmOptions) {
  const clientRef = useRef<any | null>(null)
  const channelRef = useRef<any | null>(null)

  const [connected, setConnected] = useState(false)
  const [channelName, setChannelName] = useState<string | null>(null)
  const [messages, setMessages] = useState<RtmChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async () => {
    try {
      if (!clientRef.current) {
        const AgoraRTM = (await import('agora-rtm-sdk')).default
        clientRef.current = new AgoraRTM.RTM(appId, String(uid), {
          logUpload: false,
        })
      }
      await clientRef.current.login({
        token: token || undefined,
      })
    } catch (err: any) {
      setError(err?.message ?? 'Failed to login RTM')
      throw err
    }
  }, [appId, uid, token])

  const joinChannel = useCallback(
    async (name: string) => {
      try {
        await login()

        if (channelRef.current) {
          try {
            channelRef.current.removeAllListeners?.()
            await channelRef.current.leave()
          } catch {
            // Ignore errors
          }
          channelRef.current = null
        }

        const channel = clientRef.current.createChannel(name)

        channel.on(
          'ChannelMessage',
          (message: { text?: string }, memberId: string) => {
            const text =
              (message && 'text' in message ? message.text : '') || ''
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID?.() ?? String(Date.now()),
                text,
                from: memberId,
                ts: Date.now(),
              },
            ])
          }
        )

        await channel.join()
        channelRef.current = channel
        setChannelName(name)
        setConnected(true)
      } catch (err: any) {
        setError(err?.message ?? 'Failed to join channel')
        throw err
      }
    },
    [login]
  )

  const sendChannelMessage = useCallback(
    async (text: string) => {
      if (!channelRef.current) {
        throw new Error('You must join a channel first')
      }
      await channelRef.current.sendMessage({ text })
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          text,
          from: String(uid),
          ts: Date.now(),
        },
      ])
    },
    [uid]
  )

  const leaveChannel = useCallback(async () => {
    try {
      if (channelRef.current) {
        channelRef.current.removeAllListeners?.()
        await channelRef.current.leave()
        channelRef.current = null
      }
    } finally {
      setConnected(false)
      setChannelName(null)
    }
  }, [])

  useEffect(() => {
    return () => {
      // cleanup
      leaveChannel()
      if (clientRef.current) {
        clientRef.current.logout?.()
        clientRef.current = null
      }
    }
  }, [leaveChannel])

  return {
    connected,
    channelName,
    messages,
    error,
    joinChannel,
    leaveChannel,
    sendChannelMessage,
  }
}

export default useAgoraRtm
