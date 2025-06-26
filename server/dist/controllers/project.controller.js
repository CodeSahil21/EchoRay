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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileTreeController = exports.removeUsersFromProjectController = exports.deleteProjectController = exports.getProjectByIdController = exports.addUsersToProjectController = exports.getAllProjectsController = exports.createProjectController = void 0;
const project_service_1 = require("../services/project.service");
const schema_1 = require("../utils/schema");
const createProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.createProjectSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { name } = validationResult.data;
        const userId = req.user.id;
        const newproject = yield (0, project_service_1.createProject)({ name, userId });
        return res.status(201).json({ msg: "Project created successfully", newproject });
    }
    catch (e) {
        console.error('Error during project creation:', e);
        return res.status(500).json({ msg: "Error during project creation" });
    }
});
exports.createProjectController = createProjectController;
const getAllProjectsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const allProjects = yield (0, project_service_1.getAllProjects)(userId);
        return res.status(200).json({ msg: "All projects fetched successfully", allProjects });
    }
    catch (e) {
        console.error('Error during fetching projects:', e);
        return res.status(500).json({ msg: "Error during fetching projects" });
    }
});
exports.getAllProjectsController = getAllProjectsController;
const addUsersToProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.addUsersToProjectSchema.safeParse({
            projectId: Number(req.body.projectId),
            users: (req.body.users || []).map(Number),
        });
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { projectId, users } = validationResult.data;
        const userId = req.user;
        const project = yield (0, project_service_1.addUsersToProject)({ projectId, users, userId: userId.id });
        return res.status(200).json({ msg: "Users added to project successfully", project });
    }
    catch (e) {
        console.error('Error during adding users to project:', e);
        return res.status(500).json({ msg: "Error during adding users to project" });
    }
});
exports.addUsersToProjectController = addUsersToProjectController;
const getProjectByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const project = yield (0, project_service_1.getProjectById)({ projectId: Number(projectId) });
        return res.status(200).json({ msg: "Project fetched successfully", project });
    }
    catch (e) {
        console.error('Error during fetching project by ID:', e);
        return res.status(500).json({ msg: e.message });
    }
});
exports.getProjectByIdController = getProjectByIdController;
const deleteProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = Number(req.params.projectId);
        const userId = req.user.id;
        if (!projectId) {
            return res.status(400).json({ msg: "Project ID is required" });
        }
        const result = yield (0, project_service_1.deleteProject)({ projectId, userId });
        return res.status(200).json(result);
    }
    catch (e) {
        console.error('Error during project deletion:', e);
        return res.status(500).json({ msg: e.message || "Error during project deletion" });
    }
});
exports.deleteProjectController = deleteProjectController;
const removeUsersFromProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.removeUsersfromProjectSchema.safeParse({
            projectId: Number(req.body.projectId),
            users: (req.body.users || []).map(Number),
        });
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { projectId, users } = validationResult.data;
        const userId = req.user;
        const project = yield (0, project_service_1.removeUsersFromProject)({ projectId, users, userId: userId.id });
        return res.status(200).json({ msg: "Users removed from project successfully", project });
    }
    catch (e) {
        console.log('Error during removing users from project:', e);
        return res.status(500).json({ msg: e.message || "Error during removing users from project" });
    }
});
exports.removeUsersFromProjectController = removeUsersFromProjectController;
const updateFileTreeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = schema_1.updateFileTreeSchema.safeParse({
            projectId: Number(req.body.projectId),
            fileTree: req.body.fileTree,
        });
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }
        const { projectId, fileTree } = validationResult.data;
        const project = yield (0, project_service_1.updateFileTree)({ projectId, fileTree });
        return res.status(200).json({ msg: "File tree updated successfully", project });
    }
    catch (err) {
        console.log("Error updating file tree:", err);
        return res.status(500).json({ msg: err.message || "Error updating file tree" });
    }
});
exports.updateFileTreeController = updateFileTreeController;
