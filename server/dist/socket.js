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
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./db"));
const ai_service_1 = require("./services/ai.service");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*", credentials: true }
    });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) ||
                ((_b = socket.handshake.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
            const projectId = Number(socket.handshake.query.projectId);
            if (!projectId || isNaN(projectId)) {
                return next(new Error("Invalid project ID"));
            }
            if (!token) {
                return next(new Error("Authentication token is required"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded || !decoded.id) {
                return next(new Error("Invalid token"));
            }
            const user = yield db_1.default.user.findUnique({
                where: { id: decoded.id },
                select: {
                    email: true
                }
            });
            if (!user) {
                return next(new Error("User not found"));
            }
            const project = yield db_1.default.project.findUnique({
                where: { id: projectId },
                select: {
                    id: true,
                    name: true
                }
            });
            if (!project) {
                return next(new Error("Project not found"));
            }
            socket.user = user;
            socket.project = project;
            next();
        }
        catch (err) {
            next(err);
        }
    }));
    io.on("connection", (socket) => {
        var _a;
        socket.roomId = (_a = socket.project) === null || _a === void 0 ? void 0 : _a.id.toString();
        if (socket.roomId) {
            socket.join(socket.roomId);
        }
        socket.on("project-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const message = data.message;
            const aiIsPresentInMessage = message.includes("@ai");
            socket.broadcast.to(socket.roomId).emit("project-message", data);
            if (aiIsPresentInMessage) {
                const prompt = message.replace("@ai", "");
                const result = yield (0, ai_service_1.generateResult)(prompt);
                io.to(socket.roomId).emit('project-message', {
                    message: result,
                    sender: {
                        _id: "ai",
                        email: "AI"
                    }
                });
                return;
            }
        }));
    });
};
exports.initSocket = initSocket;
