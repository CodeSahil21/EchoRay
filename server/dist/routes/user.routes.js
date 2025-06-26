"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
userRouter.post('/register', user_controller_1.createUserController);
userRouter.post('/login', user_controller_1.loginUserController);
userRouter.get('/profile', auth_middleware_1.authMiddleware, user_controller_1.getUserProfile);
userRouter.get('/logout', auth_middleware_1.authMiddleware, user_controller_1.logoutUserController);
userRouter.get('/getAll', auth_middleware_1.authMiddleware, user_controller_1.getAllUsersController);
userRouter.get('/getUserByEmail', auth_middleware_1.authMiddleware, user_controller_1.getUserByEmailController);
exports.default = userRouter;
