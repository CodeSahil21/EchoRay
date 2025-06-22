import {createProject,getAllProjects,addUsersToProject,getProjectById, deleteProject,removeUsersFromProject,updateFileTree } from "../services/project.service";
import {Request, Response} from "express";  
import {createProjectSchema,addUsersToProjectSchema,removeUsersfromProjectSchema,updateFileTreeSchema} from "../utils/schema";
import prisma from "../db";
import {AuthenticatedRequest} from "../utils/type";

export const createProjectController = async (req:AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const validationResult = createProjectSchema.safeParse(req.body);
    if (!validationResult.success) {
      // If validation fails, send a 400 response with the error details
      return res.status(400).json({ errors: validationResult.error.errors });
    }
    const { name } = validationResult.data; // Extract validated data
    const userId = (req.user as { id: number }).id; // Assuming req.user contains the authenticated user's ID
    const newproject = await createProject({ name, userId });
    return res.status(201).json({ msg: "Project created successfully", newproject });
  } catch (e: any) {
    console.error('Error during project creation:', e);
    // Send error response
    return res.status(500).json({ msg: "Error during project creation" });
  }
};


export const getAllProjectsController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = (req.user as { id: number }).id; // Assuming req.user contains the authenticated user's ID
    const allProjects = await getAllProjects(userId);
    return res.status(200).json({ msg: "All projects fetched successfully", allProjects });
  } catch (e: any) {
    console.error('Error during fetching projects:', e);
    // Send error response
    return res.status(500).json({ msg: "Error during fetching projects" });
  }
};


export const addUsersToProjectController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try{
      const validationResult = addUsersToProjectSchema.safeParse({
      projectId: Number(req.body.projectId),
      users: (req.body.users || []).map(Number),
    });
      if(!validationResult.success){
          // If validation fails, send a 400 response with the error details
          return res.status(400).json({ errors: validationResult.error.errors });
      }
    const { projectId, users } = validationResult.data; // Extract validated data
    const userId = req.user as { id: number }; // Assuming req.user contains the authenticated user's ID
    const project = await addUsersToProject({ projectId, users, userId: userId.id });
    return res.status(200).json({ msg: "Users added to project successfully", project });
  }catch(e:any){
    console.error('Error during adding users to project:', e);
    // Send error response
    return res.status(500).json({ msg: "Error during adding users to project" });
  }
};  


export const getProjectByIdController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
   const { projectId } = req.params; // Assuming projectId is passed as a route parameter
   try{
     const project = await getProjectById({ projectId: Number(projectId) });
     return res.status(200).json({ msg: "Project fetched successfully", project });
   }catch(e:any){
    console.error('Error during fetching project by ID:', e);
    return res.status(500).json({ msg: e.message});
   }
}

export const deleteProjectController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const projectId = Number(req.params.projectId);
    const userId = (req.user as { id: number }).id;
    if (!projectId) {
      return res.status(400).json({ msg: "Project ID is required" });
    }
    const result = await deleteProject({ projectId, userId });
    return res.status(200).json(result);
  } catch (e: any) {
    console.error('Error during project deletion:', e);
    return res.status(500).json({ msg: e.message || "Error during project deletion" });
  }
};

export const removeUsersFromProjectController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const validationResult = removeUsersfromProjectSchema.safeParse({
      projectId: Number(req.body.projectId),
      users: (req.body.users || []).map(Number),
    });
      if(!validationResult.success){
          // If validation fails, send a 400 response with the error details
          return res.status(400).json({ errors: validationResult.error.errors });
      }
    const { projectId, users } = validationResult.data; // Extract validated data
    const userId = req.user as { id: number }; 
    const project = await removeUsersFromProject({ projectId, users, userId: userId.id});
    return res.status(200).json({ msg: "Users removed from project successfully", project });
  } catch (e: any) {
    console.log('Error during removing users from project:', e);
    return res.status(500).json({ msg: e.message || "Error during removing users from project" });
  }
};


export const updateFileTreeController = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const validationResult = updateFileTreeSchema.safeParse({
      projectId: Number(req.body.projectId),
      fileTree: req.body.fileTree,
    });
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }
    const { projectId, fileTree } = validationResult.data
    const project = await updateFileTree({ projectId, fileTree });
    return res.status(200).json({ msg: "File tree updated successfully", project });
  } catch (err: any) {
    console.log("Error updating file tree:", err);
    return res.status(500).json({ msg: err.message || "Error updating file tree" });
  }
};
