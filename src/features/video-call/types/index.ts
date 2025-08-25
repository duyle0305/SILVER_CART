export interface Connection {
  id: string
  userId: string
  fullName: string
  channelName: string
  type: string
  token: string
  consultant: string
}

export interface ConnectBodyParam {
  userId: string
  channelName: string
  type: string
  token: string
  consultant: string
}
