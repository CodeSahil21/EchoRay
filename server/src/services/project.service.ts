import prisma from "../db";

interface CreateProjectInput {
    name:string;
    userId:number;
}

interface AddUsersToProjectInput{
    projectId:number;
    users:number[];// array of user IDs to add
    userId:number; // The user who is adding other users to the project
}

interface RemoveUsersFromProjectInput {
    projectId: number;
    users: number[]; // array of user IDs to remove
    userId: number; // The user who is removing others (should be leader)
}

export const createProject = async ({name ,userId}:CreateProjectInput) => {
   if(!name){
    throw new Error("Project name is required");
   }

   if(!userId){
    throw new Error("User ID is required");
   }

   try{
        const project = await prisma.project.create({
            data:{
                name,
                leaderId: userId, 
                users:{
                    connect: { id: userId }, 
                },  
            },
            include: {
                users:  {
                 select: {
                     id: true
                }  
        } 
            },
        });

      return project;
   }catch(error:any){
// Prisma unique constraint violation error code
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      throw new Error("Project name already exists");
    }
    throw error;
   }
}

export const getAllProjects = async (userId:number)=>{
    if(!userId){
        throw new Error("User ID is required");
    }

    //find all projects where user  is connectd
      const allProjects = await prisma.project.findMany(
        {
            where:{
                users:{
                    some:{id:userId}
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
}


export const addUsersToProject = async ({ projectId , users , userId}:AddUsersToProjectInput)=>{
    if(!projectId){
        throw new Error("Project ID is required");
    }

    if(!users ||!Array.isArray(users)  ||users.length === 0){
        throw new Error("At least one user ID is required to add to the project");
    }

    if(!userId){
        throw new Error("User ID is required");
    }
    // Check if the user is part of the project before adding others
    const project  = await prisma.project.findFirst({
        where:{
            id: projectId,
            users: {
                some: { id: userId } // Ensure the user is part of the project
            }
        },
        select:{leaderId:true}
    });

    if (!project) {
        throw new Error("You are not authorized to add users to this project");
    }
    
    if (project.leaderId !== userId) {
        throw new Error("Only the project leader can add users to this project");
    }

    // Add users to the project (avoids duplicates)
    const updatedProject = await prisma.project.update({
        where:{
            id:projectId
        },
        data:{
            users: {
                connect: users.map(userId => ({ id: userId })) // Connect multiple users
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
}

export const getProjectById = async ({ projectId }:{ projectId: number }) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const project = await prisma.project.findUnique({
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
}

export const deleteProject = async ({ projectId, userId }: { projectId: number; userId: number }) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    // Check if the user is the project leader
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { leaderId: true }
    });
    if (!project) {
        throw new Error("Project not found");
    }
    if (project.leaderId !== userId) {
        throw new Error("Only the project leader can delete this project");
    }
    // Delete the project
    await prisma.project.delete({
        where: { id: projectId }
    });
    return { message: "Project deleted successfully" };
};

export const removeUsersFromProject  = async ({ projectId, users, userId }: RemoveUsersFromProjectInput) => {
    if(!projectId) {
        throw new Error("Project ID is required");
    }

    if(!users || !Array.isArray(users) || users.length === 0) {
        throw new Error("At least one user ID is required to remove from the project");
    }

    if(!userId) {
        throw new Error("User ID is required");
    }
    // Check if the user is part of the project before removing others
    const project = await prisma.project.findUnique({
        where:{id:projectId},
        select: { leaderId: true }
    });

    if(!project) {
        throw new Error("Project not found");
    }

    if( project.leaderId !== userId) {
        throw new Error("Only the project leader can remove users from this project");
    }
    // Remove users from the project
    const updatedProject = await prisma.project.update({
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
}