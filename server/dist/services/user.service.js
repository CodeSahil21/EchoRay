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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBYEmail = exports.getAllUsers = exports.createUser = void 0;
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../utils/auth");
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const isUserExist = yield db_1.default.user.findUnique({
        where: { email },
    });
    if (isUserExist) {
        throw new Error("User already exists");
    }
    const hashedPassword = yield (0, auth_1.hashPassword)(password);
    const user = yield db_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
        }
    });
    return user;
});
exports.createUser = createUser;
const getAllUsers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const users = yield db_1.default.user.findMany({
        where: {
            id: { not: userId }
        },
        select: {
            id: true,
            email: true,
        }
    });
    return users;
});
exports.getAllUsers = getAllUsers;
const getUserBYEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
        }
    });
    return user;
});
exports.getUserBYEmail = getUserBYEmail;
