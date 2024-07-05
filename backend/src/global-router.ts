import { Router } from 'express';
import userRoutes from './routes/user-routes';
import chatRoutes from './routes/chat-routes';
import embeddingRouter from './routes/embedding-routes';
// other routers can be imported here

const globalRouter = Router();

// Use the userRouter for user-related routes

// other routers can be added here
globalRouter.use("/user", userRoutes);
globalRouter.use("/embeddings", embeddingRouter);

export default globalRouter;
