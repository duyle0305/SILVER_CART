import { useRef } from 'react'
import AgoraRTM from 'agora-rtm-sdk'
import { useGenerateRtmToken } from './useGenerateRtmToken'

type EnsureLoginResult = { token: string | null }

export function useEnsureRtmLogin(appId: string) {
  const clientRef = useRef<any | null>(null)
  const { mutateAsync: generate } = useGenerateRtmToken()

  const getClient = (uid: string) => {
    if (!clientRef.current) {
      clientRef.current = new AgoraRTM.RTM(appId, uid, {
        logUpload: false,
      })
    }
    return clientRef.current
  }

  const ensureLogin = async (uid: string): Promise<EnsureLoginResult> => {
    const client = getClient(uid)
    try {
      await client.login({ token: undefined })
      return { token: null }
    } catch (e: any) {
      try {
        const token = await generate({ uid })
        await client.login({ token })
        return { token }
      } catch (e2) {
        throw e2
      }
    }
  }

  return { ensureLogin }
}
