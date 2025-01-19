import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import ScheduleService from "../services/ScheduleService.js";

export const index = async (req, res) => {
  let { finisheds } = req.query;
  try {
    if (finisheds) {
      const schedules = await ScheduleService.getSchedules(true);
      return res.status(200).json(schedules);
    }
    const schedules = await ScheduleService.getSchedules();
    res.status(200).json(schedules);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

export const get = async (req, res) => {
  let { id } = req.params;
  if (!id) res.status(400).json({ message: "Id not provided" });
  try {
    const schedule = await ScheduleService.getSchedule(id);
    res.status(200).json(schedule);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

export const search = async (req, res) => {
  let { search } = req.query;
  try {
    let schedules;
    if (search === "") {
      schedules = await ScheduleService.getSchedules(true);
    }
    schedules = await ScheduleService.searchSchedule(search);
    res.status(200).json(schedules);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

// export const create = async (req, res) => {
//   if (
//     req.body.name &&
//     req.body.email &&
//     req.body.description &&
//     req.body.date &&
//     req.body.time
//   ) {
//     try {
//       const savedSchedule = await ScheduleService.createSchedule(req.body);
//       res.status(201).json({
//         message: "New schedule created",
//         error: false,
//         schedule: savedSchedule,
//       });
//     } catch (err) {
//       res.status(400).json({
//         message: err,
//         error: true,
//       });
//     }
//   } else {
//     res.status(400).json({
//       message: "Fill all the fields!",
//       error: true,
//     });
//   }
// };

export const create = async (req, res) => {
    if (
      req.body.name &&
      req.body.email &&
      req.body.description &&
      req.body.date &&
      req.body.time
    ) {
      try {
        // First create the schedule
        const savedSchedule = await ScheduleService.createSchedule(req.body);
        
        // Find both user and doctor by email
        const user = await User.findOne({ email: req.body.email });
        const doctor = await Doctor.findOne({ email: req.body.email });
  
        if (!user && !doctor) {
          return res.status(404).json({
            message: "Neither user nor doctor found with this email",
            error: true,
          });
        }
  
        // If it's a user, update their appointments
        if (user) {
          await User.findByIdAndUpdate(
            user._id,
            {
              $push: { appointments: savedSchedule._id }
            },
            { new: true }
          );
        }
  
        // If it's a doctor, update their appointments
        if (doctor) {
          await Doctor.findByIdAndUpdate(
            doctor._id,
            {
              $push: { appointments: savedSchedule._id }
            },
            { new: true }
          );
        }
  
        res.status(201).json({
          message: "New schedule created and linked successfully",
          error: false,
          schedule: savedSchedule,
        });
      } catch (err) {
        res.status(400).json({
          message: err.message,
          error: true,
        });
      }
    } else {
      res.status(400).json({
        message: "Fill all the fields!",
        error: true,
      });
    }
  };

export const update = async (req, res) => {
  let { id } = req.params;
  if (!id) res.status(400).json({ message: "Id not provided" });

  try {
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

export const finish = async (req, res) => {
  let { id } = req.body;
  if (!id) res.status(400).json({ message: "Id not provided" });

  try {
    const schedule = await ScheduleService.finishSchedule(id);
    res.status(200).json({ message: "Schedule finished", schedule });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};
