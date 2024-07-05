import axios from 'axios';
import { Hackathon } from '../models/Hackathon/Hackathon';
import HackathonModel from '../models/Hackathon/HackathonModel';
import { createEmbedding } from './createEmbeddings';
import { MongoClient } from 'mongodb';
import cheerio from 'cheerio';

const client = new MongoClient('mongodb+srv://admin:qwe@newcluster.go701p9.mongodb.net/main?retryWrites=true&w=majority&appName=NewCluster'); 

export const saveHackathonsToDatabase = async () => {
    const totalPages = 10; 
    console.log('wait')

    try {
        let allHackathons: Hackathon[] = [];

        for (let pageId = 1; pageId <= totalPages; pageId++) {
            const hackathons = await fetchHackathons(pageId); 

            const ongoingHackathons = hackathons.filter(hackathon => hackathon.open_state !== 'ended');

            const newHackathons = await filterNewHackathons(ongoingHackathons);

            for (const hackathon of newHackathons) {
                const detailedHackathon = await fetchHackathonDetails(hackathon.url);
                allHackathons.push({ ...hackathon, ...detailedHackathon });
            }
        }

        const savedHackathons = await HackathonModel.insertMany(allHackathons);

        await client.connect();
        const collection = client.db("main").collection("hackathons");

        for (const hackathon of savedHackathons) {
            const hackathonText = generateHackathonText(hackathon);
            const embedding = await createEmbedding(hackathonText);

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

const filterNewHackathons = async (hackathons: Hackathon[]) => {
    const existingHackathonIds = await HackathonModel.find({}, { _id: 0, id: 1 }).lean(); 
    
    const newHackathons = hackathons.filter(hackathon => {
        return !existingHackathonIds.some(existing => existing.id === hackathon.id);
    });

    return newHackathons;
};


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

        return response.data.hackathons; 
    } catch (error) {
        console.error(`Error fetching hackathons from page ${pageId}:`, error);
        throw new Error(`Error fetching hackathons from page ${pageId}`);
    }
};

export const fetchHackathonDetails = async (url: string) => {
    try {
        const response = await axios.get(url+'/rules');
        const $ = cheerio.load(response.data);

        const rulesSection = $('section.large-12.columns').html();
        
        return {
            rules: rulesSection
        };
    } catch (error) {
        console.error(`Error fetching hackathon details from ${url}:`, error);
        return {
            rules: null
        };
    }
};

export const generateHackathonText = (hackathon: Hackathon): string => {
    const themesNames = hackathon.themes.map(theme => theme.name).join(', ');
    return `${hackathon.title}. ${hackathon.displayed_location?.location}. ${hackathon.open_state}. ${hackathon.url}. ${hackathon.time_left_to_submission}. ${hackathon.submission_period_dates}. Themes: ${themesNames}. Prize: ${hackathon.prize_amount}. Registrations: ${hackathon.registrations_count}. Organization: ${hackathon.organization_name}. Rules: ${hackathon.rules}.`;
};

