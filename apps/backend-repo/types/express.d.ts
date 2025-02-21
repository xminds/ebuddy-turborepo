// types/express.d.ts
import * as admin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;  // Add the user property to Request
    }
  }
}
