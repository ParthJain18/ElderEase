import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


const generateToken = user => {
    return jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET_KEY, {expiresIn: '15d'});
}



export const register =  async (req, res) => {
    const {email, password, name, role, photo, gender} = req.body;
    try {
        let user = null;
        if(role==='patient'){
            user = await User.findOne({email});
        }
        else if(role==='doctor'){
            user = await Doctor.findOne({email});
        }

        if(user){
            return res.status(400).json({msg: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if(role==='patient'){
            user = new User({
                email,
                password: hashPassword,
                name,
                role,
                photo
            });
        }
        if(role==='doctor'){
            user = new Doctor({
                email,
                password: hashPassword,
                name,
                role,
                photo
            });
        }

        await user.save();
        res.status(200).json({success:true, message: 'User registered successfully'});

    } catch (error) {
        res.status(500).json({success:true, message: 'Error hain bc'});
        
    }
}

export const login = async (req, res) => {
    const {email} = req.body;
    try {
        let user = null;
        const patient = await User.findOne({email});
        const doctor = await Doctor.findOne({email})
        if(patient) user = patient;
        if(doctor) user = doctor;

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({status: false, msg: 'Invalid credentials'});
        }

        // const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        // res.cookie('token', token, {httpOnly: true});

        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc;
        res.status(200).json({status: true, message:"Login Successful", token, data: {...rest}, role});

    } catch (error) {
        return res.status(500).json({status: false, msg: 'Failed to login'});
        
    }
}