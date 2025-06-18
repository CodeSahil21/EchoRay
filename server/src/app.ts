import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import userRouter from './routes/user.routes';
import projectRouter from './routes/project.routes';

const app = express();

app.use(morgan('dev'));
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
app.use(cookieparser());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/user', userRouter); // Mount the user router on the /api/v1/user path
app.use('/api/v1/project', projectRouter); // Mount the project router on the /api/v1/project path

app.get('/', (req, res) => {   
    res.send('Hello World!');
 })
export default app;