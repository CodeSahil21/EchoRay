import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./db"; // Adjust path as needed
import cookie from "cookie";
import { generateResult } from "./services/ai.service";

export interface Project {
  id: number;
  name: string;
}
interface UserSocket {
  email: string;
}
interface CustomSocket extends Socket {
  user?: UserSocket;
  project?: Project;
  roomId?: string;
}

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true }
  });

  io.use(async (socket: CustomSocket, next: any) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(" ")[1];
      const projectId = Number(socket.handshake.query.projectId);

      if (!projectId || isNaN(projectId)) {
        return next(new Error("Invalid project ID"));
      }

      if (!token) {
        return next(new Error("Authentication token is required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      if (!decoded || !decoded.id) {
        return next(new Error("Invalid token"));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          email: true
        }
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      const project = await prisma.project.findUnique({
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
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.roomId = socket.project?.id.toString();
    console.log(`User ${socket.user?.email} connected to project ${socket.project?.name}`);
    if (socket.roomId) {
      socket.join(socket.roomId);
    }

    socket.on("project-message",async(data:any)=>{
      const message = data.message;
      const aiIsPresentInMessage = message.includes("@ai");
      socket.broadcast.to(socket.roomId!).emit("project-message", data);

      if(aiIsPresentInMessage) {
        const prompt = message.replace("@ai", "");

        const result = await generateResult(prompt);

        io.to(socket.roomId!).emit('project-message', {
          message: result,
          sender:{
            _id: "ai",
            email:"AI"
          }
        });
        return;
      }
    });
  });


};

/*
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./db"; // Adjust path as needed
import cookie from "cookie";

export interface Project {
  id: number;
  name: string;
}
interface UserSocket {
  email: string;
}
interface CustomSocket extends Socket {
  user?: UserSocket;
  project?: Project;
  roomId?: string;
}

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000", credentials: true }
  });

  io.use(async (socket: CustomSocket, next: any) => {
    try {
      // Parse JWT from HTTP-only cookie
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      const projectId = Number(socket.handshake.query.projectId);

      if (!projectId || isNaN(projectId)) {
        return next(new Error("Invalid project ID"));
      }

      if (!token) {
        return next(new Error("Authentication token is required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      if (!decoded || !decoded.id) {
        return next(new Error("Invalid token"));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          email: true
        }
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      const project = await prisma.project.findUnique({
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
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.roomId = socket.project?.id.toString();
    console.log(`User ${socket.user?.email} connected to project ${socket.project?.name}`);
    if (socket.roomId) {
      socket.join(socket.roomId);
    }

    socket.on("project-message", async (data: any) => {
      socket.broadcast.to(socket.roomId!).emit("project-message", data);
    });
  });
};
*/