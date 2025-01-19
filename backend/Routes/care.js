import express from 'express';
import { body } from 'express-validator';
import createCaretaker from '../Controllers/careTakerController.js';

const router = express.Router();

router.post('/careTakerForm', [
    body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
    body('email')
    .isEmail()
    .withMessage('Invalid Email format'),
    body('phone')
    .isMobilePhone()
    .withMessage('Invalid phone number'),
    body('age')
    .isInt({ min: 18 })
    .withMessage('Age must be 18 or older'),
    body('resume').notEmpty(),
    body('aadhaar').notEmpty(),
    body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be either male or female'),   
  ], async (req, res) => {
    try {
      const caretaker = await createCaretaker(req.body);
      res.status(201).json(caretaker);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;