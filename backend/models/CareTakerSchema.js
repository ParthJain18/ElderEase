import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const caretakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  resume: { type: String, required: true },
  aadhaar: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
}, { timestamps: true });

caretakerSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
caretakerSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
caretakerSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}
const Caretaker= mongoose.model('Caretaker', caretakerSchema);
export default Caretaker;