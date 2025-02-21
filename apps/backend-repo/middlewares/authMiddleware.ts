import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      // Responding with 403 if no token is found in request header
      return res.status(403).json({ message: 'No token provided' });
    }

    // Verifying token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    // Catch error if token verification fails and respond with 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export { authMiddleware };
