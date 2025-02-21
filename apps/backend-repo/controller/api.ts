import { Request, Response } from 'express';
import { db, auth} from '../config/firebaseConfig';
import { User } from '../entities/user';
import bcrypt from 'bcryptjs';

// CreateRequest interface that includes firebaseRef
interface CreateRequest {
    email: string;
    displayName: string;
    firebaseRef?: any;
    bio:string;
    designation: string;
    password: any
  }
// Update user data in Firestore
const updateUserData = async (req: Request, res: Response) => {

  const { uid } = req.params;
  const {  email, displayName, bio, designation } = req.body;
  try {
    const userRef = db.collection('User').doc(uid);
    await userRef.set({
      email,
      displayName,
      bio,
      designation,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    
    const userDoc = await userRef.get();
    const userData: User = userDoc.data() as User;
    res.status(200).json({ message: 'User data updated successfully', data: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user data', error });
  }
};

// Fetch user data from Firestore
const fetchUserData = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const userRef = db.collection('User').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData: User = userDoc.data() as User;
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

// Signup function with Firestore data addition
const signupUser = async (req: Request, res: Response) => {
    try {
      const { email, password, displayName } = req.body;
  
      // Ensure required fields are provided
      if (!email || !password || !displayName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const hashedPassword = await hashPassword(password);

      // Create user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });
  
      // Generate user object with additional data
      const userData: CreateRequest = {
        email: userRecord.email!,
        displayName: userRecord.displayName!,
        firebaseRef: userRecord.uid,
        bio: "",
        designation: "",
        password: hashedPassword,
      };
  
      // Store user data in Firestore
      await db.collection('User').doc(userRecord.uid).set(userData);
  
      // Respond with success
      res.status(201).json({ message: 'User created successfully', user: userData });
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(400).json({ message: 'Error creating user', error: error.message });
    }
  };
  
  const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10); // 10 rounds of salting (you can increase it for more security)
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
export { updateUserData, fetchUserData, signupUser };

