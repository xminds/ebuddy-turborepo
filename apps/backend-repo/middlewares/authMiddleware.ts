import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    // Verifying token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export { authMiddleware };
