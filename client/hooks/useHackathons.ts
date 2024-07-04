'use client'
import { useState, useEffect } from 'react';

interface Hackathon {
    title: string;
    displayed_location: { location: string };
    thumbnail_url: string;
    url: string;
    prize_amount: string;
}

export const useHackathons = (page: number, limit: number) => {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/embeddings/hackathons?page=${page}&limit=${limit}`);
                const data = await response.json();
                setHackathons(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hackathons:', error);
                setLoading(false);
            }
        };

        fetchHackathons();
    }, [page, limit]);

    return { hackathons, loading };
};
