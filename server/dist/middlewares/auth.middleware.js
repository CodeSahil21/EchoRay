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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_service_1 = __importDefault(require("../services/redis.service"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized: Token not provided" });
        }
        const isBlacklisted = yield redis_service_1.default.get(token);
        if (isBlacklisted) {
            res.cookie('token', '');
            return res.status(401).json({ msg: "Unauthorized: Token is blacklisted" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield db_1.default.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true
            }
        });
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized: User not found" });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        console.error('Error during authentication:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ msg: "Unauthorized: Invalid token" });
        }
        return res.status(500).json({ msg: "Internal server error during authentication" });
    }
});
exports.authMiddleware = authMiddleware;
