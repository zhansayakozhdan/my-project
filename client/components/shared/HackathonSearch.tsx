// components/shared/HackathonSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Theme {
    name: string;
}

interface DisplayedLocation {
    open_state: string;
    thumbnail_url: string;
}

interface Hackathon {
    _id: string;
    id: number;
    title: string;
    displayed_location: DisplayedLocation;
    analytics_identifier: string;
    url: string;
    time_left_to_submission: string;
    submission_period_dates: string;
    themes: Theme[];
    prize_amount: string;
    registrations_count: number;
    featured: boolean;
    organization_name: string;
    winners_announced: boolean;
    submission_gallery_url: string;
    start_a_submission_url: string;
    invite_only: boolean;
    eligibility_requirement_invite_only_description: string | null;
    managed_by_devpost_badge: boolean;
    embedding: number[];
    __v: number;
}

interface ApiResponse {
    similarHackathons: Hackathon[];
    highestScoreHackathon: Hackathon;
    answer: string;
}

const HackathonSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
            setResult(response.data);
            setError('');
        } catch (err: any) {
            console.error('Error fetching data:', err.response?.data || err.message || err);
            setError(err.response?.data?.message || 'An error occurred while fetching the data.');
            setResult(null);
        }
    };

    const localizer = momentLocalizer(moment);

    const events = result?.similarHackathons.map(hackathon => {
        const [start, end] = hackathon.submission_period_dates.split(' - ').map(date => new Date(date));
        return {
            title: hackathon.title,
            start,
            end,
            allDay: true,
        };
    }) || [];



    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {result && (
                <div>
                    <h2 className="text-xl font-bold mb-2">OpenAI Answer:</h2>
                    <p className="mb-4">{result.answer}</p>
                    <h2 className="text-xl font-bold mb-2">Similar Hackathons:</h2>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                    <div className="mt-8">
                        {result.similarHackathons.map((hackathon, index) => (
                            <div key={index} className="p-4 border border-gray-300 rounded mb-2 shadow">
                                <h3 className="text-lg font-bold">{hackathon.title}</h3>
                                <p>Location: {hackathon.displayed_location.open_state}</p>
                                <img src={hackathon.displayed_location.thumbnail_url} alt={hackathon.title} className="w-16 h-16 mb-2" />
                                <p>Themes: {hackathon.themes.map(theme => theme.name).join(', ')}</p>
                                <p>Prize: {hackathon.prize_amount}</p>
                                <p>Registrations: {hackathon.registrations_count}</p>
                                <p>Submission Period: {hackathon.submission_period_dates}</p>
                                <p><a href={hackathon.url} target="_blank" className="text-blue-500">View Hackathon</a></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackathonSearch;











// import React, { useState } from 'react';
// import axios from 'axios';

// interface Theme {
//     name: string;
// }

// interface DisplayedLocation {
//     icon: string;
//     location: string;
// }

// interface Hackathon {
//     title: string;
//     displayed_location: DisplayedLocation;
//     themes: Theme[];
//     score: number;
// }

// interface ApiResponse {
//     similarHackathons: Hackathon[];
//     highestScoreHackathon: Hackathon;
//     answer: string;
// }

// const HackathonSearch: React.FC = () => {
//     const [query, setQuery] = useState('');
//     const [result, setResult] = useState<ApiResponse | null>(null);
//     const [error, setError] = useState('');

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
//             setResult(response.data);
//             setError('');
//         } catch (err: any) {
//             console.error('Error fetching data:', err.response?.data || err.message || err);
//             setError(err.response?.data?.message || 'An error occurred while fetching the data.');
//             setResult(null);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <form onSubmit={handleSubmit} className="mb-4">
//                 <input 
//                     type="text" 
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Enter your query"
//                     className="w-full p-2 border border-gray-300 rounded mb-2"
//                 />
//                 <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
//             </form>
//             {error && <p className="text-red-500">{error}</p>}
//             {result && (
//                 <div>
//                     <h2 className="text-xl font-bold mb-2">OpenAI Answer:</h2>
//                     <p className="mb-4">{result.answer}</p>
//                     <h2 className="text-xl font-bold mb-2">Similar Hackathons:</h2>
//                     <div>
//                         {result.similarHackathons.map((hackathon, index) => (
//                             <div key={index} className="p-4 border border-gray-300 rounded mb-2 shadow">
//                                 <h3 className="text-lg font-bold">{hackathon.title}</h3>
//                                 <p>Location: {hackathon.displayed_location.location}</p>
//                                 <p>Themes: {hackathon.themes.map(theme => theme.name).join(', ')}</p>
//                                 <p>Score: {hackathon.score}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HackathonSearch;
