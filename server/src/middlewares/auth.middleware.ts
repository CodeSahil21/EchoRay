import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../utils/type';
import redisClient from '../services/redis.service';
dotenv.config();

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Extract the token from cookies or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        // Check if the token is provided
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized: Token not provided" });
        }
   
        const isBlacklisted = await redisClient.get(token);

        if( isBlacklisted ) {
            res.cookie('token', ''); // Clear the cookie if blacklisted
            return res.status(401).json({ msg: "Unauthorized: Token is blacklisted" });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

        // Find the user by ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ msg: "Unauthorized: User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        return next();
    } catch (error) {
        console.error('Error during authentication:', error);

        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: "Unauthorized: Invalid token" });
        }

        // Handle other errors
        return res.status(500).json({ msg: "Internal server error during authentication" });
    }
};