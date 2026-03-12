export interface RegisterResponseDto {
  id: string;
  email: string;
  createdAt: Date;
}

export interface LoginResponseDto {
  token: string;
}
