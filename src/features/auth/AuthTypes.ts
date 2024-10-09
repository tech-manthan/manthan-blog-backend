import { Request } from "express";

interface LoginData {
  email: string;
  password: string;
}

export interface LoginRequest extends Request {
  body: LoginData;
}

interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterRequest extends Request {
  body: RegisterData;
}

interface AuthData {
  sub: string;
  role: string;
  id?: string;
}

export interface AuthRequest extends Request {
  auth: AuthData;
}

interface SocialData {
  fullname: string;
  email: string;
}

export interface SocialRequest extends Request {
  user: SocialData;
}
