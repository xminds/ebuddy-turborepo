import express from 'express';
import { updateUserData, fetchUserData, signupUser } from '../controller/api';
import { authMiddleware } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';

const router = express.Router();

// Route to update user data (with authentication middleware)
router.post('/signup', async (req: Request, res: Response) => {
    try {
      await signupUser(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update user data (with authentication middleware)
router.put('/update-user-data/:uid', authMiddleware, async (req: Request, res: Response) => {
    try {
      await updateUserData(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch user data (with authentication middleware)
router.get('/fetch-user-data/:uid', authMiddleware, async (req: Request, res: Response) => {
    try {
      await fetchUserData(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };
