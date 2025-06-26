"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectRouter = express_1.default.Router();
const auth_middleware_1 = require("../middlewares/auth.middleware");
const project_controller_1 = require("../controllers/project.controller");
projectRouter.post('/create', auth_middleware_1.authMiddleware, project_controller_1.createProjectController);
projectRouter.get('/getAll', auth_middleware_1.authMiddleware, project_controller_1.getAllProjectsController);
projectRouter.post('/addUsers', auth_middleware_1.authMiddleware, project_controller_1.addUsersToProjectController);
projectRouter.get('/get-project/:projectId', auth_middleware_1.authMiddleware, project_controller_1.getProjectByIdController);
projectRouter.delete('/delete/:projectId', auth_middleware_1.authMiddleware, project_controller_1.deleteProjectController);
projectRouter.post('/removeUsers', auth_middleware_1.authMiddleware, project_controller_1.removeUsersFromProjectController);
projectRouter.put('/update-file-tree', auth_middleware_1.authMiddleware, project_controller_1.updateFileTreeController);
exports.default = projectRouter;
