import express from 'express';
const aiRouter = express.Router();
import { generateResultController } from '../controllers/ai.controller';

aiRouter.get('/get-result', generateResultController);

export default aiRouter;