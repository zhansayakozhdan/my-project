import { Router } from 'express';
import userRoutes from './routes/user-routes';
import chatRoutes from './routes/chat-routes';
import embeddingRouter from './routes/embedding-routes';
//import { roadmapRouter } from './roadmap/roadmap.router';
// other routers can be imported here

const globalRouter = Router();

// Use the userRouter for user-related routes
//globalRouter.use(roadmapRouter);

// other routers can be added here
globalRouter.use("/user", userRoutes);
globalRouter.use("/chats", chatRoutes);
globalRouter.use("/embeddings", embeddingRouter);

export default globalRouter;
