import mongoose, { Document, Schema } from 'mongoose';

export interface Hackathon {
    id: number;
    title: string;
    displayed_location: {
        icon: string;
        location: string;
    };
    open_state: string;
    thumbnail_url: string;
    analytics_identifier: string;
    url: string;
    time_left_to_submission: string;
    submission_period_dates: string;
    themes: {
        id: number;
        name: string;
    }[];
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
    embedding: [number];
    rules?: string | null;
}
