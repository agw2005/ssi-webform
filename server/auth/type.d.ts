export interface LoginPayload {
  nrp: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  nrp: string;
  jwt: string;
}

export interface VerifyResponse {
  iss: string;
  exp: number;
  userId: number;
  userName: string;
  nameUser: string;
  nrp: string;
}
