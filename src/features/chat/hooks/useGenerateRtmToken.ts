export function useGenerateRtmToken() {
  const mutateAsync = async ({ uid }: { uid: string }) => {
    const res = await fetch(`/api/agora/rtm/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    })
    if (!res.ok) throw new Error('Failed to generate RTM token')
    const json = await res.json()
    return json?.token as string
  }

  return { mutateAsync }
}
