import { mongoose } from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
});

export default mongoose.model('Schedule', ScheduleSchema);