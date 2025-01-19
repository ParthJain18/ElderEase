import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, {$set:req.body}, {new:true}).select("-password");
        res.status(200).json({success:true, message: 'Doctor updated successfully', data: updatedDoctor});
    } catch (error) {
        res.status(500).json({success:false, message: 'Failed to update'});
        
    }
}

export const deleteDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({success:true, message: 'Doctor deleted successfully'});
        
    } catch (error) {
        res.status(500).json({success:false, message: 'Failed to delete'});
    }
}

export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        const doctor =  await Doctor.findById(id).select("-password");
        res.status(200).json({success:true, message: 'Doctor found', data: doctor});
        
    } catch (error) {
        res.status(404).json({success:false, message: 'Doctor not found'});
    }
}

export const getAllDoctor = async (req, res) => {
    try {
        const {query} = req.query;
        let doctors;
        if(query){
            doctors = await Doctor.find({isApproved:'approved',
            $or:[{name: {$regex: query, $options:"i"}}, {specialization: {$regex: query, $options:"i"}}, ], }).select("-password");
            console.log(doctors);
        }
        else{
            doctors = await Doctor.find({}).select("-password");
        }
        res.status(200).json({success:true, message: 'Doctors found', data: doctors});
        
    } catch (error) {
        res.status(404).json({success:false, message: 'Doctors not found'});
    }
}



export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;
    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({success:false, message: 'Doctor not found'});
        }
        const {password, ...rest} = doctor._doc;
        const appointments = await Booking.find({doctor:doctorId})
        res.status(200).json({success:true, message: 'Profile Info is Getting', data: {...rest, appointments}});
    } catch (err) {
        res.status(500).json({success:false, message: 'Something went wrong'});
    }
}