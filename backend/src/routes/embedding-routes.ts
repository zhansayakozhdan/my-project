import express, { Request, Response } from 'express';
import HackathonModel from '../models/Hackathon/HackathonModel';
import { createEmbedding } from '../utils/createEmbeddings';
import { saveHackathonsToDatabase } from '../utils/runWebScraper';
import { hitOpenAiApi } from '../utils/openai';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const embeddingRouter = express.Router();

// Endpoint to add new hackathons to the database
embeddingRouter.post('/hackathons', async (req: Request, res: Response) => {
    try {
        const savedHackathons = await saveHackathonsToDatabase();
        res.status(201).json({
            message: 'Hackathons saved successfully',
            hackathons: savedHackathons,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: (err as Error).message,
        });
    }
});

embeddingRouter.post('/query-embedding', async (req: Request, res: Response) => {
    const client = new MongoClient(process.env.MONGODB_URL || 'mongodb+srv://admin:qwe@newcluster.go701p9.mongodb.net/main?retryWrites=true&w=majority&appName=NewCluster');

    try {
        const { query } = req.body;

        const embedding = await createEmbedding(query);
        if (!embedding) {
            throw new Error('Failed to create embedding');
        }

        await client.connect();

        const db = client.db('main');
        const collection = db.collection('hackathons');

        async function findSimilarHackathons(embedding: number[]) {
            try {
                const hackathons = await collection
                    .aggregate([
                        {
                            $search: {
                                index: "hackathonIndex",
                                knnBeta: {
                                    vector: embedding,
                                    path: 'embedding',
                                    k: 10, // Number of hackathons to be returned
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0, // Exclude the default MongoDB ID
                                title: 1,
                                displayed_location: 1,
                                open_state: 1,
                                thumbnail_url: 1,
                                analytics_identifier: 1,
                                url: 1,
                                time_left_to_submission: 1,
                                submission_period_dates: 1,
                                themes: { $map: { input: "$themes", as: "theme", in: { name: "$$theme.name" } } },
                                prize_amount: 1,
                                registrations_count: 1,
                                featured: 1,
                                organization_name: 1,
                                winners_announced: 1,
                                submission_gallery_url: 1,
                                start_a_submission_url: 1,
                                invite_only: 1,
                                eligibility_requirement_invite_only_description: 1,
                                managed_by_devpost_badge: 1,
                                score: { $meta: 'searchScore' },
                            },
                        },
                    ])
                    .toArray();

                return hackathons;
            } catch (err) {
                console.error('Error finding similar hackathons:', err);
                throw new Error('Error finding similar hackathons');
            }
        }

        const similarHackathons = await findSimilarHackathons(embedding);

        console.log('similarHackathons:', similarHackathons);

        const highestScoreHackathon = similarHackathons.reduce((highest, current) => {
            return highest.score > current.score ? highest : current;
        });

        console.log('highestScoreHackathon:', highestScoreHackathon);

        const themesNames = highestScoreHackathon.themes.map(theme => theme.name);
        const prompt = `Based on this context: ${themesNames.join(', ')} \n\n Query: ${query} \n\n Answer:`;

        console.log('Constructed Prompt:', prompt);

        const answer = await hitOpenAiApi(prompt);
        console.log('OpenAI API Answer:', answer);

        res.json({
            similarHackathons,
            highestScoreHackathon,
            answer
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: (err as Error).message,
        });
    } finally {
        await client.close();
    }
});


embeddingRouter.get('/hackathons', async (req: Request, res: Response) => {
    const client = new MongoClient(process.env.MONGODB_URL || 'mongodb://localhost:27017');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        await client.connect();

        const db = client.db('main');
        const collection = db.collection('hackathons');

        const hackathons = await collection.find({}, {
            projection: {
                _id: 0,
                title: 1,
                'displayed_location.location': 1,
                thumbnail_url: 1,
                url: 1,
                prize_amount: 1,
            }
        })
        .skip(skip)
        .limit(limit)
        .toArray();

        res.json(hackathons);
    } catch (err) {
        console.error('Error fetching hackathons:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: (err as Error).message,
        });
    } finally {
        await client.close();
    }
});

  

export default embeddingRouter;