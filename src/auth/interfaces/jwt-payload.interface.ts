export interface JwtPayload {
  id: number;
  email: string;
  lat: number;
  long: number;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
