import { createUser,getAllUsers,getUserBYEmail } from "../services/user.service";
import { Request, Response, NextFunction } from 'express';
import { createUserSchema,loginUserSchema } from "../utils/schema"
import { generateToken ,comparePassword} from "../utils/auth";
import prisma from "../db";
import { AuthenticatedRequest } from "../utils/type";
import redisClient from '../services/redis.service';

export const createUserController = async (req:Request, res:Response,next:NextFunction):Promise<any> => {
    try{
       const validationResult =  createUserSchema.safeParse(req.body);
         if (!validationResult.success) {
              // If validation fails, send a 400 response with the error details
              return res.status(400).json({ errors: validationResult.error.errors });
         }
            const { email, password } = validationResult.data; // Extract validated data
            // Call the service to create a new user
            const user = await createUser({ email, password });
           // Generate a token for the user
            const token = generateToken(user.id); 
             // Send a success response with the created user data
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
            // Remove password before sending user object 
            return res.status(201).json({ msg: "User created successfully", user, token });
    }catch (error) {   
         // Log the error for debugging
         console.error('Error during signup:', error);

         // Send error response
         return res.status(500).json({ msg: "Error during signup" });
 
         // Optionally, pass the error to the global error handler if it exists
         // next(error);
     }
}

export const loginUserController = async (req:Request, res:Response,next:NextFunction):Promise<any> => {
     try{
          //validate the request body using the loginUserSchema
          const validationResult =  loginUserSchema.safeParse(req.body);
          if (!validationResult.success) {
               // If validation fails, send a 400 response with the error details
               return res.status(400).json({ errors: validationResult.error.errors });
          }
          const { email, password } = validationResult.data; // Extract validated data    
          const user = await prisma.user.findUnique({
               where: { email },
                select: {
                      id: true,
                      email: true,
                      password: true // Include password for comparison
                }
          });
          if (!user) {
               return res.status(404).json({ msg: "User not found" });
          }
          // Check if the password is correct
          const isPasswordValid = await comparePassword(password, user.password );

          if (!isPasswordValid) {
               return res.status(401).json({ msg: "Invalid password" });
          }
          // Generate a token for the user
          const token = generateToken(user.id);
          // Optionally, you can set the token in a cookie or send it in the response body
           res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
           // Remove password before sending user object
           const { password: _, ...userWithoutPassword } = user;
          // Send a success response with the user data and token
          return res.status(200).json({ msg: "User logged in successfully", user: userWithoutPassword, token });
     }catch(error){
          console.error('Error during signup:', error);
          // Send error response
          return res.status(500).json({ msg: "Error during signin" });
          // Optionally, pass the error to the global error handler if it exists
          // next(error);
     }
}


export const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
     try {
         const user = req.user;
 
         if (!user) {
             return res.status(401).json({ msg: "Unauthorized" });
         }
 
         return res.status(200).json({ user });
     } catch (error) {
         console.error('Error fetching user profile:', error);
         return res.status(500).json({ msg: "Error fetching user profile" });
     }
 };
 
 export const logoutUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
     try {
         // Clear the token from cookies
         res.clearCookie('token', { httpOnly: true });

         // Extract the token from cookies or Authorization header
         const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
         redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // Set the token in Redis with an expiration time
         return res.status(200).json({ msg: "Logged out successfully" });
     } catch (error) {
         console.error('Error during logout:', error);
         return res.status(500).json({ msg: "Error during logout" });
     }
 };

 export const getAllUsersController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
     try {
        const userEmail = (req.user as { email: string }).email;
        // Find the logged-in user by email
        const loggedInUser = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Get all users except the logged-in user
        const allUsers = await getAllUsers({ userId: loggedInUser.id });
         return res.status(200).json({ msg: "All users fetched successfully",  allUsers });
     } catch (error) {
         console.error('Error fetching all users:', error);
         return res.status(500).json({ msg: "Error fetching all users" });
     }
 }
 

export const getUserByEmailController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email } = req.body; // Assuming email is passed in the request body
        const user = await getUserBYEmail(email);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.status(200).json({ msg: "User fetched successfully", user });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return res.status(500).json({ msg: "Error fetching user by email" });
    }
}