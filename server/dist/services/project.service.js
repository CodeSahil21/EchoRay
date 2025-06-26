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
exports.updateFileTree = exports.removeUsersFromProject = exports.deleteProject = exports.getProjectById = exports.addUsersToProject = exports.getAllProjects = exports.createProject = void 0;
const db_1 = __importDefault(require("../db"));
const createProject = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, userId }) {
    var _b, _c;
    if (!name) {
        throw new Error("Project name is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    try {
        const project = yield db_1.default.project.create({
            data: {
                name,
                leaderId: userId,
                users: {
                    connect: { id: userId },
                },
            },
            include: {
                users: {
                    select: {
                        id: true
                    }
                }
            },
        });
        return project;
    }
    catch (error) {
        if (error.code === "P2002" && ((_c = (_b = error.meta) === null || _b === void 0 ? void 0 : _b.target) === null || _c === void 0 ? void 0 : _c.includes("name"))) {
            throw new Error("Project name already exists");
        }
        throw error;
    }
});
exports.createProject = createProject;
const getAllProjects = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const allProjects = yield db_1.default.project.findMany({
        where: {
            users: {
                some: { id: userId }
            }
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            users: { select: { id: true } }
        }
    });
    return allProjects;
});
exports.getAllProjects = getAllProjects;
const addUsersToProject = (_a) => __awaiter(void 0, [_a], void 0, function* ({ projectId, users, userId }) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new Error("At least one user ID is required to add to the project");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    const project = yield db_1.default.project.findFirst({
        where: {
            id: projectId,
            users: {
                some: { id: userId }
            }
        },
        select: { leaderId: true }
    });
    if (!project) {
        throw new Error("You are not authorized to add users to this project");
    }
    if (project.leaderId !== userId) {
        throw new Error("Only the project leader can add users to this project");
    }
    const updatedProject = yield db_1.default.project.update({
        where: {
            id: projectId
        },
        data: {
            users: {
                connect: users.map(userId => ({ id: userId }))
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });
    return updatedProject;
});
exports.addUsersToProject = addUsersToProject;
const getProjectById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ projectId }) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    const project = yield db_1.default.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            fileTree: true,
            createdAt: true,
            leaderId: true,
            users: {
                select: {
                    id: true,
                    email: true
                }
            }
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    return project;
});
exports.getProjectById = getProjectById;
const deleteProject = (_a) => __awaiter(void 0, [_a], void 0, function* ({ projectId, userId }) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    const project = yield db_1.default.project.findUnique({
        where: { id: projectId },
        select: { leaderId: true }
    });
    if (!project) {
        throw new Error("Project not found");
    }
    if (project.leaderId !== userId) {
        throw new Error("Only the project leader can delete this project");
    }
    yield db_1.default.project.delete({
        where: { id: projectId }
    });
    return { message: "Project deleted successfully" };
});
exports.deleteProject = deleteProject;
const removeUsersFromProject = (_a) => __awaiter(void 0, [_a], void 0, function* ({ projectId, users, userId }) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new Error("At least one user ID is required to remove from the project");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    const project = yield db_1.default.project.findUnique({
        where: { id: projectId },
        select: { leaderId: true }
    });
    if (!project) {
        throw new Error("Project not found");
    }
    if (project.leaderId !== userId) {
        throw new Error("Only the project leader can remove users from this project");
    }
    const updatedProject = yield db_1.default.project.update({
        where: { id: projectId },
        data: {
            users: {
                disconnect: users.map(userId => ({ id: userId }))
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });
    return updatedProject;
});
exports.removeUsersFromProject = removeUsersFromProject;
const updateFileTree = (_a) => __awaiter(void 0, [_a], void 0, function* ({ projectId, fileTree }) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!fileTree || typeof fileTree !== "object") {
        throw new Error("File tree is required");
    }
    const updatedProject = yield db_1.default.project.update({
        where: { id: projectId },
        data: { fileTree }
    });
    return updatedProject;
});
exports.updateFileTree = updateFileTree;
