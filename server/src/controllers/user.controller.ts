import { createUser } from "../services/user.service";
import { Request, Response, NextFunction } from 'express';
import { createUserSchema } from "../utils/schema"
import { generateToken } from "../utils/auth";

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