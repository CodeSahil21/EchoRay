import {Request, Response} from "express";  
import { generateResult } from "../services/ai.service";

export const  generateResultController = async (req: Request, res: Response): Promise<any> => {
    try{
        const {prompt } = req.query;

        const result = await generateResult(prompt);
        return res.send(result);
    }catch(e:any){
        console.log('Error during AI result generation:', e.message);
        // Send error response
        return res.status(500).json({ msg: "Error during AI result generation" });
    }
}