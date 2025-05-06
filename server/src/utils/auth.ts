import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
//function to hash password :we always save hashed password in db so that db admin can't see the password
export const hashPassword = async (password:string): Promise<string> =>{
      return await bcrypt.hash(password,10);
}
//to compare password with hashed password
export const comparePassword = async (password:string,hashedPassword:string): Promise<boolean> =>{
    return await bcrypt.compare(password,hashedPassword);
}

//to generate token
export const generateToken  = (userId:number): string => {
    return jwt.sign({id:userId},process.env.JWT_SECRET as string,{expiresIn:'1d'});
}


