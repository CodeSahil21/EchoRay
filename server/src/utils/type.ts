import { Request } from 'express';
export interface AuthenticatedUser {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
    cookies: any;
    user?: AuthenticatedUser;
}