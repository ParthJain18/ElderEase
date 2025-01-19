import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {$set:req.body}, {new:true}).select("-password");
        res.status(200).json({success:true, message: 'User updated successfully', data: updatedUser});
    } catch (error) {
        res.status(500).json({success:false, message: 'Failed to update'});
        
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({success:true, message: 'User deleted successfully'});
        
    } catch (error) {
        res.status(500).json({success:false, message: 'Failed to delete'});
    }
}

export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user =  await User.findById(id).select("-password");
        res.status(200).json({success:true, message: 'User found', data: user});
        
    } catch (error) {
        res.status(404).json({success:false, message: 'User not found'});
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users =  await User.find({}).select("-password");
        res.status(200).json({success:true, message: 'Users found', data: users});
        
    } catch (error) {
        res.status(404).json({success:false, message: 'Users not found'});
    }
}


export const getUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message: 'User not found'});
        }
        const {password, ...rest} = user._doc;
        res.status(200).json({success:true, message: 'Profile Info is Getting', data: {...rest}});
    } catch (err) {
        res.status(500).json({success:false, message: 'Something went wrong'});
    }
}

export const getMyAppointments = async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.userId})
        const doctorIds = bookings.map(el=>el.doctors.id)
        const doctors = await Doctor.find({_id:{$in:doctorIds}}).select("-password");
        res.status(200).json({success:true, message: 'Appointments found', data: doctors});
    } catch (err) {
        res.status(500).json({success:false, message: 'Something went wrong'});
    }
}