const careTakerModel = require('../model/careTakerModel');

module.exports.createCaretaker = async ({
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

  // Create caretaker entry
  const caretaker = await careTakerModel.create({
    name,
    email,
    phone,
    age,
    resume,
    aadhaar,
    gender,
  });

  return caretaker;
};