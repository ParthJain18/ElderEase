import Caretaker from '../models/CareTakerSchema.js';

const createCaretaker = async ({
  name,
  email,
  phone,
  age,
  resume,
  aadhaar,
  gender,
}) => {
  // Validate input
  if (!name || !email || !phone || !age || !resume || !aadhaar || !gender) {
    throw new Error('Invalid input. All fields are required.');
  }

  try {
    // Create caretaker entry
    const caretaker = await Caretaker.create({
      name,
      email,
      phone,
      age,
      resume,
      aadhaar,
      gender,
    });

   
    return caretaker;
  } catch (error) {
    throw new Error(`Error creating caretaker: ${error.message}`);
  }
};

export default createCaretaker;