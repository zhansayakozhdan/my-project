import mongoose, { Document, Schema } from 'mongoose';
import { Hackathon } from './Hackathon';


export type HackathonDocument = Hackathon & Document;

const HackathonSchema = new Schema<HackathonDocument>({
    id: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    title: { 
        type: String, 
        required: true },
    displayed_location: {
        icon: { type: String },
        location: { type: String }
    },
    open_state: { type: String },
    thumbnail_url: { type: String },
    analytics_identifier: { type: String },
    url: { type: String, required: true },
    time_left_to_submission: { type: String },
    submission_period_dates: { type: String },
    themes: [{ 
        id: { type: Number, required: true },
        name: { type: String, required: true }
    }],
    prize_amount: { type: String },
    registrations_count: { type: Number },
    featured: { type: Boolean },
    organization_name: { type: String },
    winners_announced: { type: Boolean },
    submission_gallery_url: { type: String },
    start_a_submission_url: { type: String, required: true },
    invite_only: { type: Boolean },
    eligibility_requirement_invite_only_description: { type: String, default: null },
    managed_by_devpost_badge: { type: Boolean, required: true },
    embedding: [Number]
});

export default mongoose.model<HackathonDocument>('Hackathon', HackathonSchema);
