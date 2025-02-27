export class LeaderboardUserDto {
  id: string
  username: string
  avatarUrl: string
  points: number
  rank: number
}

export class LeaderboardResponseDto {
  users: LeaderboardUserDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

