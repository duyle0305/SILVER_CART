export type IncomingCallPayload = {
  callerId: string
  callerName: string
  avatarUrl?: string
  channel: string
  token?: string | null
  uid?: string | number | null
}

const EVENT_NAME = 'incoming-call'

export function emitIncomingCall(payload: IncomingCallPayload) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }))
}

export function onIncomingCall(
  handler: (payload: IncomingCallPayload) => void
) {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<IncomingCallPayload>
    handler(ce.detail)
  }
  window.addEventListener(EVENT_NAME, listener)
  return () => window.removeEventListener(EVENT_NAME, listener)
}

declare global {
  interface Window {
    simulateIncomingCall?: (p: IncomingCallPayload) => void
  }
}

if (typeof window !== 'undefined') {
  window.simulateIncomingCall = (p: IncomingCallPayload) => emitIncomingCall(p)
}
