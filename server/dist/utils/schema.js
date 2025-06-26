"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileTreeSchema = exports.removeUsersfromProjectSchema = exports.addUsersToProjectSchema = exports.createProjectSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").nonempty("email is required"),
    password: zod_1.z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").nonempty("email is required"),
    password: zod_1.z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
});
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Project name is required").max(50, "Project name must be less than 50 characters"),
});
exports.addUsersToProjectSchema = zod_1.z.object({
    projectId: zod_1.z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
    users: zod_1.z.array(zod_1.z.number().int("User ID must be an integer").positive("User ID must be a positive number")).nonempty("At least one user ID is required"),
});
exports.removeUsersfromProjectSchema = zod_1.z.object({
    projectId: zod_1.z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
    users: zod_1.z.array(zod_1.z.number().int("User ID must be an integer").positive("User ID must be a positive number")).nonempty("At least one user ID is required"),
});
exports.updateFileTreeSchema = zod_1.z.object({
    projectId: zod_1.z.number(),
    fileTree: zod_1.z.record(zod_1.z.any()),
});
