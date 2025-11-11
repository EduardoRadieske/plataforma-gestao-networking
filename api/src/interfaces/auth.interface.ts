import { Role } from '../enums/role';
import { Request } from 'express';

export interface IAuthUser {
  id?: number;
  nome?: string;
  email?: string;
  role?: Role;
}

export interface IAuthRequest extends Request {
  user?: IAuthUser;
}