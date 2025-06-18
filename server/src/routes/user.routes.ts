import express from 'express';
const userRouter = express.Router();
import { createUserController,loginUserController,getUserProfile ,logoutUserController,getAllUsersController, getUserByEmailController} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';


//route to create user or register user account
userRouter.post('/register',createUserController);
//route to login user account
userRouter.post('/login',loginUserController);
//route to get user account details
userRouter.get('/profile',authMiddleware,getUserProfile );
//route to logout user account
userRouter.get('/logout',authMiddleware,logoutUserController);
//route to get all users
userRouter.get('/getAll',authMiddleware,getAllUsersController);
//route to get user by email
userRouter.get('/getUserByEmail',authMiddleware,getUserByEmailController);
export default userRouter;