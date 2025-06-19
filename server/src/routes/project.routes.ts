import express from 'express';
const projectRouter = express.Router();
import { authMiddleware } from '../middlewares/auth.middleware';
import { createProjectController,getAllProjectsController,addUsersToProjectController,getProjectByIdController, deleteProjectController } from '../controllers/project.controller';

//route to createproject
projectRouter.post('/create',authMiddleware, createProjectController);
projectRouter.get('/getAll',authMiddleware, getAllProjectsController);
projectRouter.post('/addUsers',authMiddleware, addUsersToProjectController);
projectRouter.get('/get-project/:projectId', authMiddleware, getProjectByIdController);
projectRouter.delete('/delete/:projectId', authMiddleware, deleteProjectController);

export default projectRouter;