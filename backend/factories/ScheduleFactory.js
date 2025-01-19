class ScheduleFactory{
    
    BuildSchedule(schedule){

        try{
            let day = schedule.date.getDate();
            let month = schedule.date.getMonth();
            let year = schedule.date.getFullYear();
            let hour = Number.parseInt(schedule.time.split(':')[0]);
            let minutes = Number.parseInt(schedule.time.split(':')[1]);
            let startDate = new Date(year, month, day, hour, minutes);
    
            let complexSchedule = {
                id: schedule._id,
                title: `${schedule.name} - ${schedule.description}`,
                start: startDate,
                end: startDate,
                email: schedule.email,
                notified: schedule.notified
            } 
            return complexSchedule;
        }
        catch(err){
            console.log(err);
        }
    }
}

export default new ScheduleFactory();