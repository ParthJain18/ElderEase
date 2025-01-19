import express from 'express';
import { create, finish, get, index, search, update } from "../Controllers/ScheduleController.js";

const router = express.Router();

router.get('/', index);
router.post('/', create);
router.put('/:id', update);
router.get('/:id', get);
router.post('/finish', finish);
router.get('/search', search);


export default router;