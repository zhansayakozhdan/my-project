import 'dotenv/config';
import express from 'express';
import globalRouter from './global-router';
import { logger } from './logger';
import http from 'http';
import { connectToDatabase } from './db/connection';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { saveHackathonsToDatabase } from './utils/runWebScraper';
import cors from 'cors';
import cron from 'node-cron';
//import { wss } from './roadmap/roadmap.router';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors());
app.use(morgan("dev"));
app.use('/api/v1/', globalRouter);

const server = http.createServer(app);


connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server runs at http://localhost:${PORT}`);
    });
  }).catch(err => console.log(err));

  
cron.schedule(
  '0 0 * * *',
  async () => {
    console.log('Running cron job to fetch and save hackathons...');
    try {
      await saveHackathonsToDatabase();
      console.log('Hackathons saved successfully.');
    } catch (error) {
      console.error('Error saving hackathons:', error);
    }
  },
  {
    timezone: 'Asia/Almaty',
  }
);