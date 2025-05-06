import prisma from "../db";
import { hashPassword } from "../utils/auth";
interface CreateUserInput {
    email: string;
    password: string;
}
export const createUser = async ({email,password}:CreateUserInput)=>{
     if(!email || !password){
        throw new Error("Email and password are required");
     }
     // check if user already exists
     const isUserExist = await prisma.user.findUnique({
        where: { email },
     });
        if (isUserExist) {
            throw new Error("User already exists");
        }

     //hash the password
     const hashedPassword = await hashPassword(password);

    // create User
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select:{
            id:true,
            email:true,
        }
    });

    return user;
}