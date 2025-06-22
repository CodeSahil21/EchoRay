import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("email is required"),
  password: z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
})

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("email is required"),
  password: z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
})

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(50, "Project name must be less than 50 characters"),
});

export const addUsersToProjectSchema = z.object({
  projectId: z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
  users: z.array(z.number().int("User ID must be an integer").positive("User ID must be a positive number")).nonempty("At least one user ID is required"),
});

export const removeUsersfromProjectSchema = z.object({
  projectId: z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
  users: z.array(z.number().int("User ID must be an integer").positive("User ID must be a positive number")).nonempty("At least one user ID is required"),
});


export const updateFileTreeSchema = z.object({
  projectId: z.number(),
  fileTree: z.record(z.any()),
});