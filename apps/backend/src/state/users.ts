export interface User {
  id: string
  name: string
  createdAt: Date
}

export const users = new Map<string, User>()
