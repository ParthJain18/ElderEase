import nodemailer from 'nodemailer';
import BadRequest from '../errors/BadRequest.js';
import InternalError from '../errors/InternalError.js';
import ScheduleFactory from '../factories/ScheduleFactory.js';
import Schedule from '../models/Schedule.js';

class ScheduleService{
    
    constructor(){
        this.Schedule = Schedule;
    }

    async getSchedules(showFinished = false){
        if(showFinished)
            return await this.Schedule.find({}).sort({date: -1});

        else{
            let schedules = await this.Schedule.find({finished: false});
            let complexSchedules = [];

            schedules.forEach(schedule => {
                if(schedule.date !== undefined && schedule.time !== undefined)
                    complexSchedules.push(ScheduleFactory.BuildSchedule(schedule));
            });
            return complexSchedules;
        }
    }

    async searchSchedule(search){
        try{
            let schedules = await this.Schedule.find().or([ {'email':{$regex: `^${search}`} }]).sort({date: -1});
            return schedules;
        }
        catch(err){
            console.log(err);
            throw new BadRequest('Schedule not found');
        }
    }

    async createSchedule(schedule){
        // let date = new Date(schedule.date);
        // let today = new Date();
        // if(date <= today)
        //     throw new BadRequest('Date must be greater than today');

        const newSchedule = new Schedule({
            name: schedule.name,
            email: schedule.email,
            description: schedule.description,
            date: schedule.date,
            time: schedule.time,
            finished: false,
            notified: false
        });
        try{
            const savedSchedule = await newSchedule.save();
            return savedSchedule;
        }
        catch(err){
            throw new InternalError('Error while saving schedule');
        }
    }

    async getSchedule(id){
        try{
            let schedule = await this.Schedule.findById(id);
            return schedule;
        }
        catch(err){
            throw new BadRequest('Schedule not found');
        }
    }

    async finishSchedule(id){
        try{
            let schedule = await this.getSchedule(id);
            schedule.finished = true;
            await schedule.save();
            return schedule;
        }
        catch(err){
            throw new BadRequest('Schedule not found');
        }
    }

    async notifySchedules(){
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "7f45a2ed757fdc",
              pass: "94bca054ee6e2a"
            }
        });

        try{
            let schedules = await this.getSchedules();
            schedules.forEach( async schedule => {
                let hour = 1000 * 60 * 60;
                let date = schedule.start.getTime();
                let today = new Date().getTime();
                let diff = date - today;

                if(diff <= hour && !schedule.notified){

                    let scheduleNotified = await this.getSchedule(schedule.id);
                    scheduleNotified.notified = true;
                    let savedSchedule = new Schedule(scheduleNotified);
                    await savedSchedule.save();

                    transport.sendMail({
                        from:'"Maddison Foo Koch 👻" <anikeshkulal@gmail.com>',
                        to: "anikeshkulalinft-@atharvacoe.ac.in",
                        subject: 'Schedule reminder',
                        text: `Hello, this is a reminder for your schedule`
                    })
                    .then(() => {
                        schedule.notified = true;
                        schedule.save();
                    })
                    .catch(err => console.log(err));

                }
                else{

                    console.log('Not notified');
                    console.log(schedule);
                }
            });
        }
        catch(err){
            console.log(err);
            throw new BadRequest('Schedule not found');
        }
    }
}

export default new ScheduleService();