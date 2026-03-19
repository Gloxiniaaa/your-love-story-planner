import api from "@/api/api-client";

export interface AuthUserDto {
  username: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export async function register(payload: AuthUserDto) {
  const res = await api.post("/api/Auth/register", payload);
  return res.data;
}

export async function login(payload: AuthUserDto): Promise<TokenResponseDto> {
  const res = await api.post<TokenResponseDto>("/api/Auth/login", payload);
  return res.data;
}

