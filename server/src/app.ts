import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import userRouter from './routes/user.routes';
import projectRouter from './routes/project.routes';
import aiRouter from './routes/ai.routes';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet'


const app = express();
app.use(morgan('dev'));
app.use(cors({
  origin: "https://echo-ray-psi.vercel.app", 
  credentials: true
}));
app.use(cookieparser());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/project', projectRouter); 
app.use('/api/v1/ai', aiRouter); 


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Internal Server Error' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
export default app;
