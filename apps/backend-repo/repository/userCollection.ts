import { db } from '../config/firebaseConfig';
import { User } from "@ebuddy/shared/types/user";

const updateUser = async (uid: string, userData: Partial<User>) => {
  try {
    const userRef = db.collection('USERS').doc(uid);
    await userRef.set(userData, { merge: true });
  } catch (error) {
    throw new Error('Error updating user data');
  }
};

const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userRef = db.collection('USERS').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data() as User;
  } catch (error) {
    throw new Error('Error fetching user data');
  }
};

export { updateUser, getUser };
