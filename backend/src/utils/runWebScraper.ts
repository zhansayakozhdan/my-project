import axios from 'axios';
import { Hackathon } from '../models/Hackathon/Hackathon';
import HackathonModel from '../models/Hackathon/HackathonModel';
import { createEmbedding } from './createEmbeddings';
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:qwe@newcluster.go701p9.mongodb.net/main?retryWrites=true&w=majority&appName=NewCluster'); // Replace with your MongoDB connection string

export const saveHackathonsToDatabase = async () => {
    const totalPages = 10; 

    try {
        let allHackathons: Hackathon[] = [];

        for (let pageId = 1; pageId <= totalPages; pageId++) {
            const hackathons = await fetchHackathons(pageId); // Fetch hackathons from the current page

            // Filter out hackathons with open_state "ended"
            const ongoingHackathons = hackathons.filter(hackathon => hackathon.open_state !== 'ended');

            // Filter new hackathons, keeping only those not yet in the database
            const newHackathons = await filterNewHackathons(ongoingHackathons);
            
            allHackathons.push(...newHackathons); // Add new hackathons to the overall array
        }

        // Save all new hackathons to MongoDB
        const savedHackathons = await HackathonModel.insertMany(allHackathons);

        await client.connect();
        const collection = client.db("main").collection("hackathons");

        for (const hackathon of savedHackathons) {
            const hackathonText = generateHackathonText(hackathon);
            const embedding = await createEmbedding(hackathonText);

            // Update the document in MongoDB.
            const result = await collection.updateOne(
                { _id: new Object(hackathon._id) },
                { $set: { embedding: embedding } }
            );

            if (result.modifiedCount === 1) {
                console.log(`Successfully updated the document with id: ${hackathon._id}`);
            } else {
                console.log(`Failed to update the document with id: ${hackathon._id}`);
            }
        }

        return savedHackathons;
    } catch (error) {
        console.error('Error saving hackathons:', error);
        throw new Error('Error saving hackathons');
    } finally {
        await client.close();
    }
};

// Function to filter new hackathons
const filterNewHackathons = async (hackathons: Hackathon[]) => {
    const existingHackathonIds = await HackathonModel.find({}, { _id: 0, id: 1 }).lean(); // Get all IDs from the database

    // Filter hackathons, keeping only those not yet in the database
    const newHackathons = hackathons.filter(hackathon => {
        return !existingHackathonIds.some(existing => existing.id === hackathon.id);
    });

    return newHackathons;
};

// Method to fetch hackathon data
export const fetchHackathons = async (pageId: number) => {
    try {
        const response = await axios.get(
            'https://devpost.com/api/hackathons',
            {
                params: {
                    page: pageId,
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                    'accept': '*/*',
                    'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'if-none-match': 'W/"3f7358e61c94c5a25cff637da998ea93"',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'Referer': 'https://devpost.com/hackathons',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                }
            }
        );

        return response.data.hackathons; // Return hackathon data
    } catch (error) {
        console.error(`Error fetching hackathons from page ${pageId}:`, error);
        throw new Error(`Error fetching hackathons from page ${pageId}`);
    }
};

// Function to generate a single text from hackathon data
export const generateHackathonText = (hackathon: Hackathon): string => {
    const themesNames = hackathon.themes.map(theme => theme.name).join(', ');
    return `${hackathon.title}. ${hackathon.displayed_location?.location}. ${hackathon.open_state}. ${hackathon.url}. ${hackathon.time_left_to_submission}. ${hackathon.submission_period_dates}. Themes: ${themesNames}. Prize: ${hackathon.prize_amount}. Registrations: ${hackathon.registrations_count}. Organization: ${hackathon.organization_name}.`;
};
