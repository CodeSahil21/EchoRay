"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailController = exports.getAllUsersController = exports.logoutUserController = exports.getUserProfile = exports.loginUserController = exports.createUserController = void 0;
const user_service_1 = require("../services/user.service");
const schema_1 = require("../utils/schema");
const auth_1 = require("../utils/auth");
const db_1 = __importDefault(require("../db"));
const redis_service_1 = __importDefault(require("../services/redis.service"));
const createUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.createUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { email, password } = validationResult.data;
        const user = yield (0, user_service_1.createUser)({ email, password });
        const token = (0, auth_1.generateToken)(user.id);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        return res.status(201).json({ msg: "User created successfully", user, token });
    }
    catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ msg: "Error during signup" });
    }
});
exports.createUserController = createUserController;
const loginUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.loginUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { email, password } = validationResult.data;
        const user = yield db_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const isPasswordValid = yield (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }
        const token = (0, auth_1.generateToken)(user.id);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(200).json({ msg: "User logged in successfully", user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ msg: "Error during signin" });
    }
});
exports.loginUserController = loginUserController;
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ msg: "Error fetching user profile" });
    }
});
exports.getUserProfile = getUserProfile;
const logoutUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        res.clearCookie('token', { httpOnly: true });
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
        redis_service_1.default.set(token, 'logout', 'EX', 60 * 60 * 24);
        return res.status(200).json({ msg: "Logged out successfully" });
    }
    catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ msg: "Error during logout" });
    }
});
exports.logoutUserController = logoutUserController;
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.user.email;
        const loggedInUser = yield db_1.default.user.findUnique({
            where: { email: userEmail }
        });
        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const allUsers = yield (0, user_service_1.getAllUsers)({ userId: loggedInUser.id });
        return res.status(200).json({ msg: "All users fetched successfully", allUsers });
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({ msg: "Error fetching all users" });
    }
});
exports.getAllUsersController = getAllUsersController;
const getUserByEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield (0, user_service_1.getUserBYEmail)(email);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.status(200).json({ msg: "User fetched successfully", user });
    }
    catch (error) {
        console.error('Error fetching user by email:', error);
        return res.status(500).json({ msg: "Error fetching user by email" });
    }
});
exports.getUserByEmailController = getUserByEmailController;
