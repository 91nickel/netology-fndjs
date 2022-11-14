import { Request } from 'express';
import { UserDocument } from '../schema/user.schema';

export enum Role {
  Client = 'client',
  Manager = 'manager',
  Admin = 'admin',
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export class SearchUserDto implements SearchUserParams {
  limit: number;
  offset: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export class SignInUserDto {
  email: string;
  password: string;
}

export class SignUpUserDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role: Role = Role.Client;
}
