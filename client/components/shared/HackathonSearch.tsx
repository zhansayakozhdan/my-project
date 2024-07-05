import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Theme {
  name: string;
}

interface DisplayedLocation {
  icon: string;
  location: string;
}

interface Hackathon {
  _id: string;
  id: number;
  title: string;
  displayed_location: DisplayedLocation;
  thumbnail_url: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleQueries = [
    "Web developer; Age: 20; Almaty",
    "I'm UX/UI designer, sudent, from Kazakhstan",
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
      setResult(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching data:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'An error occurred while fetching the data.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const localizer = momentLocalizer(moment);

  const events: Event[] = result?.similarHackathons.map(hackathon => {
    const [start, end] = hackathon.submission_period_dates.split(' - ').map(date => new Date(date));
    return {
      title: hackathon.title,
      start,
      end,
      allDay: true,
    };
  }) || [];

  const extractCurrencyValue = (htmlString: string): number => {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const span = div.querySelector('span[data-currency-value]');
    if (span) {
      const value = span.textContent || '0';
      return parseFloat(value.replace(/,/g, ''));
    }
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-2 flex items-center">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Напиши о себе..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button type="submit" className="bg-primary-500 text-white p-2 rounded ml-2 mb-2">Search</button>
      </form>
      <div className="mb-4">
        <div className="flex flex-wrap">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="bg-gray-200 text-gray-800 p-2 rounded mr-2 mb-2"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      {loading && <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>}
      {error && <p className="text-red-500">{error}</p>}
      {result && !loading && (
        <div>
          {/* <h2 className="text-xl font-bold mb-2">OpenAI Answer:</h2>
          <p className="mb-4">{result.answer}</p> */}
          <h2 className="text-xl font-bold mb-3 mt-5">Мероприятия подходящие именно тебе:</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {result.similarHackathons.map((hackathon, index) => (
        <div key={index} className='border border-gray-300 rounded-lg'>
          <img src={hackathon.thumbnail_url} alt="Event Image" className="rounded-t-lg w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{hackathon.title}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <MapPinIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">{hackathon.displayed_location.location}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <TagIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">{hackathon.themes.map(theme => theme.name).join(', ')}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Submission Period: {hackathon.submission_period_dates}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">${extractCurrencyValue(hackathon.prize_amount)}</span>
            </div>
            <p><a href={hackathon.url} target="_blank" className="text-primary-500">View Hackathon</a></p>
          </div>
        </div>
        ))}
        </div>
        </div>
      )}
    </div>
  );
};

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

const CalendarIcon: React.FC<SvgIconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const MapPinIcon: React.FC<SvgIconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TagIcon: React.FC<SvgIconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);


const TrophyIcon: React.FC<SvgIconProps> = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )


export default HackathonSearch;
