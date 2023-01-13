import express from 'express';

import { gosignin, signin, signup} from '../controllers/user.js'; // .js is needed for node, not compulsory for react

const router = express.Router();

router.post('/gosignin', gosignin);
router.post('/signin', signin);
router.post('/signup', signup);

export default router;
